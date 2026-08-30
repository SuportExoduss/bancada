/**
 * Nomes das coleções do Firestore, num lugar só.
 *
 * Estavam escritos em dois arquivos com o mesmo valor. Duas fontes de verdade
 * para o mesmo nome é o tipo de coisa que não dói até alguém renomear um lado:
 * aí o cadastro grava em `apelidos` e a consulta de disponibilidade procura em
 * outro lugar, e o app passa a aceitar apelido repetido sem ninguém entender
 * por quê.
 *
 * Os mesmos nomes aparecem em `firestore.rules`. Lá não dá para importar —
 * então **ao renomear qualquer um destes, mexa também nas regras e nos
 * testes**, ou a escrita passa a ser negada.
 */
export const COLECAO_USUARIOS = 'usuarios';
export const COLECAO_APELIDOS = 'apelidos';
export const COLECAO_POSTS = 'posts';

/**
 * Quem segue quem. O ID do documento é `{seguidorUid}_{alvoUid}` — mesmo
 * truque dos apelidos: o banco garante que não dá para seguir duas vezes,
 * porque o documento simplesmente já existe.
 */
export const COLECAO_SEGUIDORES = 'seguidores';

/** Monta o ID do vínculo. A ordem importa: quem segue vem primeiro. */
export const idDoVinculo = (seguidorUid: string, alvoUid: string) =>
  `${seguidorUid}_${alvoUid}`;
