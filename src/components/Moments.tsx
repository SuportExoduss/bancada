import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from './Avatar';
import { colors, nav, radius, spacing, typography } from '../theme';

/** O avatar por dentro do anel, já descontando contorno e folga dos dois lados. */
const MIOLO = nav.circuloMoment - (nav.anelMoment + 2) * 2;

/**
 * Um Moment na faixa.
 *
 * **MOMENT é o termo oficial da BANCADA** (D-034) — o equivalente ao que
 * outras redes chamam de "story". Nunca escrever "story" na interface.
 */
export interface MomentNaFaixa {
  uid: string;
  apelido: string;
  nome: string;
  /** Ainda não foi visto: é o que acende o anel verde. */
  porVer: boolean;
}

export interface MomentsProps {
  /** Nome de quem está olhando, para o primeiro círculo */
  meuNome: string;
  meuApelido: string;
  /** Eu tenho Moment ativo agora */
  tenhoMoment?: boolean;
  onMeuMoment: () => void;
  /**
   * Moments de quem a pessoa segue.
   *
   * Chega vazio enquanto a Fase 10 (Mídia) não existir, e a faixa mostra só o
   * primeiro círculo. É o mesmo que qualquer rede mostra para conta nova —
   * inventar rostos aqui seria mentir sobre ter função que não tem.
   */
  momentos?: readonly MomentNaFaixa[];
  onAbrirMoment?: (uid: string) => void;
}

/**
 * Faixa de Moments, logo abaixo da barra de cima.
 *
 * Rolagem horizontal, círculos grandes, nome embaixo. O verde aparece só no
 * anel de quem tem Moment por ver — é o destaque, não a área.
 *
 * A faixa não consulta nada: recebe a lista pronta. Enquanto a Mídia não
 * chega, quem monta a tela passa `momentos` vazio e o convite do primeiro
 * círculo explica o que falta.
 */
export function Moments({
  meuNome,
  meuApelido,
  tenhoMoment = false,
  onMeuMoment,
  momentos = [],
  onAbrirMoment,
}: MomentsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.faixa}
      // Sem isto o toque nos círculos falha quando o dedo encosta e arrasta
      // um pixel — o gesto vira rolagem e o `onPress` some.
      keyboardShouldPersistTaps="handled"
      accessibilityRole="list"
    >
      <Pressable
        onPress={onMeuMoment}
        style={({ pressed }) => [styles.item, pressed && styles.pressionado]}
        accessibilityRole="button"
        accessibilityLabel={tenhoMoment ? 'Ver o seu Moment' : 'Publicar um Moment'}
      >
        <View style={[styles.anel, tenhoMoment ? styles.anelAceso : styles.anelApagado]}>
          <Avatar nome={meuNome} apelido={meuApelido} tamanho={MIOLO} />
        </View>
        {/* O "+" só aparece quando ainda não há Moment: com um publicado, o
            círculo já é o próprio conteúdo e o sinal viraria ruído. */}
        {tenhoMoment ? null : (
          <View style={styles.mais}>
            <Text style={styles.maisTexto}>+</Text>
          </View>
        )}
        <Text style={styles.rotulo} numberOfLines={1}>
          Seu Moment
        </Text>
      </Pressable>

      {momentos.map((m) => (
        <Pressable
          key={m.uid}
          onPress={() => onAbrirMoment?.(m.uid)}
          style={({ pressed }) => [styles.item, pressed && styles.pressionado]}
          accessibilityRole="button"
          accessibilityLabel={`Moment de ${m.nome}`}
        >
          <View style={[styles.anel, m.porVer ? styles.anelAceso : styles.anelApagado]}>
            <Avatar nome={m.nome} apelido={m.apelido} tamanho={MIOLO} />
          </View>
          <Text style={styles.rotulo} numberOfLines={1}>
            {m.nome}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  faixa: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingVertical: spacing.sm,
  },
  item: { alignItems: 'center', width: nav.circuloMoment + 8, gap: spacing.xs },
  pressionado: { opacity: 0.7 },

  anel: {
    width: nav.circuloMoment,
    height: nav.circuloMoment,
    borderRadius: radius.pill,
    borderWidth: nav.anelMoment,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anelAceso: { borderColor: colors.green },
  // Quem já foi visto (ou ainda não publicou) fica com o contorno neutro —
  // a mesma distinção que todo mundo já entende: aceso é novidade.
  //
  // Cinza próprio, e não `colors.border`: aquele é #2A2A2A, feito para
  // separar cartão de fundo, e some por completo em cima da arte escura. Um
  // anel que não se enxerga não distingue nada de nada.
  anelApagado: { borderColor: 'rgba(154, 154, 154, 0.55)' },

  mais: {
    position: 'absolute',
    // Encostado na base do círculo, canto direito: é onde a mão direita
    // alcança sem cobrir o rosto do avatar.
    top: nav.circuloMoment - 20,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.black,
  },
  maisTexto: {
    color: colors.textOnGreen,
    fontSize: 15,
    lineHeight: 17,
    fontWeight: '800',
  },

  rotulo: {
    ...typography.caption,
    fontSize: 11,
    lineHeight: 15,
    color: colors.textOverPhoto,
    textAlign: 'center',
  },
});
