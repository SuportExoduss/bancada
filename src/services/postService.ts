import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

import { limparPost } from '../domain/post';
import { db } from '../infrastructure/firebase/app';
import { COLECAO_POSTS } from './colecoes';

export interface Post {
  id: string;
  autorUid: string;
  /** Como o autor escreveu o apelido, no momento em que publicou */
  autorApelido: string;
  autorNome: string;
  texto: string;
  /** `null` no instante entre gravar e o servidor carimbar a hora */
  criadoEm: Date | null;
}

/** Quantos posts por página. */
export const POSTS_POR_PAGINA = 20;

/**
 * Publica um post.
 *
 * O nome e o apelido do autor são **copiados para dentro do post**, não
 * referenciados. Sem isso, montar um feed de 20 posts custaria 20 leituras
 * extras só para descobrir quem escreveu cada um — e na cota gratuita isso é
 * caro rápido.
 *
 * O preço da cópia: quem trocar o nome depois continua aparecendo com o antigo
 * nos posts velhos. É um preço conhecido e aceito; o apelido, que é como as
 * pessoas se acham, não muda hoje de qualquer forma.
 */
export async function publicar(autor: {
  uid: string;
  apelido: string;
  nome: string;
  sobrenome: string;
}, texto: string): Promise<void> {
  await addDoc(collection(db, COLECAO_POSTS), {
    autorUid: autor.uid,
    autorApelido: autor.apelido,
    autorNome: `${autor.nome} ${autor.sobrenome}`.trim(),
    texto: limparPost(texto),
    criadoEm: serverTimestamp(),
  });
}

function paraPost(d: QueryDocumentSnapshot): Post {
  const dados = d.data();
  return {
    id: d.id,
    autorUid: dados.autorUid,
    autorApelido: dados.autorApelido,
    autorNome: dados.autorNome,
    texto: dados.texto,
    // `serverTimestamp()` só vira data depois que o servidor confirma. Entre a
    // gravação e a confirmação o campo é nulo, e ler `.toDate()` aí estoura.
    criadoEm: dados.criadoEm?.toDate() ?? null,
  };
}

export interface PaginaDeFeed {
  posts: Post[];
  /** Passe de volta em `carregarFeed` para pegar a próxima página. */
  cursor: QueryDocumentSnapshot | null;
  acabou: boolean;
}

/**
 * Lê uma página do feed, do mais novo para o mais velho.
 *
 * **Cronológico**, e isso ainda é decisão em aberto (pendência 7: cronológico
 * ou híbrido). Cronológico é o único implementável hoje — feed híbrido precisa
 * de sinais que não existem: seguidores, reações, histórico de leitura.
 *
 * Página de 20 com cursor em vez de carregar tudo: sem limite, um feed de mil
 * posts custaria mil leituras por abertura do app e ainda travaria a lista.
 */
export async function carregarFeed(
  apos: QueryDocumentSnapshot | null = null,
): Promise<PaginaDeFeed> {
  // Tipado na mao: sem isto o TypeScript deduz o tipo do array pelos dois
  // primeiros elementos e recusa o `startAfter` depois.
  const partes: QueryConstraint[] = [orderBy('criadoEm', 'desc')];
  if (apos) partes.push(startAfter(apos));
  partes.push(limit(POSTS_POR_PAGINA));

  const instantaneo = await getDocs(query(collection(db, COLECAO_POSTS), ...partes));

  return {
    posts: instantaneo.docs.map(paraPost),
    cursor: instantaneo.docs[instantaneo.docs.length - 1] ?? null,
    acabou: instantaneo.docs.length < POSTS_POR_PAGINA,
  };
}

export async function apagarPost(id: string): Promise<void> {
  await deleteDoc(doc(db, COLECAO_POSTS, id));
}
