import { StyleSheet, Text, View } from 'react-native';

import { Icone, type NomeDoIcone } from './Icone';
import { colors, radius, spacing, typography } from '../theme';

export interface EmBreveProps {
  icone: NomeDoIcone;
  titulo: string;
  /** O que a seção vai fazer quando existir */
  promessa: string;
  /** De que fase do roadmap ela depende — a frase que evita a pergunta */
  quando: string;
}

/**
 * Tela de uma seção que ainda não tem função.
 *
 * A barra de baixo nasce com as cinco posições porque a ordem é parte da
 * especificação e mudar depois quebra o hábito de quem usa. Mas seção sem
 * conteúdo não vira imitação de conteúdo: aqui se diz o que vai ter e de que
 * fase depende.
 *
 * O texto é escrito para quem está testando o app, não para o desenvolvedor.
 * Dizer "Fase 10" sem dizer o que é seria informação de gente de dentro.
 */
export function EmBreve({ icone, titulo, promessa, quando }: EmBreveProps) {
  return (
    <View style={styles.centro}>
      <View style={styles.cartao}>
        <Icone nome={icone} cor="cinza" tamanho={40} />
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.texto}>{promessa}</Text>
        <Text style={styles.quando}>{quando}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  cartao: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    maxWidth: 360,
  },
  titulo: { ...typography.subtitle, color: colors.text, marginTop: spacing.xs },
  texto: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  quando: {
    ...typography.caption,
    fontSize: 12,
    color: colors.green,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
