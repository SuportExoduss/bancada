import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ABAS, type ChaveDeAba } from '../navigation/abas';
import { Icone } from './Icone';
import { colors, nav, spacing, typography } from '../theme';

export interface BarraDeAbasProps {
  ativa: ChaveDeAba;
  onTrocar: (chave: ChaveDeAba) => void;
  /**
   * Conversas com mensagem por ler.
   *
   * Vem de fora porque a barra não sabe consultar nada — ela desenha o estado
   * que o app apurou. Enquanto Mensagens não existir isto é sempre 0, e é
   * assim que tem que ser: o número é falso no dia em que for inventado aqui.
   */
  mensagensNaoLidas?: number;
}

/**
 * Barra de navegação inferior — Home · Explorar · Rolls · Mensagens · Perfil.
 *
 * ## A regra de cor
 *
 * Verde é ativo, cinza é inativo. Mensagens tem uma exceção: fica verde,
 * mesmo sem estar selecionada, quando existe mensagem por ler — com uma
 * bolinha em cima do ícone. A prioridade é:
 *
 * 1. aba selecionada → verde;
 * 2. mensagem não lida → verde + bolinha;
 * 3. nem um nem outro → cinza.
 *
 * ## Por que é feita à mão
 *
 * `@react-navigation/bottom-tabs` resolveria a navegação, mas o desenho aqui
 * é específico — assets PNG oficiais em dois estados, bolinha por cima do
 * ícone, rótulo com a tipografia da casa — e sobraria mais código
 * desmontando o visual padrão do que escrevendo este. Uma dependência a
 * menos, e o `CLAUDE.md §7` pede exatamente isso.
 */
export function BarraDeAbas({ ativa, onTrocar, mensagensNaoLidas = 0 }: BarraDeAbasProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.barra,
        // O recorte de baixo entra como preenchimento, não como margem: a
        // barra tem que ir até a borda física do aparelho, senão aparece uma
        // faixa do feed passando por baixo dela no iPhone.
        { paddingBottom: Math.max(insets.bottom, spacing.sm) },
      ]}
      accessibilityRole="tablist"
    >
      {ABAS.map((aba) => {
        const selecionada = aba.chave === ativa;
        const temAviso = aba.chave === 'mensagens' && mensagensNaoLidas > 0;
        const verde = selecionada || temAviso;

        return (
          <Pressable
            key={aba.chave}
            onPress={() => onTrocar(aba.chave)}
            style={styles.item}
            accessibilityRole="tab"
            accessibilityState={{ selected: selecionada }}
            accessibilityLabel={
              temAviso
                ? `${aba.rotulo}, ${mensagensNaoLidas} sem ler`
                : aba.rotulo
            }
          >
            <View style={styles.caixaDoIcone}>
              <Icone nome={aba.icone} cor={verde ? 'verde' : 'cinza'} tamanho={nav.iconeAba} />
              {temAviso ? <View style={styles.bolinha} /> : null}
            </View>
            <Text style={[styles.rotulo, verde && styles.rotuloAtivo]} numberOfLines={1}>
              {aba.rotulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: spacing.sm,
    // Grafite quase opaco em vez de transparente: o feed rola por baixo, e
    // sem um fundo próprio o texto do post apareceria atrás dos rótulos.
    backgroundColor: 'rgba(17, 17, 17, 0.96)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
    minHeight: nav.alturaAbas,
    paddingHorizontal: spacing.xs,
  },
  caixaDoIcone: { width: nav.iconeAba, height: nav.iconeAba },
  bolinha: {
    position: 'absolute',
    top: -2,
    right: -3,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.green,
    // A borda escura descola a bolinha do traço do ícone. Sem ela as duas
    // formas se encostam e viram um borrão nas telas menores.
    borderWidth: 1.5,
    borderColor: colors.black,
  },
  rotulo: {
    ...typography.caption,
    fontSize: 11,
    lineHeight: 14,
    color: colors.textMuted,
    // O rótulo é curto e repetido; a meia-negrita deixa o item legível de
    // relance sem virar um bloco pesado.
    fontWeight: Platform.OS === 'ios' ? '600' : '500',
  },
  rotuloAtivo: { color: colors.green },
});
