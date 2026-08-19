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
import { Checkbox } from '../components/Checkbox';
import { Input } from '../components/Input';
import { TopBar } from '../components/TopBar';
import {
  MENSAGENS,
  forcaDaSenha,
  validarConfirmacao,
  validarEmail,
  validarSenha,
  type ForcaSenha,
} from '../domain/credentials';
import { LARGURA_MAXIMA_CONTEUDO, useLayout } from '../hooks/useLayout';
import type { AlvoDoCadastro } from '../state/cadastroEmAndamento';
import { colors, radius, spacing, typography } from '../theme';

export interface SignUpScreenProps {
  onBack?: () => void;
  /** Muda os textos da tela: a conta é sua, do responsável ou do menor. */
  alvo?: AlvoDoCadastro;
  onSubmit?: (dados: { email: string; senha: string }) => void;
  onGoogle?: () => void;
  onSignIn?: () => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
  loading?: boolean;
  /** Erro vindo do servidor, já traduzido */
  serverError?: string;
}

/**
 * A mesma tela serve os três casos. Só o texto muda — o formulário de e-mail e
 * senha é idêntico, e duplicar a tela para trocar duas frases só criaria duas
 * telas para manter em vez de uma.
 */
const TEXTOS: Record<AlvoDoCadastro, { titulo: string; subtitulo: string }> = {
  para_mim: {
    titulo: 'Criar conta',
    subtitulo: 'Leva um minuto. Depois você escolhe seu apelido.',
  },
  responsavel: {
    titulo: 'Sua conta',
    subtitulo: 'Comece pela sua. A do seu filho vem logo depois, ligada a esta.',
  },
  menor: {
    titulo: 'Conta do seu filho',
    subtitulo: 'Use um e-mail que ele tenha acesso — é por ele que ele vai entrar.',
  },
};

