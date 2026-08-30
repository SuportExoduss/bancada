/**
 * Regras de publicação — puras, sem Firebase.
 *
 * Ficam aqui porque a tela, o serviço e a Security Rule precisam concordar
 * sobre o que é um post válido. Escrever a mesma regra em três lugares é como
 * os três divergem.
 */

export const POST_MAX = 500;

/**
 * Por que 500 e não 280.
 *
 * O post da várzea não é uma frase de efeito: é "jogo domingo 9h no campo do
 * Vila Nova, levem uniforme claro, quem não confirmar até sexta fica fora".
 * Isso não cabe em 280 e cortar obrigaria a pessoa a quebrar em dois posts.
 *
 * Não está na documentação — foi escolha minha, e pode mudar.
 */

export type ErroPost = 'vazio' | 'longo' | 'so_espaco';

export function validarPost(bruto: string): ErroPost | null {
  if (bruto.length === 0) return 'vazio';

  const texto = bruto.trim();
  // Espaço e quebra de linha sozinhos passariam no teste de tamanho e
  // produziriam um post em branco ocupando o feed.
  if (texto.length === 0) return 'so_espaco';
  if (texto.length > POST_MAX) return 'longo';
  return null;
}

/**
 * Limpa o texto antes de gravar.
 *
 * Corta as pontas e reduz sequências de mais de duas quebras de linha a duas:
 * sem isso, dez enters viram um post que empurra todo o resto do feed para
 * fora da tela — e é o tipo de coisa que alguém faz sem má intenção, só
 * apertando enter enquanto pensa.
 */
export function limparPost(bruto: string): string {
  return bruto.trim().replace(/\n{3,}/g, '\n\n');
}

export const MENSAGENS_POST = {
  vazio: 'Escreva alguma coisa.',
  so_espaco: 'Escreva alguma coisa.',
  longo: `No máximo ${POST_MAX} caracteres.`,
} as const;

/** Quanto ainda cabe. Negativo quando passou. */
export function restam(texto: string): number {
  return POST_MAX - texto.trim().length;
}
