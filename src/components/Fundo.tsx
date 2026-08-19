import { useState } from 'react';
import { Image, StyleSheet, View, type LayoutChangeEvent, type ViewStyle } from 'react-native';

import { useLayout } from '../hooks/useLayout';
import { usePeriodoDoDia } from '../hooks/usePeriodoDoDia';
import { colors } from '../theme';

const IMAGENS = {
  loginDia: require('../../assets/fundos/fundo-login-dia.webp'),
  loginNoite: require('../../assets/fundos/fundo-login-noite.webp'),
  appRetrato: require('../../assets/fundos/fundo-app-retrato.webp'),
  appPaisagem: require('../../assets/fundos/fundo-app-paisagem.webp'),
};

/**
 * `auth` — telas de entrada e cadastro. Foto da quadra, que troca com a hora.
 *
 * `app` — todo o resto: feed, perfil, jogo, documentos. Arte da marca, com o
 * miolo escuro e a decoração nos cantos, feita para receber conteúdo por cima.
 */
export type VarianteDeFundo = 'auth' | 'app';

export interface FundoProps {
  variante?: VarianteDeFundo;
  children: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Véu escuro sobre a imagem, para o texto continuar legível.
 *
 * **Estes números foram medidos, não escolhidos a olho.** Amostrando os pixels
 * de cada imagem e aplicando o véu, procurou-se o menor valor em que o texto
 * secundário (`colors.textOverPhoto`) ainda alcança os 4,5:1 que a WCAG exige
 * para texto corrido — contra o pixel mais claro da imagem, não contra a média.
 *
 * Uma surpresa útil apareceu aí: a foto da noite precisa do **mesmo** véu da
 * foto de dia. Ela parece escura, mas os refletores da quadra são quase
 * brancos, e é sobre eles que o texto pode cair. Um véu leve deixaria a frase
 * ilegível justamente em cima da luz.
 *
 * A arte do app pede menos porque foi desenhada com o miolo escuro.
 */
const VEU = {
  loginDia: 'rgba(10, 12, 10, 0.66)',
  loginNoite: 'rgba(10, 12, 10, 0.66)',
  appRetrato: 'rgba(10, 12, 10, 0.46)',
  // A arte deitada precisa de bem mais: ela tem o estouro de luz do refletor
  // no canto superior, e sobre aquele ponto o texto reprovava em 3,3:1.
  appPaisagem: 'rgba(10, 12, 10, 0.67)',
} as const;

export function Fundo({ variante = 'app', children, style }: FundoProps) {
  const periodo = usePeriodoDoDia();
  const janela = useLayout();

  /**
   * A orientação é medida pela **própria caixa**, com `onLayout`, e não pelo
   * tamanho da janela.
   *
   * Duas razões. A primeira é correção: o fundo preenche o container, então o
   * que decide qual arte cabe é a forma do container — não a da janela, que
   * num tablet com o app em tela dividida nem coincide.
   *
   * A segunda é confiabilidade: `useWindowDimensions` depende de o ambiente
   * emitir o evento de redimensionamento. `onLayout` é disparado pelo próprio
   * motor de layout quando a caixa muda — se a caixa mudou, ele avisa.
   *
   * O valor inicial vem da janela só para evitar um quadro com a arte errada
   * num tablet deitado: antes da primeira medição a caixa seria 0x0, e 0 > 0 é
   * falso, o que escolheria retrato. Depois disso quem manda é a medição.
   */
  const [caixa, setCaixa] = useState({ largura: janela.width, altura: janela.height });

  function medir(evento: LayoutChangeEvent) {
    const { width, height } = evento.nativeEvent.layout;
    setCaixa((atual) =>
      // Só atualiza quando muda de verdade: `onLayout` pode disparar com o
      // mesmo tamanho, e re-renderizar à toa custa numa tela que rola.
      atual.largura === width && atual.altura === height ? atual : { largura: width, altura: height },
    );
  }

  const deitado = caixa.largura > caixa.altura;
  const ehAuth = variante === 'auth';

  // A arte do app existe em duas proporções. Usar a de retrato deitada
  // cortaria a marca do rodapé e a decoração dos cantos justamente onde ela
  // foi desenhada para aparecer.
  const qual = ehAuth
    ? periodo === 'dia'
      ? 'loginDia'
      : 'loginNoite'
    : deitado
      ? 'appPaisagem'
      : 'appRetrato';

  const fonte = IMAGENS[qual];
  const veu = VEU[qual];

  return (
    <View style={[styles.raiz, style]} onLayout={medir}>
      <Image
        source={fonte}
        // `width/height: 100%` junto do absoluteFill, e não só ele: o Expo
        // entrega o tamanho natural do arquivo junto com a fonte, e esse
        // tamanho vence os `insets`. Sem isto a imagem de 1024x1536 fica do
        // tamanho dela mesma e empurra a tela para os lados.
        style={[StyleSheet.absoluteFill, styles.preenche]}
        resizeMode="cover"
        // Decorativa: não é conteúdo, e leitor de tela anunciando "imagem" a
        // cada tela seria ruído puro.
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: veu, pointerEvents: 'none' }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  // Preto por baixo de tudo: se a imagem falhar ou demorar, a tela continua
  // escura em vez de piscar branco.
  raiz: { flex: 1, backgroundColor: colors.black },
  preenche: { width: '100%', height: '100%' },
});
