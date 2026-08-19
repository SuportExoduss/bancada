import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fundo } from '../components/Fundo';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { TopBar } from '../components/TopBar';
import { MENSAGENS, validarEmail } from '../domain/credentials';
import { LARGURA_MAXIMA_CONTEUDO, useLayout } from '../hooks/useLayout';
import { colors, radius, spacing, typography } from '../theme';

export interface SignInScreenProps {
  onBack?: () => void;
  onSubmit?: (dados: { email: string; senha: string }) => void;
  onGoogle?: () => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  loading?: boolean;
  /** Erro vindo do servidor, já traduzido para português */
  serverError?: string;
}

/**
 * Entrar.
 *
 * **Login por e-mail, não por apelido** (D-016). O Firebase Auth entra por
 * e-mail; para entrar por apelido o app teria que resolver apelido→e-mail
 * antes de a pessoa estar logada, e sem Cloud Functions (D-012) esse mapa
 * precisaria ser público — expondo o e-mail de todos os usuários.
 *
 * O apelido continua sendo a identidade pública. Ele só não é credencial.
 */
export function SignInScreen({
  onBack,
  onSubmit,
  onGoogle,
  onForgotPassword,
  onSignUp,
  loading = false,
  serverError,
}: SignInScreenProps) {
  const { isShortHeight } = useLayout();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tentou, setTentou] = useState(false);

  const erros = useMemo(
    () => ({
      email: validarEmail(email),
      // No login a senha só precisa existir. Cobrar 8 caracteres aqui seria
      // dizer "sua senha está errada" para quem tem uma senha antiga válida.
      senha: senha.length === 0 ? ('vazio' as const) : null,
    }),
    [email, senha],
  );

  const valido = !erros.email && !erros.senha;

  function enviar() {
    setTentou(true);
    if (!valido || loading) return;
    onSubmit?.({ email: email.trim(), senha });
  }

  return (
    <Fundo variante="auth">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.black} />

        <TopBar onBack={onBack} />

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.column}>
              <View style={styles.header}>
                <Text style={styles.title}>Bem-vindo de volta</Text>
                <Text style={styles.subtitle}>A várzea não parou enquanto você esteve fora.</Text>
              </View>

              <View style={styles.form}>
                <Input
                  label="E-mail"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="voce@exemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  error={tentou && erros.email ? MENSAGENS.email[erros.email] : undefined}
                />

                <View style={styles.senhaBloco}>
                  <Input
                    label="Senha"
                    value={senha}
                    onChangeText={setSenha}
                    placeholder="Sua senha"
                    secret
                    autoCapitalize="none"
                    autoComplete="current-password"
                    textContentType="password"
                    error={tentou && erros.senha ? 'Digite sua senha.' : undefined}
                    onSubmitEditing={enviar}
                    returnKeyType="go"
                  />

                  <Pressable
                    onPress={onForgotPassword}
                    hitSlop={8}
                    style={styles.esqueci}
                    accessibilityRole="button"
                  >
                    <Text style={styles.link}>Esqueci minha senha</Text>
                  </Pressable>
                </View>

                {/* O erro do servidor vive aqui, acima do botao: e onde o olho
                    volta depois de tocar em Entrar e nada acontecer. */}
                {serverError ? (
                  <View style={styles.erroServidor} accessibilityRole="alert">
                    <Text style={styles.erroServidorTexto}>{serverError}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.actions}>
                <Button label="Entrar" variant="primary" onPress={enviar} loading={loading} />

                {isShortHeight ? null : (
                  <View style={styles.divisor}>
                    <View style={styles.linha} />
                    <Text style={styles.divisorTexto}>ou</Text>
                    <View style={styles.linha} />
                  </View>
                )}

                <Button label="Continuar com Google" variant="secondary" onPress={onGoogle} />

                <Pressable onPress={onSignUp} hitSlop={8} style={styles.rodape}>
                  <Text style={styles.rodapeTexto}>
                    Não tem conta? <Text style={styles.link}>Criar conta</Text>
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Fundo>
  );
}

const styles = StyleSheet.create({
  // Transparente: quem pinta o fundo agora e o <Fundo>.
  safe: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    // Menor que o lateral porque a TopBar já dá 44px de respiro acima.
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  // Sem `flex: 1`: dentro de ScrollView ele trava a altura no tamanho da tela
  // e o excedente e cortado em vez de rolar.
  column: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA_CONTEUDO,
    gap: spacing.xl,
  },
  header: { gap: spacing.xs },
  title: { ...typography.title, color: colors.text },
  subtitle: { ...typography.body, color: colors.textOverPhoto },
  form: { gap: spacing.lg },
  senhaBloco: { gap: spacing.sm },
  esqueci: { alignSelf: 'flex-end', paddingVertical: spacing.xs },
  // Spread ANTES das sobrescritas: ao contrario, typography.caption apagaria
  // o fontWeight logo abaixo dele.
  link: { ...typography.caption, color: colors.greenOverPhoto, fontWeight: '600' },
  erroServidor: {
    backgroundColor: 'rgba(229, 72, 77, 0.12)',
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  erroServidorTexto: { ...typography.caption, color: colors.danger },
  actions: { gap: spacing.md },
  divisor: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  linha: { flex: 1, height: 1, backgroundColor: colors.border },
  divisorTexto: { ...typography.caption, color: colors.textOverPhoto },
  rodape: { alignItems: 'center', paddingVertical: spacing.sm },
  rodapeTexto: { ...typography.body, color: colors.textOverPhoto },
});
