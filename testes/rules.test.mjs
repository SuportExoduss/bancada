/**
 * Testes das Security Rules do Firestore.
 *
 * Sem Cloud Functions (D-012) toda escrita vem do cliente: estas regras sao a
 * UNICA barreira real. Escrever regra sem testar e confiar num arquivo que
 * ninguem nunca executou.
 */

import { readFileSync } from 'node:fs';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const ambiente = await initializeTestEnvironment({
  projectId: 'bancada-teste-regras',
  firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: 'localhost', port: 8080 },
});

const ADULTO = {
  nome: 'Roberto',
  sobrenome: 'Silva',
  apelido: 'Roberto_Silva',
  apelidoChave: 'roberto_silva',
  nascimento: '15/07/1988',
  faixa: 'adulto',
  criadoEm: serverTimestamp(),
};

const MENOR = {
  nome: 'Pedro',
  sobrenome: 'Silva',
  apelido: 'Pedrinho_VZ',
  apelidoChave: 'pedrinho_vz',
  nascimento: '20/05/2012',
  faixa: 'precisa_responsavel',
  responsavelUid: 'pai123',
  criadoEm: serverTimestamp(),
};

let passou = 0;
let falhou = 0;

async function caso(rotulo, fn) {
  try {
    await fn();
    console.log('ok    ' + rotulo);
    passou++;
  } catch (e) {
    console.log('FALHA ' + rotulo);
    console.log('        ' + String(e.message).split('\n')[0]);
    falhou++;
  }
}

const anonimo = () => ambiente.unauthenticatedContext().firestore();
const como = (uid) => ambiente.authenticatedContext(uid).firestore();

console.log('--- apelidos ---');

await caso('qualquer um confere se um apelido esta livre', async () => {
  await assertSucceeds(getDoc(doc(anonimo(), 'apelidos/qualquer_um')));
});

await caso('logado reserva apelido para si', async () => {
  await assertSucceeds(
    setDoc(doc(como('ana'), 'apelidos/ana_vz'), { uid: 'ana', criadoEm: serverTimestamp() }),
  );
});

await caso('NAO reserva apelido no nome de outra pessoa', async () => {
  await assertFails(
    setDoc(doc(como('ana'), 'apelidos/do_bruno'), { uid: 'bruno', criadoEm: serverTimestamp() }),
  );
});

await caso('deslogado NAO reserva apelido', async () => {
  await assertFails(
    setDoc(doc(anonimo(), 'apelidos/fantasma'), { uid: 'x', criadoEm: serverTimestamp() }),
  );
});

await caso('NAO toma apelido que ja existe', async () => {
  await assertFails(
    setDoc(doc(como('bruno'), 'apelidos/ana_vz'), { uid: 'bruno', criadoEm: serverTimestamp() }),
  );
});

await caso('nem o dono altera a propria reserva', async () => {
  await assertFails(updateDoc(doc(como('ana'), 'apelidos/ana_vz'), { uid: 'outro' }));
});

await caso('nem o dono apaga a propria reserva', async () => {
  await assertFails(deleteDoc(doc(como('ana'), 'apelidos/ana_vz')));
});

await caso('NAO reserva chave com maiuscula', async () => {
  await assertFails(
    setDoc(doc(como('ana'), 'apelidos/Ana_VZ'), { uid: 'ana', criadoEm: serverTimestamp() }),
  );
});

await caso('NAO reserva apelido curto demais', async () => {
  await assertFails(
    setDoc(doc(como('ana'), 'apelidos/ab'), { uid: 'ana', criadoEm: serverTimestamp() }),
  );
});

await caso('NAO reserva com campo extra', async () => {
  await assertFails(
    setDoc(doc(como('ana'), 'apelidos/ana_dois'), {
      uid: 'ana',
      criadoEm: serverTimestamp(),
      admin: true,
    }),
  );
});

console.log('--- acambarcamento de apelido ---');

