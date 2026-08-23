/**
 * Testes do fluxo de conta contra o Emulator Suite.
 *
 * Exercita o que as Rules sozinhas nao alcancam: a ordem das operacoes, o
 * lote atomico e o desfazer da autenticacao quando o lote falha (D-024).
 */
import { initializeApp, deleteApp } from 'firebase/app';
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  connectFirestoreEmulator,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

const cfg = { apiKey: 'fake', projectId: 'bancada-2ce451', appId: '1:1:web:1' };

function novaInstancia(nome) {
  const app = initializeApp(cfg, nome);
  const auth = getAuth(app);
  const db = getFirestore(app);
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, 'localhost', 8080);
  return { app, auth, db };
}

let passou = 0, falhou = 0;
async function caso(rotulo, fn) {
  try { await fn(); console.log('ok    ' + rotulo); passou++; }
  catch (e) { console.log('FALHA ' + rotulo); console.log('        ' + String(e.message).split('\n')[0]); falhou++; }
}
const igual = (a, b, msg) => { if (a !== b) throw new Error(`${msg}: esperava ${b}, veio ${a}`); };

// Reimplementa o lote do contaService (o servico importa react-native e nao
// roda em Node puro). A logica gravada e a mesma.
async function criar(inst, email, senha, perfilParcial) {
  const cred = await createUserWithEmailAndPassword(inst.auth, email, senha);
  const uid = cred.user.uid;
  const chave = perfilParcial.apelido.toLowerCase();
  const lote = writeBatch(inst.db);
  lote.set(doc(inst.db, 'apelidos', chave), { uid, criadoEm: serverTimestamp() });
  lote.set(doc(inst.db, 'usuarios', uid), {
    nome: perfilParcial.nome, sobrenome: perfilParcial.sobrenome,
    apelido: perfilParcial.apelido, apelidoChave: chave,
    nascimento: perfilParcial.nascimento, faixa: perfilParcial.faixa,
    ...(perfilParcial.responsavelUid ? { responsavelUid: perfilParcial.responsavelUid } : {}),
    criadoEm: serverTimestamp(),
  });
  try { await lote.commit(); }
  catch (e) { await cred.user.delete().catch(() => {}); throw e; }
  return uid;
}

const A = novaInstancia('a');
const B = novaInstancia('b');

const ADULTO = { nome: 'Roberto', sobrenome: 'Silva', apelido: 'Roberto_Silva', nascimento: '15/07/1988', faixa: 'adulto' };

console.log('--- criar conta ---');

let uidPai;
await caso('cria conta e grava apelido e perfil juntos', async () => {
  uidPai = await criar(A, 'pai@teste.com', 'senha123', ADULTO);
  const perfil = await getDoc(doc(A.db, 'usuarios', uidPai));
  const apelido = await getDoc(doc(A.db, 'apelidos', 'roberto_silva'));
  igual(perfil.exists(), true, 'perfil gravado');
  igual(apelido.exists(), true, 'apelido reservado');
  igual(apelido.data().uid, uidPai, 'apelido aponta para o dono');
});

await caso('maiuscula na digitacao vira chave minuscula', async () => {
  const p = await getDoc(doc(A.db, 'usuarios', uidPai));
  igual(p.data().apelido, 'Roberto_Silva', 'exibicao preserva maiuscula');
  igual(p.data().apelidoChave, 'roberto_silva', 'chave em minuscula');
});

console.log('--- apelido duplicado ---');

await caso('segunda pessoa NAO consegue o mesmo apelido', async () => {
  let deu = false;
  try { await criar(B, 'outro@teste.com', 'senha123', ADULTO); deu = true; } catch { /* esperado */ }
  igual(deu, false, 'deveria falhar');
});

await caso('e a autenticacao da tentativa falha foi DESFEITA (D-024)', async () => {
  // Se a conta orfa tivesse ficado, entrar com ela funcionaria.
  let entrou = false;
  try { await signInWithEmailAndPassword(B.auth, 'outro@teste.com', 'senha123'); entrou = true; } catch { /* esperado */ }
  igual(entrou, false, 'a autenticacao orfa deveria ter sido apagada');
});

await caso('maiuscula diferente tambem e recusada', async () => {
  let deu = false;
  try { await criar(B, 'terceiro@teste.com', 'senha123', { ...ADULTO, apelido: 'ROBERTO_SILVA' }); deu = true; } catch { /* esperado */ }
  igual(deu, false, 'ROBERTO_SILVA e o mesmo que roberto_silva');
});

console.log('--- conta de menor ---');

await caso('conta de menor nasce ligada ao responsavel', async () => {
  const uidFilho = await criar(B, 'filho@teste.com', 'senha123', {
    nome: 'Pedro', sobrenome: 'Silva', apelido: 'Pedrinho_VZ',
    nascimento: '20/05/2012', faixa: 'precisa_responsavel', responsavelUid: uidPai,
  });
  const p = await getDoc(doc(B.db, 'usuarios', uidFilho));
  igual(p.data().responsavelUid, uidPai, 'vinculo gravado');
});

await caso('a sessao do responsavel NAO foi derrubada', async () => {
  igual(A.auth.currentUser?.uid, uidPai, 'o pai continua logado na instancia principal');
});

console.log('--- login ---');

await caso('entra com a senha certa', async () => {
  await signOut(A.auth);
  const cred = await signInWithEmailAndPassword(A.auth, 'pai@teste.com', 'senha123');
  igual(cred.user.uid, uidPai, 'mesmo uid');
});

await caso('NAO entra com a senha errada', async () => {
  let entrou = false;
  try { await signInWithEmailAndPassword(A.auth, 'pai@teste.com', 'errada999'); entrou = true; } catch { /* esperado */ }
  igual(entrou, false, 'senha errada deveria falhar');
});

await caso('perfil e legivel sem estar logado', async () => {
  const C = novaInstancia('c');
  const p = await getDoc(doc(C.db, 'usuarios', uidPai));
  igual(p.exists(), true, 'perfil publico (D-015)');
  await deleteApp(C.app);
});

await deleteApp(A.app);
await deleteApp(B.app);

console.log('');
console.log(passou + ' passaram, ' + falhou + ' falharam');
process.exit(falhou ? 1 : 0);
