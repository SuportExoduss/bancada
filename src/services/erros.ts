import { FirebaseError } from 'firebase/app';

/**
 * Traduz o erro do Firebase para uma frase que a pessoa entenda.
 *
 * O SDK devolve coisas como `auth/email-already-in-use`. Mostrar isso na tela
 * é empurrar para o usuário um problema que é nosso — e ainda por cima em
 * inglês, com barra no meio.
 *
 * O padrão é deliberadamente vago ("não deu para..."): mensagem de erro
 * detalhada demais vira mapa para quem está testando o que existe. Aqui só
 * dizemos o que ajuda quem está de boa-fé.
 */
const MENSAGENS: Record<string, string> = {
  'auth/email-already-in-use': 'Esse e-mail já tem conta na BANCADA. Tente entrar.',
  'auth/invalid-email': 'Esse e-mail não parece válido.',
  'auth/weak-password': 'Essa senha é fraca demais. Use pelo menos 8 caracteres, com letra e número.',
  'auth/user-disabled': 'Esta conta está suspensa. Fale com a gente.',

  // Os três abaixo dizem a MESMA coisa de propósito. Distinguir "e-mail não
  // existe" de "senha errada" entrega para qualquer um a lista de quem tem
  // conta aqui.
  'auth/user-not-found': 'E-mail ou senha não conferem.',
  'auth/wrong-password': 'E-mail ou senha não conferem.',
  'auth/invalid-credential': 'E-mail ou senha não conferem.',

  'auth/too-many-requests': 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.',
  'auth/network-request-failed': 'Sem conexão. Confira a internet e tente de novo.',
  'auth/requires-recent-login': 'Por segurança, entre de novo antes de fazer isso.',

  'permission-denied': 'Você não tem permissão para isso.',
  unavailable: 'O serviço está fora do ar no momento. Tente de novo em instantes.',
};

export function mensagemDoErro(erro: unknown): string {
  if (erro instanceof FirebaseError && MENSAGENS[erro.code]) {
    return MENSAGENS[erro.code];
  }
  if (erro instanceof ApelidoTomadoNaCorrida) {
    return 'Alguém acabou de pegar esse apelido. Escolha outro.';
  }
  return 'Não deu para completar agora. Tente de novo.';
}

/**
 * O apelido estava livre quando a tela conferiu, mas foi tomado antes de
 * salvar.
 *
 * A janela é de segundos e vai acontecer pouco — mas vai acontecer, e a
 * diferença entre tratar e não tratar é a pessoa ver "escolha outro" ou ver o
 * cadastro morrer sem explicação.
 */
export class ApelidoTomadoNaCorrida extends Error {
  constructor(readonly apelido: string) {
    super(`apelido tomado na corrida: ${apelido}`);
    this.name = 'ApelidoTomadoNaCorrida';
  }
}

/** A autenticação existe mas o perfil não foi gravado (ver D-024). */
export class ContaSemPerfil extends Error {
  constructor(readonly uid: string) {
    super(`conta sem perfil: ${uid}`);
    this.name = 'ContaSemPerfil';
  }
}