await caso('quem ainda nao tem perfil reserva UM apelido', async () => {
  await assertSucceeds(
    setDoc(doc(como('novato'), 'apelidos/novato_vz'), { uid: 'novato', criadoEm: serverTimestamp() }),
  );
});

// LIMITE CONHECIDO, medido e nao escondido: quem NUNCA completa o cadastro
// ainda reserva quantos apelidos quiser. As regras do Firestore avaliam cada
// documento contra o estado ANTERIOR a escrita e nao sabem consultar "quantos
// documentos este uid ja tem" -- entao "um apelido por pessoa" nao e
// exprimivel aqui. Fecha de verdade so com Cloud Functions (D-012 proibe) ou
// App Check. Registrado na D-030.
await caso('LIMITE: conta sem perfil ainda reserva varios (esperado, ver D-030)', async () => {
  await assertSucceeds(
    setDoc(doc(como('novato'), 'apelidos/segundo_dele'), {
      uid: 'novato',
      criadoEm: serverTimestamp(),
    }),
  );
});

await caso('quem JA tem perfil nao reserva mais nenhum', async () => {
  await assertSucceeds(setDoc(doc(como('comperfil'), 'usuarios/comperfil'), {
    ...ADULTO, apelido: 'Com_Perfil', apelidoChave: 'com_perfil',
  }));
  await assertFails(
    setDoc(doc(como('comperfil'), 'apelidos/neymar'), { uid: 'comperfil', criadoEm: serverTimestamp() }),
  );
});

console.log('--- usuarios ---');

await caso('perfil e publico (D-015)', async () => {
  await assertSucceeds(getDoc(doc(anonimo(), 'usuarios/qualquer')));
});

await caso('cria o proprio perfil de adulto', async () => {
  await assertSucceeds(setDoc(doc(como('rob'), 'usuarios/rob'), ADULTO));
});

await caso('NAO cria perfil no lugar de outra pessoa', async () => {
  await assertFails(setDoc(doc(como('rob'), 'usuarios/outro'), ADULTO));
});

await caso('NAO cria se apelido e chave discordam', async () => {
  await assertFails(
    setDoc(doc(como('c1'), 'usuarios/c1'), { ...ADULTO, apelidoChave: 'outra_coisa' }),
  );
});

await caso('NAO cria com faixa inventada', async () => {
  await assertFails(setDoc(doc(como('c2'), 'usuarios/c2'), { ...ADULTO, faixa: 'deus' }));
});

await caso('NAO cria com data fora do formato', async () => {
  await assertFails(setDoc(doc(como('c3'), 'usuarios/c3'), { ...ADULTO, nascimento: '1988' }));
});

await caso('NAO cria com nome de uma letra', async () => {
  await assertFails(setDoc(doc(como('c4'), 'usuarios/c4'), { ...ADULTO, nome: 'R' }));
});

await caso('NAO cria com campo extra inventado', async () => {
  await assertFails(setDoc(doc(como('c5'), 'usuarios/c5'), { ...ADULTO, verificado: true }));
});

console.log('--- vinculo do menor ---');

await caso('menor de 16 COM responsavel: pode', async () => {
  await assertSucceeds(setDoc(doc(como('ped'), 'usuarios/ped'), MENOR));
});

await caso('menor de 16 SEM responsavel: nao pode', async () => {
  const semVinculo = { ...MENOR };
  delete semVinculo.responsavelUid;
  await assertFails(setDoc(doc(como('v1'), 'usuarios/v1'), semVinculo));
});

await caso('adulto NAO pode ter responsavel pendurado', async () => {
  await assertFails(
    setDoc(doc(como('v2'), 'usuarios/v2'), { ...ADULTO, responsavelUid: 'alguem' }),
  );
});

console.log('--- alteracao ---');

