import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  writeBatch,
  type Firestore,
} from 'firebase/firestore';

import { chaveDoApelido } from '../domain/profile';
import type { FaixaEtaria } from '../domain/idade';
import { auth as authPrincipal, db as dbPrincipal, firebaseSecundario } from '../infrastructure/firebase/app';
import { ApelidoTomadoNaCorrida, ContaSemPerfil } from './erros';

export const COLECAO_USUARIOS = 'usuarios';
export const COLECAO_APELIDOS = 'apelidos';

export interface DadosDaConta {
  email: string;
  senha: string;
  nome: string;
  sobrenome: string;
  /** Como a pessoa escreveu — preserva as maiúsculas */
  apelido: string;
  /** DD/MM/AAAA */
  nascimento: string;
  faixa: FaixaEtaria;
  /** Preenchido só quando a conta é de menor criada pelo responsável */
  responsavelUid?: string;
}

export interface Perfil {
  uid: string;
  nome: string;
  sobrenome: string;
  apelido: string;
  apelidoChave: string;
  nascimento: string;
  faixa: FaixaEtaria;
  responsavelUid?: string;
}

/**
 * Cria a conta inteira: autenticação, reserva do apelido e perfil.
 *
 * ## O problema que esta função existe para resolver
 *
 * A D-024 diz que nada é criado até o botão final. Mas sem Cloud Functions
 * (D-012) não há transação que cubra autenticação e banco ao mesmo tempo — são
 * dois serviços diferentes, chamados do cliente. Se a segunda parte falhar,
 * sobra uma autenticação sem perfil: a **conta órfã**, exatamente o que a
 * D-024 quer evitar.
 *
 * Três camadas tratam isso, da mais forte para a mais fraca:
 *
 * 1. **Lote atômico.** A reserva do apelido e o perfil vão num `writeBatch`.
 *    O Firestore grava os dois ou nenhum. Não existe estado com apelido
 *    reservado e perfil faltando.
 *
 * 2. **Desfazer a autenticação.** Se o lote falhar, apagamos o usuário recém
 *    criado. Dá para fazer porque acabamos de entrar como ele — é o único
 *    momento em que o cliente tem permissão para isso.
 *
 * 3. **Retomar no próximo login.** Se nem o apagar funcionar (a rede caiu no
 *    pior instante possível), a órfã existe. `perfilDe()` devolve `null` e o
 *    app manda a pessoa terminar o cadastro em vez de travar numa tela vazia.
 *
 * A janela que sobra é: lote falha **e** exclusão falha. Estreita, e tratada.
 */
export async function criarConta(dados: DadosDaConta): Promise<Perfil> {
  // Conta de menor nasce numa instância separada para não derrubar a sessão
  // do responsável — ver `firebaseSecundario()`.
  const ehDeMenor = Boolean(dados.responsavelUid);
  const { auth, db } = ehDeMenor
    ? firebaseSecundario()
    : { auth: authPrincipal, db: dbPrincipal };

  const credencial = await createUserWithEmailAndPassword(auth, dados.email, dados.senha);
  const uid = credencial.user.uid;

  try {
    const perfil = await gravarApelidoEPerfil(db, uid, dados);

    // A sessão do filho já cumpriu o papel: ela existia só para o lote passar
    // pelas regras (que exigem `request.auth.uid == uid`). Sair evita deixar
    // uma sessão pendurada na instância secundária.
    if (ehDeMenor) await signOut(auth);

    return perfil;
  } catch (erro) {
    await desfazerAutenticacao(credencial.user);
    throw erro;
  }
}

/**
 * Grava a reserva do apelido e o perfil **de uma vez só**.
 *
 * O `create` da reserva não sobrescreve: as regras negam `update` em
 * `/apelidos`, então se o documento já existir o lote inteiro é recusado. É
 * assim que a unicidade vira garantia do banco em vez de uma corrida entre
 * dois clientes.
 */
async function gravarApelidoEPerfil(
  db: Firestore,
  uid: string,
  dados: DadosDaConta,
): Promise<Perfil> {
  const apelido = dados.apelido.trim();
  const apelidoChave = chaveDoApelido(apelido);

  const lote = writeBatch(db);

  lote.set(doc(db, COLECAO_APELIDOS, apelidoChave), {
    uid,
    criadoEm: serverTimestamp(),
  });

  const perfil = {
    nome: dados.nome.trim(),
    sobrenome: dados.sobrenome.trim(),
    apelido,
    apelidoChave,
    nascimento: dados.nascimento,
    faixa: dados.faixa,
    ...(dados.responsavelUid ? { responsavelUid: dados.responsavelUid } : {}),
    criadoEm: serverTimestamp(),
  };

  lote.set(doc(db, COLECAO_USUARIOS, uid), perfil);

  try {
    await lote.commit();
  } catch (erro) {
    // `permission-denied` aqui quase sempre quer dizer que a reserva do
    // apelido bateu num documento que já existe — a regra nega `update`.
    // Traduzir para o erro certo é o que faz a tela dizer "escolha outro" em
    // vez de "algo deu errado".
    if (erro instanceof Error && 'code' in erro && erro.code === 'permission-denied') {
      throw new ApelidoTomadoNaCorrida(apelidoChave);
    }
    throw erro;
  }

  return { uid, ...perfil, criadoEm: undefined } as unknown as Perfil;
}

/**
 * Apaga a autenticação recém-criada quando o resto falhou.
 *
 * Silencia o próprio erro de propósito: quem chama já tem um erro para
 * mostrar, o da causa real. Se a limpeza também falhar, quem resolve é a
 * retomada no próximo login — e trocar a mensagem da causa pela da limpeza
 * esconderia o que de fato aconteceu.
 */
async function desfazerAutenticacao(usuario: User): Promise<void> {
  try {
    await deleteUser(usuario);
  } catch {
    console.warn(
      '[BANCADA] Não deu para apagar a autenticação após falha no cadastro. ' +
        'A conta ficará sem perfil e o cadastro será retomado no próximo login (D-024).',
    );
  }
}

/** O perfil de um usuário, ou `null` se a conta existir sem perfil. */
export async function perfilDe(uid: string): Promise<Perfil | null> {
  const instantaneo = await getDoc(doc(dbPrincipal, COLECAO_USUARIOS, uid));
  if (!instantaneo.exists()) return null;
  return { uid, ...instantaneo.data() } as Perfil;
}

/**
 * Entra na conta e **confere se o perfil existe**.
 *
 * A conferência é a terceira camada da D-024: autenticação sem perfil não é
 * uma conta utilizável, e deixar a pessoa entrar num app sem nome nem apelido
 * seria pior que dizer que falta terminar o cadastro.
 */
export async function entrar(email: string, senha: string): Promise<Perfil> {
  const credencial = await signInWithEmailAndPassword(authPrincipal, email.trim(), senha);
  const perfil = await perfilDe(credencial.user.uid);
  if (!perfil) throw new ContaSemPerfil(credencial.user.uid);
  return perfil;
}

export async function sair(): Promise<void> {
  await signOut(authPrincipal);
}

/**
 * Manda o e-mail de recuperação de senha.
 *
 * Não diz se o e-mail existe. O Firebase pode devolver `user-not-found`, e
 * repassar isso para a tela transformaria a recuperação de senha num
 * verificador de quem tem conta na BANCADA.
 */
export async function recuperarSenha(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(authPrincipal, email.trim());
  } catch (erro) {
    if (erro instanceof Error && 'code' in erro && erro.code === 'auth/user-not-found') return;
    throw erro;
  }
}

export function usuarioAtual(): User | null {
  return authPrincipal.currentUser;
}

export { type Auth };
