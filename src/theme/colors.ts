/**
 * Paleta da BANCADA.
 *
 * Fechada pelo kit de marca: verde #6CC04A e preto #111111.
 * O DESIGN_SYSTEM.md dizia "a paleta final deve ser definida" — está aqui.
 *
 * Regra de uso do verde: ação e destaque. Nunca fundo de área grande — em
 * tela cheia ele cansa a vista e rouba o destaque de quem deveria ter.
 */
export const colors = {
  /** Ação, destaque, ao vivo */
  green: '#6CC04A',
  greenPressed: '#5CA83F',
  greenSoft: 'rgba(108, 192, 74, 0.12)',

  /** Fundo da aplicação */
  black: '#111111',
  /** Cartões e superfícies elevadas */
  surface: '#1A1A1A',
  surfaceHigh: '#222222',
  border: '#2A2A2A',

  text: '#FFFFFF',
  textMuted: '#9A9A9A',
  textOnGreen: '#111111',

  /** Semânticas */
  danger: '#E5484D',
  warning: '#F5A524',
  success: '#6CC04A',
  live: '#E5484D',
} as const;

export type ColorName = keyof typeof colors;
