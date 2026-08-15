import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MIN_TOUCH, colors, spacing, typography } from '../theme';

export interface TopBarProps {
  onBack?: () => void;
  /** Texto curto ao lado da seta. A tela já tem seu título grande; use só
   *  quando ele não estiver visível. */
  title?: string;
}

/**
 * Barra do topo com a seta de voltar.
 *
 * Fica **fora** do ScrollView de propósito: a saída não pode depender de a
 * pessoa rolar até achá-la. Em paisagem de celular, onde o conteúdo passa da
 * tela, essa diferença é a diferença entre ter e não ter como voltar.
 *
 * Não aparece na primeira tela do fluxo — de boas-vindas não se volta para
 * lugar nenhum, e seta que não leva a lugar algum é pior que seta nenhuma.
 */
export function TopBar({ onBack, title }: TopBarProps) {
  return (
    <View style={styles.barra}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [styles.alvo, pressed && styles.alvoPressionado]}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          accessibilityHint="Volta para a tela anterior sem perder o que você já digitou"
        >
          {/* Quadrado com duas bordas, girado 45°: vira um "<". Evita
              depender de fonte de ícone ou de biblioteca só por uma seta. */}
          <View style={styles.chevron} />
        </Pressable>
      ) : (
        <View style={styles.alvo} />
      )}

      {title ? (
        <Text style={styles.titulo} numberOfLines={1}>
          {title}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    // Sem altura fixa: a barra é do tamanho do alvo de toque, e o alvo de
    // toque é o mínimo acessível.
    minHeight: MIN_TOUCH,
  },
  alvo: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: MIN_TOUCH / 2,
  },
  alvoPressionado: {
    backgroundColor: colors.surfaceHigh,
  },
  chevron: {
    width: 11,
    height: 11,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.text,
    transform: [{ rotate: '45deg' }],
    // Compensa o deslocamento visual que a rotação causa: sem isto a seta
    // parece fora do centro do alvo.
    marginLeft: 3,
  },
  titulo: {
    ...typography.bodyStrong,
    color: colors.text,
    flexShrink: 1,
  },
});
