import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { MIN_TOUCH, colors, radius, spacing, typography } from '../theme';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  /** Mensagem em português claro. Nunca código de erro cru. */
  error?: string;
  /** Texto de apoio abaixo do campo, quando o rótulo não basta */
  hint?: string;
  /** Campo de senha: mostra o olho para revelar */
  secret?: boolean;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  hint,
  secret = false,
  containerStyle,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const hasError = Boolean(error);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.field,
          focused && styles.fieldFocused,
          hasError && styles.fieldError,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.green}
          secureTextEntry={secret && !revealed}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          accessibilityLabel={label}
          // O erro precisa chegar ao leitor de tela, nao so aos olhos.
          accessibilityHint={error ?? hint}
          {...rest}
        />

        {secret ? (
          <Pressable
            onPress={() => setRevealed((v) => !v)}
            hitSlop={12}
            style={styles.reveal}
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Ocultar senha' : 'Mostrar senha'}
          >
            <Text style={styles.revealIcon}>{revealed ? '🙈' : '👁'}</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Erro tem prioridade sobre a dica: quem errou precisa saber o que
          fazer, nao ler a instrucao que ja nao serviu. */}
      {hasError ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  label: {
    ...typography.caption,
    color: colors.textOverPhoto,
    marginLeft: spacing.xs,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },
  fieldFocused: { borderColor: colors.green },
  fieldError: { borderColor: colors.danger },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  reveal: {
    minWidth: MIN_TOUCH - 12,
    alignItems: 'flex-end',
  },
  revealIcon: { fontSize: 18 },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginLeft: spacing.xs,
  },
  hint: {
    ...typography.caption,
    color: colors.textOverPhoto,
    marginLeft: spacing.xs,
  },
});
