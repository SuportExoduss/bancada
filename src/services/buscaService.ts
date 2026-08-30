import { collection, getDocs, limit, orderBy, query, startAt, endAt } from 'firebase/firestore';

import { chaveDoApelido } from '../domain/profile';
import { db } from '../infrastructure/firebase/app';
import { COLECAO_USUARIOS } from './colecoes';

export interface PessoaEncontrada {
  uid: string;
  nome: string;
  sobrenome: string;
  apelido: string;
}

/** Quantos resultados por busca. */
export const MAX_RESULTADOS = 20;

/**
 * O ultimo caractere da area de uso privado do Unicode (U+F8FF).
 *
 * Escrito com `fromCharCode` de proposito. O caractere em si e INVISIVEL
 * no editor -- quem abrir o arquivo veria `chave + ''` e concluiria que
 * alguem esqueceu de preencher a string. Ja perdi tempo com isso uma vez,
 * num regex de acentos que tinha caracteres combinantes invisiveis dentro.
 *
 * Serve para delimitar o prefixo: "tudo entre rob e rob+U+F8FF" e
 * exatamente "tudo que comeca com rob".
 */
const ULTIMO_CARACTERE = String.fromCharCode(0xf8ff);

/**
 * Procura pessoas pelo começo do apelido.
 *
 * ## O que esta busca faz e o que não faz
 *
 * É **busca por prefixo**: `rob` acha `roberth`, `robson`, `roberta`. Não acha
 * `roberth` se você digitar `berth`, e não perdoa erro de digitação.
 *
 * O truque é `startAt(termo)` + `endAt(termo + '')`. O `` é um dos
 * `rob`" é exatamente "tudo que começa com `rob`".
 *
 * **Por que não é busca de verdade:** o Firestore não indexa texto. Busca por
 * conteúdo, tolerante a erro, exigiria um serviço à parte — e isso é
 * infraestrutura nova, que o `CLAUDE.md §7` proíbe sem decisão do
 * proprietário. Para achar alguém pelo apelido, prefixo resolve.
 *
 * Busca pela **chave** (minúscula) e não pela exibição: quem digita `ROB` tem
 * que achar `roberth` do mesmo jeito.
 */
export async function procurarPessoas(termo: string): Promise<PessoaEncontrada[]> {
  const chave = chaveDoApelido(termo);
  // Menos de dois caracteres devolveria quase a base inteira, e cada resultado
  // é uma leitura cobrada.
  if (chave.length < 2) return [];

  const instantaneo = await getDocs(
    query(
      collection(db, COLECAO_USUARIOS),
      orderBy('apelidoChave'),
      startAt(chave),
      endAt(chave + ULTIMO_CARACTERE),
      limit(MAX_RESULTADOS),
    ),
  );

  return instantaneo.docs.map((d) => {
    const dados = d.data();
    return {
      uid: d.id,
      nome: dados.nome,
      sobrenome: dados.sobrenome,
      apelido: dados.apelido,
    };
  });
}
