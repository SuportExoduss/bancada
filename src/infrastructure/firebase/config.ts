/**
 * Configuração do projeto Firebase.
 *
 * **Isto não é segredo.** A `apiKey` do Firebase é pública por desenho: ela
 * viaja no pacote do app, e qualquer pessoa que abra o site consegue lê-la.
 * Ela identifica o projeto, não autoriza nada. Quem autoriza são as Security
 * Rules — por isso `firestore.rules` é o arquivo que merece cuidado, não este.
 *
 * O que **não** pode ser commitado é chave de conta de serviço (privada,
 * formato JSON com `private_key`). Essa nunca entra no cliente.
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyDmI6fMsWnMXPw6PQ-1Qc2PZwCuPnRg_Mw',
  authDomain: 'bancada-2ce451.firebaseapp.com',
  projectId: 'bancada-2ce451',
  storageBucket: 'bancada-2ce451.firebasestorage.app',
  messagingSenderId: '216409172533',
  appId: '1:216409172533:web:5870bb583ad91733bf9f7c',
} as const;

/** Portas do Emulator Suite — precisam bater com o `firebase.json`. */
export const EMULADOR = {
  host: 'localhost',
  authPorta: 9099,
  firestorePorta: 8080,
} as const;

/**
 * Usar o emulador em vez do Firebase de verdade?
 *
 * Em desenvolvimento, sim — é o que o `CLAUDE.md §3` manda, e evita encher o
 * projeto real de conta de teste e gastar cota do plano gratuito.
 *
 * `EXPO_PUBLIC_FIREBASE_REAL=1` força o contrário, para quando for preciso
 * testar contra o projeto de verdade sem publicar.
 */
export const usarEmulador =
  __DEV__ && process.env.EXPO_PUBLIC_FIREBASE_REAL !== '1';
