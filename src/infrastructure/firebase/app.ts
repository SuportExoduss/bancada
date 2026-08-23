import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore';
import { Platform } from 'react-native';

import { EMULADOR, firebaseConfig, usarEmulador } from './config';

/**
 * Ponto único de contato com o Firebase.
 *
 * Nenhuma tela importa `firebase/*` diretamente (`CLAUDE.md §5`). Tudo passa
 * por aqui e pelos repositórios — assim trocar de provedor, ou colocar um
 * duplo em teste, é mexer num lugar só.
 */

// `getApps()` antes de inicializar: em desenvolvimento o Fast Refresh reexecuta
// o módulo, e inicializar duas vezes o mesmo app derruba com "duplicate app".
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/**
 * `getReactNativePersistence` existe **apenas** no ponto de entrada
 * `react-native` do SDK. O Metro resolve para ele ao empacotar o app; o
 * TypeScript lê os tipos da versão web, onde a função não está declarada — daí
 * o acesso por índice em vez de import direto.
 *
 * Não é gambiarra escondida: é uma diferença real entre os alvos do mesmo
 * pacote, e o `if` abaixo trata os dois casos de verdade.
 */
const persistenciaNativa = (
  firebaseAuth as unknown as {
    getReactNativePersistence?: (armazenamento: unknown) => firebaseAuth.Persistence;
  }
).getReactNativePersistence;

/**
 * No React Native o Auth precisa de persistência explícita.
 *
 * Sem isto a sessão fica só em memória e a pessoa é deslogada toda vez que
 * fecha o app — o defeito que faz parecer que "o login não funciona". Na web o
 * SDK já usa o armazenamento do navegador sozinho.
 */
export const auth: firebaseAuth.Auth =
  Platform.OS !== 'web' && persistenciaNativa
    ? firebaseAuth.initializeAuth(app, { persistence: persistenciaNativa(AsyncStorage) })
    : firebaseAuth.getAuth(app);

export const db: Firestore = getFirestore(app);

if (usarEmulador) {
  // `disableWarnings`: o aviso de "você está no emulador" reaparece a cada
  // recarga e some no meio do resto do log. A informação já está no console
  // abaixo, uma vez só.
  firebaseAuth.connectAuthEmulator(auth, `http://${EMULADOR.host}:${EMULADOR.authPorta}`, {
    disableWarnings: true,
  });
  connectFirestoreEmulator(db, EMULADOR.host, EMULADOR.firestorePorta);

  console.log(
    `[BANCADA] Firebase no EMULADOR (auth :${EMULADOR.authPorta}, firestore :${EMULADOR.firestorePorta}).` +
      ' Nada aqui vai para o projeto de verdade.',
  );
}

export { app };

/**
 * Uma segunda instância do Firebase, isolada da principal.
 *
 * Existe por causa de um comportamento do Firebase Auth que atrapalha o fluxo
 * do responsável: **`createUserWithEmailAndPassword` já entra na conta
 * recém-criada**, substituindo a sessão atual. Criar a conta do filho pela
 * instância principal deslogaria o pai no meio do caminho.
 *
 * Com uma instância separada, a conta do filho nasce e entra **nela**, e a
 * sessão do responsável na instância principal não é tocada.
 *
 * É criada sob demanda: quem nunca usa o fluxo do menor não paga por ela.
 */
export function firebaseSecundario() {
  const existente = getApps().find((a) => a.name === NOME_SECUNDARIO);
  const appSec = existente ?? initializeApp(firebaseConfig, NOME_SECUNDARIO);

  const authSec = firebaseAuth.getAuth(appSec);
  const dbSec = getFirestore(appSec);

  if (usarEmulador && !existente) {
    firebaseAuth.connectAuthEmulator(authSec, `http://${EMULADOR.host}:${EMULADOR.authPorta}`, {
      disableWarnings: true,
    });
    connectFirestoreEmulator(dbSec, EMULADOR.host, EMULADOR.firestorePorta);
  }

  return { app: appSec, auth: authSec, db: dbSec };
}

const NOME_SECUNDARIO = 'bancada-secundario';
