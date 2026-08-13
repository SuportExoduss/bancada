import { useWindowDimensions } from 'react-native';

/**
 * Medidas da tela atual, para o layout se adaptar de verdade.
 *
 * Existe porque a adaptação a tamanhos diferentes é critério de aceite de
 * TODA tela da BANCADA, e não um ajuste que cada uma inventa do seu jeito.
 *
 * `useWindowDimensions` reage a rotação e a mudança de tamanho — diferente
 * de `Dimensions.get()`, que lê uma vez e congela. Girar o aparelho com
 * `Dimensions.get()` deixa o layout com as medidas antigas.
 */

/** Abaixo disto o aparelho é estreito: iPhone SE tem 320. */
const LARGURA_COMPACTA = 360;
/** Abaixo disto sobra pouca altura: paisagem de celular tem 375. */
const ALTURA_BAIXA = 600;
/** Acima disto é tablet ou desktop. */
const LARGURA_AMPLA = 700;

/**
 * Conteúdo de leitura nunca passa disto.
 *
 * Sem esse teto, no tablet o botão fica com 720px de largura ocupando 94% da
 * tela — funciona, mas parece um site esticado, não um aplicativo.
 */
export const LARGURA_MAXIMA_CONTEUDO = 440;

export interface Layout {
  width: number;
  height: number;
  isLandscape: boolean;
  /** Tela estreita: reduzir tipografia e respiro */
  isCompactWidth: boolean;
  /** Pouca altura vertical: encolher elementos decorativos */
  isShortHeight: boolean;
  /** Tablet ou desktop: limitar largura e centralizar */
  isWide: boolean;
  /** Largura efetiva do conteúdo, já com o teto aplicado */
  contentWidth: number;
}

export function useLayout(): Layout {
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;

  return {
    width,
    height,
    isLandscape,
    isCompactWidth: width < LARGURA_COMPACTA,
    isShortHeight: height < ALTURA_BAIXA,
    isWide: width >= LARGURA_AMPLA,
    contentWidth: Math.min(width, LARGURA_MAXIMA_CONTEUDO),
  };
}

/**
 * Altura para a marca, proporcional à tela.
 *
 * Altura fixa era o defeito: 200px numa tela de 375 em paisagem cortava a
 * logo em 56px acima do topo. Aqui ela encolhe junto com a tela.
 */
export function alturaDaMarca({ height, isLandscape }: Layout): number {
  return isLandscape ? Math.min(120, height * 0.3) : Math.min(200, height * 0.24);
}
