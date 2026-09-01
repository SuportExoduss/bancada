/**
 * Medidas da casca de navegação: barra de cima, faixa de Moments, barra de
 * abas.
 *
 * Estão juntas num arquivo só porque são um conjunto — mexer na altura da
 * barra sem mexer no tamanho do ícone desalinha o rótulo, e esse tipo de
 * desencontro é difícil de apontar olhando uma tela por vez.
 *
 * Os valores vieram da referência mobile aprovada, medidos sobre a imagem e
 * convertidos para pontos (a arte tem 853px de largura para os 393dp de um
 * aparelho comum, ou seja ×0,46).
 */
export const nav = {
  /** Altura da barra de cima, sem contar o recorte do sistema. */
  alturaTopo: 56,

  /**
   * Ícone da barra de abas.
   *
   * A especificação pede "ligeiramente maiores do que na primeira versão".
   * 26 é o passo seguinte a 24 que ainda cai num arquivo oficial sem
   * ampliação em tela 2x (26 × 2 = 52, servido pelo arquivo de 64).
   */
  iconeAba: 26,
  /** Sino e hambúrguer: mesma escala do ícone de aba. */
  iconeTopo: 26,
  /**
   * O "+" é o único que ganha destaque de tamanho — é a ação principal, e o
   * desenho dele já traz o próprio contorno redondo.
   */
  iconePostar: 34,

  /**
   * Altura útil da barra de abas, acima da área segura do aparelho.
   *
   * Ícone (26) + respiro (8) + rótulo (14) + folga = 62. A especificação pede
   * para "não deixar a barra inferior ocupar espaço excessivo": acima disso
   * ela começa a comer o feed em telas baixas.
   */
  alturaAbas: 62,

  /** Diâmetro do círculo de Moment, contorno incluído. */
  circuloMoment: 72,
  /** Espessura do anel verde de quem tem Moment por ver. */
  anelMoment: 2,

  /** Altura de exibição da marca no topo. */
  alturaMarca: 26,
} as const;

/**
 * Margem lateral do conteúdo, por largura de tela.
 *
 * Diminuiu de 24 para 16/20 a pedido: em celular, 24 de cada lado tirava 48
 * pontos de um aparelho de 360 — 13% da tela virava margem, e o cartão de
 * post ficava apertado por dentro para caber. Menos margem por fora, mais
 * respiro por dentro.
 */
export function margemLateral(largura: number): number {
  if (largura < 360) return 14;
  if (largura < 400) return 16;
  return 20;
}
