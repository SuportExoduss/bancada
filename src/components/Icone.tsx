import { Image, PixelRatio, type ImageStyle } from 'react-native';

import { ASSETS_DE_ICONE } from '../assets/icones';

export type NomeDoIcone = keyof typeof ASSETS_DE_ICONE;
/** Cinza = inativo. Verde = ativo. É a regra em toda a navegação. */
export type CorDoIcone = 'cinza' | 'verde';

/** Os tamanhos em que cada ícone foi entregue pelo desenho. */
const OFICIAIS = [16, 24, 32, 64] as const;
type TamanhoOficial = (typeof OFICIAIS)[number];

export interface IconeProps {
  nome: NomeDoIcone;
  /** Cinza inativo, verde ativo */
  cor: CorDoIcone;
  /** Tamanho de desenho, em pontos (dp) */
  tamanho: number;
  style?: ImageStyle;
  /**
   * Ícone dentro de um botão que já tem rótulo não precisa ser anunciado de
   * novo — o leitor de tela leria a mesma coisa duas vezes.
   */
  acessivel?: boolean;
  rotulo?: string;
}

/**
 * Escolhe o **arquivo oficial** mais próximo por cima do que a tela precisa.
 *
 * Um ícone de 24dp numa tela 3x ocupa 72 pixels reais. Servir o arquivo de
 * 24px ali é esticar 24 pixels em 72 — o traço fino vira uma mancha borrada,
 * que é justamente o defeito que a especificação manda evitar.
 *
 * Então a conta é: pixels necessários = dp × densidade, e vale o menor
 * arquivo oficial que alcance esse número. Reduzir é limpo; ampliar não é.
 * Acima de 64 não há de onde tirar mais — 64 é o maior que existe.
 */
export function arquivoParaTamanho(dp: number): TamanhoOficial {
  const necessario = dp * PixelRatio.get();
  return OFICIAIS.find((t) => t >= necessario) ?? 64;
}

/**
 * Ícone da BANCADA, sempre a partir do asset oficial.
 *
 * Não desenha nada por conta própria e não aceita cor arbitrária: o arquivo
 * já vem na cor certa, em duas versões. Tingir um PNG em runtime (`tintColor`)
 * apagaria o degradê que o desenho tem e inventaria um verde que não é o da
 * marca.
 */
export function Icone({ nome, cor, tamanho, style, acessivel = false, rotulo }: IconeProps) {
  const fonte = ASSETS_DE_ICONE[nome][cor][arquivoParaTamanho(tamanho)];

  return (
    <Image
      source={fonte}
      style={[{ width: tamanho, height: tamanho }, style]}
      resizeMode="contain"
      accessible={acessivel}
      accessibilityRole={acessivel ? 'image' : undefined}
      accessibilityLabel={acessivel ? rotulo : undefined}
      accessibilityElementsHidden={!acessivel}
      importantForAccessibility={acessivel ? 'yes' : 'no-hide-descendants'}
    />
  );
}
