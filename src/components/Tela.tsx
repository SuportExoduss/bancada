import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fundo, type VarianteDeFundo } from './Fundo';
import { margemLateral } from '../theme';
import { useLayout } from '../hooks/useLayout';

export interface TelaProps {
  children: React.ReactNode;
  variante?: VarianteDeFundo;
  /**
   * A tela termina numa barra de abas.
   *
   * Muda quem cuida do recorte de baixo: a barra pinta até a borda física do
   * aparelho e aplica o recorte por dentro dela. Se a área segura também
   * descontasse aqui, sobraria uma faixa vazia entre a barra e a borda.
   */
  comAbas?: boolean;
  /** Cola o conteúdo nas laterais — para listas que sangram até a borda. */
  semMargem?: boolean;
}

/**
 * A moldura padrão de uma tela do app.
 *
 * Junta o que estava repetido em cada arquivo: fundo, área segura, barra de
 * status e a margem lateral. Estavam copiados tela a tela, e o preço disso
 * apareceu duas vezes — uma quando o `SafeAreaView` errado deixou a seta de
 * voltar embaixo do relógio no Android, outra quando cada tela escolheu uma
 * margem diferente.
 *
 * A margem vem de `margemLateral`, que muda com a largura do aparelho: em
 * celular pequeno ela encolhe para o conteúdo não ficar espremido.
 */
export function Tela({ children, variante = 'app', comAbas = false, semMargem = false }: TelaProps) {
  const { width } = useLayout();

  return (
    <Fundo variante={variante}>
      <SafeAreaView
        style={styles.safe}
        edges={comAbas ? ['top', 'left', 'right'] : ['top', 'bottom', 'left', 'right']}
      >
        {/* `translucent` combinado com o fundo transparente deixa a arte
            subir até atrás do relógio, como na referência. */}
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={[styles.miolo, !semMargem && { paddingHorizontal: margemLateral(width) }]}>
          {children}
        </View>
      </SafeAreaView>
    </Fundo>
  );
}

const styles = StyleSheet.create({
  // Transparente de propósito: quem pinta é o `Fundo`, embaixo.
  safe: { flex: 1, backgroundColor: 'transparent' },
  miolo: { flex: 1 },
});

/** Para quem monta o conteúdo e precisa da mesma margem por dentro. */
export function useMargemLateral(): number {
  const { width } = useLayout();
  return margemLateral(width);
}
