import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

import { db } from '../infrastructure/firebase/app';
import { COLECAO_POSTS, COLECAO_SEGUIDORES, idDoVinculo } from './colecoes';
import type { Post } from './postService';

/**
 * Quantos valores o operador `in` do Firestore aceita.
 *
 * **Medido contra o emulador, não lido na documentação** — a página de quotas
 * do Firebase não traz este número, e ele decide o desenho da aba SEGUINDO.
 * Em 30/08/2026: 30 aceita, 31 devolve "'IN' supports up to 30 comparison
 * values".
 */
export const MAX_IN = 30;

const refVinculo = (seguidorUid: string, alvoUid: string) =>
  doc(db, COLECAO_SEGUIDORES, idDoVinculo(seguidorUid, alvoUid));

export async function seguir(seguidorUid: string, alvoUid: string): Promise<void> {
  if (seguidorUid === alvoUid) throw new Error('Não dá para seguir você mesmo.');
  await setDoc(refVinculo(seguidorUid, alvoUid), {
    seguidorUid,
    alvoUid,
    criadoEm: serverTimestamp(),
  });
}

export async function deixarDeSeguir(seguidorUid: string, alvoUid: string): Promise<void> {
  await deleteDoc(refVinculo(seguidorUid, alvoUid));
}

/** Uma leitura por ID — o vínculo É o documento. */
export async function jaSigo(seguidorUid: string, alvoUid: string): Promise<boolean> {
  return (await getDoc(refVinculo(seguidorUid, alvoUid))).exists();
}

/**
 * Conta seguidores e seguidos sem trazer os documentos.
 *
 * `getCountFromServer` cobra 1 leitura a cada 1.000 documentos contados, em
 * vez de 1 por documento. Com 500 seguidores, é 1 leitura em vez de 500.
 */
export async function contarSeguidores(uid: string): Promise<number> {
  const c = await getCountFromServer(
    query(collection(db, COLECAO_SEGUIDORES), where('alvoUid', '==', uid)),
  );
  return c.data().count;
}

export async function contarSeguindo(uid: string): Promise<number> {
  const c = await getCountFromServer(
    query(collection(db, COLECAO_SEGUIDORES), where('seguidorUid', '==', uid)),
  );
  return c.data().count;
}

/** Uids de quem a pessoa segue. */
export async function quemEuSigo(uid: string): Promise<string[]> {
  const instantaneo = await getDocs(
    query(collection(db, COLECAO_SEGUIDORES), where('seguidorUid', '==', uid)),
  );
  return instantaneo.docs.map((d) => d.data().alvoUid as string);
}

function paraPost(d: QueryDocumentSnapshot): Post {
  const dados = d.data();
  return {
    id: d.id,
    autorUid: dados.autorUid,
    autorApelido: dados.autorApelido,
    autorNome: dados.autorNome,
    texto: dados.texto,
    criadoEm: dados.criadoEm?.toDate() ?? null,
  };
}

/**
 * Feed de quem a pessoa segue.
 *
 * ## Por que não tem cursor como o feed geral
 *
 * Quem segue mais de 30 pessoas precisa de **várias consultas**, porque o `in`
 * do Firestore para em 30 valores. Cada consulta devolve os posts mais novos
 * daquele bloco, e o resultado é juntado e reordenado aqui.
 *
 * Paginar isso direito exigiria guardar um cursor por bloco e mesclar em
 * ordem — dá para fazer, e não vale enquanto ninguém segue 30 pessoas. O que
 * existe hoje traz as N mais recentes de cada bloco e corta no total.
 *
 * **Quando ficar caro:** quem segue 100 pessoas dispara 4 consultas por
 * abertura. É o ponto de reavaliar — provavelmente com uma coleção de
 * linha do tempo por usuário, que hoje seria cedo demais.
 */
export async function feedDeQuemSigo(uid: string, quantos = 20): Promise<Post[]> {
  const seguidos = await quemEuSigo(uid);
  if (seguidos.length === 0) return [];

  const blocos: string[][] = [];
  for (let i = 0; i < seguidos.length; i += MAX_IN) {
    blocos.push(seguidos.slice(i, i + MAX_IN));
  }

  const resultados = await Promise.all(
    blocos.map((bloco) =>
      getDocs(
        query(
          collection(db, COLECAO_POSTS),
          where('autorUid', 'in', bloco),
          orderBy('criadoEm', 'desc'),
          limit(quantos),
        ),
      ),
    ),
  );

  return resultados
    .flatMap((r) => r.docs.map(paraPost))
    // Reordenar depois de juntar: cada bloco vem ordenado por dentro, mas a
    // união de listas ordenadas não é ordenada.
    .sort((a, b) => (b.criadoEm?.getTime() ?? 0) - (a.criadoEm?.getTime() ?? 0))
    .slice(0, quantos);
}
