import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fundo } from '../components/Fundo';
import { TopBar } from '../components/TopBar';
import { IDADE_MINIMA, IDADE_SEM_RESPONSAVEL } from '../domain/idade';
import { LARGURA_MAXIMA_CONTEUDO, useLayout } from '../hooks/useLayout';
import { colors, radius, spacing, typography } from '../theme';

export interface AccountChoiceScreenProps {
  onBack?: () => void;
  onParaMim?: () => void;
  onParaMenor?: () => void;
}

/**
 * "Para quem é a conta?" — primeira pergunta do cadastro.
 *
 * Vem **antes** do e-mail porque a resposta muda o fluxo inteiro: conta de
 * menor de 16 nasce da conta de um responsável (D-025, D-026), e descobrir
 * isso depois de a pessoa ter preenchido tudo obrigaria a jogar o trabalho
 * dela fora.
 *
 * A pergunta também é o que substitui o "clique aqui se você tem 18 anos" —
 * a autodeclaração de idade que a Lei 15.211/2025 proibiu.
 */
export function AccountChoiceScreen({
  onBack,
  onParaMim,
  onParaMenor,
}: AccountChoiceScreenProps) {
  const { isShortHeight } = useLayout();

  return (
    <Fundo variante="auth">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.black} />

        <TopBar onBack={onBack} />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.coluna}>
            <View style={styles.cabecalho}>
              <Text style={styles.titulo}>Para quem é a conta?</Text>
              {isShortHeight ? null : (
                <Text style={styles.subtitulo}>
                  A resposta muda o caminho, então perguntamos antes de você preencher qualquer
                  coisa.
                </Text>
              )}
            </View>

            <View style={styles.opcoes}>
              <Opcao
                titulo="Para mim"
                descricao={`Você tem ${IDADE_SEM_RESPONSAVEL} anos ou mais e vai criar sua própria conta.`}
                onPress={onParaMim}
              />

              <Opcao
                titulo="Para meu filho ou filha"
                descricao={`De ${IDADE_MINIMA} a ${IDADE_SEM_RESPONSAVEL - 1} anos, a conta é criada por você e fica ligada à sua.`}
                onPress={onParaMenor}
              />
            </View>

            <View style={styles.nota}>
              <Text style={styles.notaTexto}>
                Se você tem entre {IDADE_MINIMA} e {IDADE_SEM_RESPONSAVEL - 1} anos, peça para sua
                mãe, seu pai ou seu responsável criar a conta. É a lei, e é o que deixa a BANCADA
                segura para todo mundo.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fundo>
  );
}

function Opcao({
  titulo,
  descricao,
  onPress,
}: {
  titulo: string;
  descricao: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.cartao, pressed && styles.cartaoPressionado]}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityHint={descricao}
    >
      <View style={styles.cartaoTexto}>
        <Text style={styles.cartaoTitulo}>{titulo}</Text>
        <Text style={styles.cartaoDescricao}>{descricao}</Text>
      </View>
      {/* Mesma seta da TopBar, espelhada: aponta para onde o toque leva. */}
      <View style={styles.seta} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Transparente: quem pinta o fundo agora e o <Fundo>.
  safe: { flex: 1, backgroundColor: 'transparent' },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  coluna: { width: '100%', maxWidth: LARGURA_MAXIMA_CONTEUDO, gap: spacing.xl },

  cabecalho: { gap: spacing.xs },
  titulo: { ...typography.title, color: colors.text },
  subtitulo: { ...typography.body, color: colors.textOverPhoto },

  opcoes: { gap: spacing.md },
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  cartaoPressionado: { backgroundColor: colors.surfaceHigh, borderColor: colors.green },
  cartaoTexto: { flex: 1, gap: spacing.xs },
  cartaoTitulo: { ...typography.bodyStrong, color: colors.text },
  cartaoDescricao: { ...typography.caption, color: colors.textMuted, lineHeight: 19 },
  seta: {
    width: 10,
    height: 10,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: colors.textMuted,
    transform: [{ rotate: '45deg' }],
  },

  nota: {
    backgroundColor: colors.greenSoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  notaTexto: { ...typography.caption, color: colors.textOverPhoto, lineHeight: 20 },
});
