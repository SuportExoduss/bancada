import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MIN_TOUCH, colors, radius, spacing, typography } from '../theme';

export interface CheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  /** Conteúdo ao lado da caixa — aceita texto com links */
  children: React.ReactNode;
  /** Descrição para leitor de tela, já que o rótulo pode ter links dentro */
  accessibilityLabel: string;
}

export function Checkbox({ checked, onChange, children, accessibilityLabel }: CheckboxProps) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      // hitSlop garante os 44pt de alvo mesmo com a caixa desenhada menor.
      hitSlop={8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      // `aria-checked` alem do accessibilityState: sem ele o leitor de tela
      // anuncia "caixa de selecao" sem dizer se esta marcada — a pessoa nao
      // descobre se ja aceitou os termos.
      aria-checked={checked}
      accessibilityLabel={accessibilityLabel}
      style={styles.row}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Text style={styles.check}>✓</Text> : null}
      </View>
      <View style={styles.labelArea}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    minHeight: MIN_TOUCH,
    paddingVertical: spacing.xs,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  boxChecked: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  check: {
    color: colors.textOnGreen,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 18,
  },
  labelArea: {
    flex: 1,
    ...typography.caption,
  },
});
