/**
 * Escala de espaçamento, em múltiplos de 4.
 *
 * Escala fixa em vez de números soltos: sem isso, cada tela inventa o próprio
 * respiro e o app fica desalinhado de um jeito difícil de apontar mas fácil
 * de sentir.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  /** Padrão dos botões e cartões da BANCADA */
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

/**
 * Alvo mínimo de toque: 44pt.
 *
 * Não é enfeite de acessibilidade — o app vai ser usado em pé, na beira do
 * campo, com a mão suja e o sol batendo na tela.
 */
export const MIN_TOUCH = 44;
