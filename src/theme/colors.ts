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
  /**
   * Texto secundario quando o fundo e imagem, nao cor solida.
   *
   * Nao e capricho: medindo os pixels das fotos de fundo com o veu aplicado,
   * o #9A9A9A fica em 2,3:1 de contraste -- muito abaixo dos 4,5:1 que a
   * WCAG pede para texto corrido. Para ele passar, o veu teria que ir a 0,84
   * e a foto sumiria. Este tom passa com o veu em 0,66, que ainda deixa a
   * imagem viva.
   */
  textOverPhoto: '#D6D6D6',
  /**
   * Verde da marca clareado, para LINK sobre imagem.
   *
   * O #6CC04A e otimo como fundo de botao, com texto escuro por cima. Como
   * texto sobre foto ele fica em 2,9:1 -- reprova. Mesma matiz, mais claro,
   * medido em 4,8:1 sobre as quatro imagens de fundo.
   *
   * Nao substitui o verde da marca: botao, borda e destaque continuam com o
   * `green`.
   */
  greenOverPhoto: '#B8E9A6',
  textOnGreen: '#111111',

  /** Semânticas */
  danger: '#E5484D',
  warning: '#F5A524',
  success: '#6CC04A',
  live: '#E5484D',
} as const;

export type ColorName = keyof typeof colors;
