import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fundo } from '../components/Fundo';
import { Button } from '../components/Button';
import { LARGURA_MAXIMA_CONTEUDO } from '../hooks/useLayout';
import type { AlvoDoCadastro } from '../state/cadastroEmAndamento';
import { colors, radius, spacing, typography } from '../theme';

export interface AccountCreatedScreenProps {
  alvo: AlvoDoCadastro;
  apelido?: string;
  onContinuarParaMenor?: () => void;
  onAgoraNao?: () => void;
  onEntrarNoApp?: () => void;
}

/**
 * Confirmação de conta criada.
 *
 * Não tem seta de voltar de propósito: a conta já existe, e voltar para o
 * formulário que a criou só produziria confusão ou uma segunda conta.
 *
 * No fluxo do responsável, é aqui que aparece o convite para continuar a
 * criação da conta do filho — depois de a conta dele existir, nunca antes.
 */
export function AccountCreatedScreen({
  alvo,
  apelido,
  onContinuarParaMenor,
  onAgoraNao,
  onEntrarNoApp,
}: AccountCreatedScreenProps) {
  const ehResponsavel = alvo === 'responsavel';
  const ehMenor = alvo === 'menor';

  return (
    <Fundo variante="auth">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.black} />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.coluna}>
            <View style={styles.selo}>
              <Text style={styles.seloTexto}>✓</Text>
            </View>

            <View style={styles.cabecalho}>
              <Text style={styles.titulo}>
                {ehMenor ? 'Conta criada e ligada à sua' : 'Conta criada'}
              </Text>
              {apelido ? <Text style={styles.apelido}>@{apelido}</Text> : null}
            </View>

            {ehResponsavel ? (
              <>
                <Text style={styles.texto}>
                  Agora que a sua conta existe, dá para criar a do seu filho ou filha ligada a ela.
                </Text>
                <View style={styles.acoes}>
                  <Button
                    label="Continuar e criar a conta dele"
                    variant="primary"
                    onPress={onContinuarParaMenor}
                  />
                  <Button label="Agora não" variant="ghost" onPress={onAgoraNao} />
                </View>
                <Text style={styles.rodape}>
                  Se deixar para depois, dá para criar a qualquer momento em Configurações → Família.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.texto}>
                  {ehMenor
                    ? 'Ele já pode entrar. Você acompanha os contatos e pode ajustar tudo em Configurações → Família — e ele sabe o que você enxerga.'
                    : 'Tudo pronto. Bem-vindo à várzea.'}
                </Text>
                <View style={styles.acoes}>
                  <Button label="Entrar na BANCADA" variant="primary" onPress={onEntrarNoApp} />
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fundo>
  );
}

const styles = StyleSheet.create({
  // Transparente: quem pinta o fundo agora e o <Fundo>.
  safe: { flex: 1, backgroundColor: 'transparent' },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  coluna: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA_CONTEUDO,
    gap: spacing.lg,
    alignItems: 'center',
  },

  selo: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seloTexto: { fontSize: 30, color: colors.green },

  cabecalho: { gap: spacing.xs, alignItems: 'center' },
  titulo: { ...typography.title, color: colors.text, textAlign: 'center' },
  apelido: { ...typography.bodyStrong, color: colors.green },

  texto: { ...typography.body, color: colors.textOverPhoto, textAlign: 'center', lineHeight: 23 },

  acoes: { gap: spacing.md, width: '100%', marginTop: spacing.sm },
  rodape: { ...typography.caption, color: colors.textOverPhoto, textAlign: 'center', lineHeight: 19 },
});
