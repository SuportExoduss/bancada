import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { MIN_TOUCH, colors, radius, spacing, typography } from '../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'medium' | 'large';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  /** Ocupa toda a largura disponível */
  block?: boolean;
  style?: ViewStyle;
  /** Rótulo para leitor de tela, quando o texto visível não bastar */
  accessibilityLabel?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'large',
  loading = false,
  disabled = false,
  block = true,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      // Desabilitado enquanto carrega: sem isso, o toque duplo no celular
      // envia duas vezes — e no motor esportivo isso vira dois gols.
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        variantStyle(variant, pressed),
        block && styles.block,
        inactive && styles.inactive,
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? colors.textOnGreen : colors.text}
          />
        ) : null}
        <Text style={[styles.label, labelColor(variant)]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

function variantStyle(variant: ButtonVariant, pressed: boolean): ViewStyle {
  switch (variant) {
    case 'primary':
      return { backgroundColor: pressed ? colors.greenPressed : colors.green };
    case 'secondary':
      return {
        backgroundColor: pressed ? colors.surfaceHigh : colors.surface,
        borderWidth: 1,
        borderColor: pressed ? colors.green : colors.border,
      };
    case 'ghost':
      return { backgroundColor: 'transparent' };
  }
}

function labelColor(variant: ButtonVariant) {
  return variant === 'primary'
    ? { color: colors.textOnGreen }
    : variant === 'ghost'
      ? { color: colors.textMuted }
      : { color: colors.text };
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
  },
  medium: { minHeight: MIN_TOUCH },
  large: { minHeight: 54 },
  block: { alignSelf: 'stretch' },
  inactive: { opacity: 0.5 },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: typography.button,
});