export function SignUpScreen({
  onBack,
  alvo = 'para_mim',
  onSubmit,
  onGoogle,
  onSignIn,
  onOpenTerms,
  onOpenPrivacy,
  loading = false,
  serverError,
}: SignUpScreenProps) {
  const { isShortHeight } = useLayout();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [aceitou, setAceitou] = useState(false);
  // Só mostra erro depois da primeira tentativa: acusar campo vazio antes de
  // a pessoa digitar é hostil.
  const [tentou, setTentou] = useState(false);

  const erros = useMemo(
    () => ({
      email: validarEmail(email),
      senha: validarSenha(senha),
      confirmacao: validarConfirmacao(senha, confirmacao),
    }),
    [email, senha, confirmacao],
  );

  const valido = !erros.email && !erros.senha && !erros.confirmacao && aceitou;
  const forca = senha.length > 0 ? forcaDaSenha(senha) : null;

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

        {/* Sem isto o teclado cobre o botao de enviar — o defeito mais comum
            de formulario em celular. */}
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
                <Text style={styles.title}>{TEXTOS[alvo].titulo}</Text>
                <Text style={styles.subtitle}>{TEXTOS[alvo].subtitulo}</Text>
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
                    placeholder="Pelo menos 8 caracteres"
                    secret
                    autoCapitalize="none"
                    autoComplete="new-password"
                    textContentType="newPassword"
                    error={tentou && erros.senha ? MENSAGENS.senha[erros.senha] : undefined}
                  />
                  {forca ? <MedidorDeForca forca={forca} /> : null}
                </View>

                <Input
                  label="Repetir senha"
                  value={confirmacao}
                  onChangeText={setConfirmacao}
                  placeholder="Digite de novo"
                  secret
                  autoCapitalize="none"
                  autoComplete="new-password"
                  textContentType="newPassword"
                  error={
                    tentou && erros.confirmacao
                      ? MENSAGENS.confirmacao[erros.confirmacao]
                      : undefined
                  }
                  onSubmitEditing={enviar}
                  returnKeyType="go"
                />

                <Checkbox
                  checked={aceitou}
                  onChange={setAceitou}
                  accessibilityLabel="Li e aceito os Termos de Uso e declaro ter lido a Política de Privacidade"
                >
                  <Text style={styles.termos}>
                    {/* A Política de Privacidade NÃO é aceita, é lida. A base
                        legal do que o app faz é execução de contrato (LGPD
                        art. 7º, V); transformar isso em consentimento daria ao
                        usuário um botão de desligar que a lei não obrigava a
                        dar — e consentimento é revogável a qualquer momento. */}
                    Li e aceito os{' '}
                    <Text style={styles.link} onPress={onOpenTerms}>
                      Termos de Uso
                    </Text>{' '}
                    e declaro ter lido a{' '}
                    <Text style={styles.link} onPress={onOpenPrivacy}>
                      Política de Privacidade
                    </Text>
                    .
                  </Text>
                </Checkbox>

                {tentou && !aceitou ? (
                  <Text style={styles.erroGeral} accessibilityRole="alert">
                    Para continuar, você precisa aceitar os termos.
                  </Text>
                ) : null}

                {serverError ? (
                  <View style={styles.erroServidor} accessibilityRole="alert">
                    <Text style={styles.erroServidorTexto}>{serverError}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.actions}>
                <Button
                  label="Continuar"
                  variant="primary"
                  onPress={enviar}
                  loading={loading}
                  // "Continuar", nao "Criar conta": pela D-024 nada e criado
                  // aqui. A conta nasce no botao final do onboarding, e o rotulo
                  // precisa dizer a verdade sobre o que o toque faz.
                  //
                  // Nao desabilitado quando invalido, de proposito: botao morto
                  // nao explica o que falta. Ao tocar, os erros aparecem.
                />

                {isShortHeight ? null : (
                  <View style={styles.divisor}>
                    <View style={styles.linha} />
                    <Text style={styles.divisorTexto}>ou</Text>
                    <View style={styles.linha} />
                  </View>
                )}

                <Button label="Continuar com Google" variant="secondary" onPress={onGoogle} />

                <Pressable onPress={onSignIn} hitSlop={8} style={styles.rodape}>
                  <Text style={styles.rodapeTexto}>
                    Já tem conta? <Text style={styles.link}>Entrar</Text>
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

function MedidorDeForca({ forca }: { forca: ForcaSenha }) {
  const nivel = forca === 'forte' ? 3 : forca === 'media' ? 2 : 1;
  const cor = forca === 'forte' ? colors.green : forca === 'media' ? colors.warning : colors.danger;
  const rotulo = forca === 'forte' ? 'Senha forte' : forca === 'media' ? 'Senha razoável' : 'Senha fraca';

  return (
    <View style={styles.forca} accessibilityLabel={rotulo}>
      <View style={styles.forcaBarras}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[styles.forcaBarra, { backgroundColor: i <= nivel ? cor : colors.border }]}
          />
        ))}
      </View>
      <Text style={[styles.forcaTexto, { color: cor }]}>{rotulo}</Text>
    </View>
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
    // Menor que o lateral porque a TopBar ja da 44px de respiro acima.
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  column: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA_CONTEUDO,
    gap: spacing.xl,
    // SEM `flex: 1` aqui, de proposito. Dentro de um ScrollView, flex:1 trava
    // a altura no tamanho da tela: o que passar disso e CORTADO em vez de
    // rolar. Foi o defeito que cortou o botao do Google em tela de 568px.
  },
  header: { gap: spacing.xs },
  title: { ...typography.title, color: colors.text },
  subtitle: { ...typography.body, color: colors.textOverPhoto },
  form: { gap: spacing.lg },
  senhaBloco: { gap: spacing.sm },
  forca: { gap: spacing.xs, marginLeft: spacing.xs },
  forcaBarras: { flexDirection: 'row', gap: spacing.xs },
  forcaBarra: { flex: 1, height: 3, borderRadius: radius.sm },
  forcaTexto: { ...typography.caption },
  termos: { ...typography.caption, color: colors.textOverPhoto, lineHeight: 19 },
  link: { color: colors.greenOverPhoto, fontWeight: '600' },
  erroGeral: { ...typography.caption, color: colors.danger, marginLeft: spacing.xs },
  erroServidor: {
    backgroundColor: 'rgba(229, 72, 77, 0.12)',
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  erroServidorTexto: { ...typography.caption, color: colors.danger },
  // Acoes logo apos o formulario, e nao ancoradas no rodape: em formulario e
  // onde a pessoa espera encontrar o botao depois de preencher.
  actions: { gap: spacing.md },
  divisor: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  linha: { flex: 1, height: 1, backgroundColor: colors.border },
  divisorTexto: { ...typography.caption, color: colors.textOverPhoto },
  rodape: { alignItems: 'center', paddingVertical: spacing.sm },
  rodapeTexto: { ...typography.body, color: colors.textOverPhoto },
});
