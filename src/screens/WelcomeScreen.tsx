import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { LARGURA_MAXIMA_CONTEUDO, alturaDaMarca, useLayout } from '../hooks/useLayout';
import { colors, spacing, typography } from '../theme';

const logo = require('../../assets/marca/logo-bancada.png');

export interface WelcomeScreenProps {
  onCreateAccount?: () => void;
  onSignIn?: () => void;
}

/**
 * Primeira tela do primeiro acesso.
 *
 * Assume que quem chega **ainda não tem conta** — é o caso de uma plataforma
 * nascendo. Por isso "Criar conta" é a ação primária e "Já tenho conta" é a
 * secundária, e não o contrário.
 *
 * É o único momento em que a marca aparece inteira, com a assinatura. Depois
 * daqui o app é sobre o time da pessoa, não sobre a BANCADA.
 */
export function WelcomeScreen({ onCreateAccount, onSignIn }: WelcomeScreenProps) {
  const layout = useLayout();
  const { isLandscape, isShortHeight, isCompactWidth } = layout;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />

      {/* ScrollView com flexGrow: centraliza quando sobra espaco e rola
          quando falta. Sem ela, paisagem de celular corta a logo. */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.column}>
          <View style={[styles.brand, isShortHeight && styles.brandTight]}>
            <Image
              source={logo}
              style={{ width: '100%', height: alturaDaMarca(layout) }}
              resizeMode="contain"
              accessible
              accessibilityRole="image"
              accessibilityLabel="BANCADA — Conecta, Organiza, Transforma"
            />

            <Text style={[styles.pitch, isCompactWidth && styles.pitchCompact]}>
              A várzea inteira{'\n'}
              <Text style={styles.pitchAccent}>num só lugar.</Text>
            </Text>

            {/* Em paisagem a altura e escassa: a frase de apoio e o primeiro
                elemento a sair, porque os botoes nao podem sair. */}
            {isLandscape ? null : (
              <Text style={styles.support}>
                Seu time, seus jogos, seus campeonatos e sua torcida — conectados.
              </Text>
            )}
          </View>

          <View style={styles.actions}>
            <Button label="Criar conta" variant="primary" onPress={onCreateAccount} />
            <Button label="Já tenho conta" variant="secondary" onPress={onSignIn} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.black,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  column: {
    flex: 1,
    // O teto de largura e o que impede o botao de ter 720px no tablet.
    width: '100%',
    maxWidth: LARGURA_MAXIMA_CONTEUDO,
    justifyContent: 'space-between',
    gap: spacing.xl,
  },
  brand: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    // Garante respiro minimo mesmo quando a altura aperta.
    minHeight: 180,
  },
  brandTight: {
    gap: spacing.sm,
    minHeight: 120,
  },
  pitch: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
  },
  pitchCompact: {
    fontSize: 21,
    lineHeight: 27,
  },
  pitchAccent: {
    color: colors.green,
  },
  support: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 320,
  },
  actions: {
    gap: spacing.md,
  },
});
