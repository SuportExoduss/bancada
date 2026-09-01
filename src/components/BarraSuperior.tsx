import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { MARCA_TOPO, PROPORCAO_DA_MARCA } from '../assets/marca';
import { Icone } from './Icone';
import { colors, MIN_TOUCH, nav, radius, spacing, typography } from '../theme';

/** Quanto falta para o botao do topo alcancar os 44 pontos de alvo. */
const ALVO_EXTRA = (MIN_TOUCH - (nav.iconeTopo + 8)) / 2;

export interface BarraSuperiorProps {
  /** Abre a caixa de publicar */
  onPublicar: () => void;
  /**
   * Já publicou hoje.
   *
   * Muda o "+" de cinza para verde. Vem apurado de fora — a barra não
   * consulta nada.
   */
  publicouHoje: boolean;
  onNotificacoes: () => void;
  /** Quantas notificações ainda não foram vistas. 0 deixa o sino cinza. */
  notificacoesNaoVistas?: number;
  onMenu: () => void;
}

/**
 * Barra de cima do app.
 *
 * `[+]  BANCADA` à esquerda, `[sino] [hambúrguer]` à direita. Sem lupa: a
 * descoberta virou uma aba de baixo (Explorar), e lupa no topo faria a mesma
 * função existir em dois lugares.
 *
 * Os três botões mudam de cor por estado real:
 *
 * - `+` — cinza enquanto a pessoa não publicou hoje, verde depois;
 * - sino — cinza sem novidade, verde com contador quando há;
 * - hambúrguer — cinza sempre, por enquanto; o verde dele fica reservado para
 *   quando o menu tiver algum aviso próprio.
 */
export function BarraSuperior({
  onPublicar,
  publicouHoje,
  onNotificacoes,
  notificacoesNaoVistas = 0,
  onMenu,
}: BarraSuperiorProps) {
  const temNotificacao = notificacoesNaoVistas > 0;

  return (
    <View style={styles.barra}>
      <Pressable
        onPress={onPublicar}
        style={({ pressed }) => [styles.postar, pressed && styles.pressionado]}
        // O desenho tem 34 e o alvo minimo da casa e 44 (MIN_TOUCH). O
        // `hitSlop` fecha a diferenca sem inchar o botao.
        hitSlop={(MIN_TOUCH - nav.iconePostar) / 2}
        accessibilityRole="button"
        accessibilityLabel="Publicar"
        accessibilityHint={
          publicouHoje ? 'Você já publicou hoje. Publicar de novo.' : 'Escrever uma publicação'
        }
      >
        <Icone nome="postar" cor={publicouHoje ? 'verde' : 'cinza'} tamanho={nav.iconePostar} />
      </Pressable>

      <Image
        source={MARCA_TOPO}
        style={styles.marca}
        resizeMode="contain"
        accessible
        accessibilityRole="image"
        accessibilityLabel="BANCADA"
      />

      {/* Empurra o par da direita até a borda sem precisar de largura fixa
          nos dois lados — a marca tem largura própria e não pode esticar. */}
      <View style={styles.vao} />

      <Pressable
        onPress={onNotificacoes}
        style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}
        hitSlop={ALVO_EXTRA}
        accessibilityRole="button"
        accessibilityLabel={
          temNotificacao ? `Notificações, ${notificacoesNaoVistas} novas` : 'Notificações'
        }
      >
        <View>
          <Icone nome="notificacao" cor={temNotificacao ? 'verde' : 'cinza'} tamanho={nav.iconeTopo} />
          {temNotificacao ? (
            <View style={styles.contador}>
              {/* Acima de 9 o número não cabe na bolinha sem encolher a
                  fonte a ponto de não se ler. "9+" diz o mesmo. */}
              <Text style={styles.contadorTexto}>
                {notificacoesNaoVistas > 9 ? '9+' : notificacoesNaoVistas}
              </Text>
            </View>
          ) : null}
        </View>
      </Pressable>

      <Pressable
        onPress={onMenu}
        style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}
        hitSlop={ALVO_EXTRA}
        accessibilityRole="button"
        accessibilityLabel="Menu"
      >
        <Icone nome="menu" cor="cinza" tamanho={nav.iconeTopo} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: nav.alturaTopo,
  },
  // Sem borda: o asset oficial do "+" já é um mais dentro de um círculo, e
  // um contorno desenhado por fora virava anel duplo. Quem muda de cor é o
  // próprio arquivo — cinza sem publicação hoje, verde depois.
  postar: {
    width: nav.iconePostar,
    height: nav.iconePostar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marca: { height: nav.alturaMarca, width: nav.alturaMarca * PROPORCAO_DA_MARCA },
  vao: { flex: 1 },
  botao: {
    width: nav.iconeTopo + spacing.sm,
    height: nav.iconeTopo + spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressionado: { opacity: 0.55 },

  contador: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 17,
    height: 17,
    borderRadius: radius.pill,
    paddingHorizontal: 4,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.black,
  },
  contadorTexto: {
    ...typography.caption,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '800',
    color: colors.textOnGreen,
  },
});
