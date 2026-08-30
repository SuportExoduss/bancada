/**
 * Fluxo de seguir, contra o emulador.
 *
 * Cobre o que as Rules sozinhas nao alcancam: contagem, o feed de quem sigo,
 * e o comportamento com mais de 30 seguidos -- que e onde o limite do
 * operador `in` aparece.
 */
import { initializeApp, deleteApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, signInAnonymously } from 'firebase/auth';
import {
  collection, connectFirestoreEmulator, doc, getCountFromServer, getDocs,
  getFirestore, limit, orderBy, query, serverTimestamp, setDoc, where, deleteDoc,
} from 'firebase/firestore';

const cfg = { apiKey: 'fake', projectId: 'bancada-2ce451', appId: '1:1:web:1' };
const app = initializeApp(cfg, 'seguir');
const auth = getAuth(app); const db = getFirestore(app);
connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
connectFirestoreEmulator(db, 'localhost', 8080);

let passou = 0, falhou = 0;
async function caso(rot, fn) {
  try { await fn(); console.log('ok    ' + rot); passou++; }
  catch (e) { console.log('FALHA ' + rot); console.log('        ' + String(e.message).split('\n')[0]); falhou++; }
}
const igual = (a, b, m) => { if (a !== b) throw new Error(m + ': esperava ' + b + ', veio ' + a); };

const { user } = await signInAnonymously(auth);
const EU = user.uid;

const MAX_IN = 30;
const vinc = (a, b) => doc(db, 'seguidores', a + '_' + b);

console.log('--- contagem ---');

await caso('seguir grava o vinculo e a contagem sobe', async () => {
  await setDoc(vinc(EU, 'alvo1'), { seguidorUid: EU, alvoUid: 'alvo1', criadoEm: serverTimestamp() });
  const c = await getCountFromServer(query(collection(db, 'seguidores'), where('alvoUid', '==', 'alvo1')));
  igual(c.data().count, 1, 'seguidores de alvo1');
});

await caso('deixar de seguir derruba a contagem', async () => {
  await deleteDoc(vinc(EU, 'alvo1'));
  const c = await getCountFromServer(query(collection(db, 'seguidores'), where('alvoUid', '==', 'alvo1')));
  igual(c.data().count, 0, 'seguidores de alvo1');
});

console.log('--- feed de quem sigo ---');

await caso('feed traz post de quem sigo e ignora de quem nao sigo', async () => {
  // Semeia pela API REST do emulador, que ignora as regras.
  //
  // A primeira versao deste teste gravava os posts pelo SDK e levava
  // PERMISSION_DENIED -- e a regra estava CERTA: ela impede gravar post no
  // nome de outra pessoa. Semear e diferente de usar, e precisa de outra porta.
  const semear = async (id, autorUid, texto) => {
    const r = await fetch(
      'http://localhost:8080/v1/projects/bancada-2ce451/databases/(default)/documents/posts?documentId=' + id,
      { method: 'POST',
        // `Bearer owner` e o passe de administrador do emulador: sem ele o
        // REST tambem obedece as regras e devolve 403.
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' },
        body: JSON.stringify({ fields: {
          autorUid: { stringValue: autorUid },
          autorApelido: { stringValue: autorUid },
          autorNome: { stringValue: autorUid },
          texto: { stringValue: texto },
          criadoEm: { timestampValue: new Date().toISOString() },
        } }) });
    if (!r.ok) throw new Error('nao consegui semear: ' + r.status);
  };
  await semear('p_do_amigo', 'amigo', 'post do amigo');
  await semear('p_do_estranho', 'estranho', 'post do estranho');
  await setDoc(vinc(EU, 'amigo'), { seguidorUid: EU, alvoUid: 'amigo', criadoEm: serverTimestamp() });

  const meus = await getDocs(query(collection(db, 'seguidores'), where('seguidorUid', '==', EU)));
  const alvos = meus.docs.map(d => d.data().alvoUid);
  igual(alvos.length, 1, 'quantos eu sigo');

  const feed = await getDocs(query(collection(db, 'posts'),
    where('autorUid', 'in', alvos), orderBy('criadoEm', 'desc'), limit(20)));
  const textos = feed.docs.map(d => d.data().texto);
  igual(textos.length, 1, 'posts no feed');
  igual(textos[0], 'post do amigo', 'de quem e o post');
});

console.log('--- o limite de 30 ---');

await caso('mais de 30 seguidos exige dividir em blocos', async () => {
  const muitos = Array.from({ length: 47 }, (_, i) => 'alvo' + i);
  const blocos = [];
  for (let i = 0; i < muitos.length; i += MAX_IN) blocos.push(muitos.slice(i, i + MAX_IN));
  igual(blocos.length, 2, 'quantos blocos para 47');
  igual(blocos[0].length, 30, 'tamanho do primeiro bloco');
  igual(blocos[1].length, 17, 'tamanho do segundo bloco');

  // E cada bloco tem que ser aceito pelo Firestore.
  for (const b of blocos) {
    await getDocs(query(collection(db, 'posts'), where('autorUid', 'in', b), limit(1)));
  }
});

await caso('a uniao de listas ordenadas precisa ser reordenada', async () => {
  // Duas listas ordenadas por dentro nao formam uma lista ordenada juntas.
  const blocoA = [{ t: 300 }, { t: 100 }];
  const blocoB = [{ t: 200 }, { t: 50 }];
  const juntos = [...blocoA, ...blocoB].sort((x, y) => y.t - x.t);
  igual(juntos.map(x => x.t).join(','), '300,200,100,50', 'ordem final');
});

await deleteApp(app);
console.log('');
console.log(passou + ' passaram, ' + falhou + ' falharam');
process.exit(falhou ? 1 : 0);
