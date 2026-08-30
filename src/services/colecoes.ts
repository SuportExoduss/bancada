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