await caso('dono edita o proprio nome', async () => {
  await assertSucceeds(updateDoc(doc(como('rob'), 'usuarios/rob'), { nome: 'Roberto Carlos' }));
});

await caso('NAO troca o proprio apelido por aqui', async () => {
  await assertFails(updateDoc(doc(como('rob'), 'usuarios/rob'), { apelidoChave: 'outro_nome' }));
});

await caso('NAO muda a propria data de nascimento', async () => {
  await assertFails(updateDoc(doc(como('rob'), 'usuarios/rob'), { nascimento: '01/01/1970' }));
});

await caso('menor NAO vira adulto sozinho', async () => {
  await assertFails(updateDoc(doc(como('ped'), 'usuarios/ped'), { faixa: 'adulto' }));
});

await caso('menor NAO troca de responsavel sozinho', async () => {
  await assertFails(updateDoc(doc(como('ped'), 'usuarios/ped'), { responsavelUid: 'estranho' }));
});

await caso('NAO edita perfil alheio', async () => {
  await assertFails(updateDoc(doc(como('bruno'), 'usuarios/rob'), { nome: 'Invadido' }));
});

await caso('dono apaga a propria conta', async () => {
  await assertSucceeds(deleteDoc(doc(como('rob'), 'usuarios/rob')));
});

console.log('--- posts ---');

const POST = {
  autorUid: 'rob',
  autorApelido: 'Roberto_Silva',
  autorNome: 'Roberto Silva',
  texto: 'Jogo domingo 9h no campo do Vila Nova. Levem uniforme claro.',
  criadoEm: serverTimestamp(),
};

await caso('qualquer um le o feed, ate deslogado (D-015)', async () => {
  await assertSucceeds(getDoc(doc(anonimo(), 'posts/qualquer')));
});

await caso('logado publica no proprio nome', async () => {
  await assertSucceeds(setDoc(doc(como('rob'), 'posts/p1'), POST));
});

await caso('deslogado NAO publica', async () => {
  await assertFails(setDoc(doc(anonimo(), 'posts/p2'), POST));
});

await caso('NAO publica no nome de outra pessoa', async () => {
  await assertFails(setDoc(doc(como('bruno'), 'posts/p3'), POST));
});

await caso('NAO publica texto vazio', async () => {
  await assertFails(setDoc(doc(como('rob'), 'posts/p4'), { ...POST, texto: '' }));
});

await caso('NAO publica alem de 500 caracteres', async () => {
  await assertFails(setDoc(doc(como('rob'), 'posts/p5'), { ...POST, texto: 'a'.repeat(501) }));
});

await caso('NAO publica com campo extra inventado', async () => {
  await assertFails(setDoc(doc(como('rob'), 'posts/p6'), { ...POST, fixado: true }));
});

await caso('NAO publica com data forjada', async () => {
  await assertFails(
    setDoc(doc(como('rob'), 'posts/p7'), { ...POST, criadoEm: new Date(2020, 0, 1) }),
  );
});

await caso('ninguem edita post, nem o autor', async () => {
  await assertFails(updateDoc(doc(como('rob'), 'posts/p1'), { texto: 'mudei de ideia' }));
});

await caso('NAO apaga post alheio', async () => {
  await assertFails(deleteDoc(doc(como('bruno'), 'posts/p1')));
});

await caso('o autor apaga o proprio post', async () => {
  await assertSucceeds(deleteDoc(doc(como('rob'), 'posts/p1')));
});

console.log('--- colecao nao prevista ---');

await caso('colecao nova nasce fechada para leitura', async () => {
  await assertFails(getDoc(doc(como('ana'), 'segredos/um')));
});

await caso('colecao nova nasce fechada para escrita', async () => {
  await assertFails(setDoc(doc(como('ana'), 'segredos/um'), { x: 1 }));
});

await ambiente.cleanup();

console.log('');
console.log(passou + ' passaram, ' + falhou + ' falharam');
process.exit(falhou ? 1 : 0);
