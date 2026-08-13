import { Image, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
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
 * É também o único momento em que a marca aparece inteira, com a assinatura.
 * Depois daqui o app é sobre o time da pessoa, não sobre a BANCADA.
 */
export function WelcomeScreen({ onCreateAccount, onSignIn }: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />

      <View style={styles.container}>
        <View style={styles.brand}>
          <Image
            source={logo}
            style={styles.logo}
            resizeMode="contain"
            accessible
            accessibilityRole="image"
            accessibilityLabel="BANCADA — Conecta, Organiza, Transforma"
          />

          <Text style={styles.pitch}>
            A várzea inteira{'\n'}
            <Text style={styles.pitchAccent}>num só lugar.</Text>
          </Text>

          <Text style={styles.support}>
            Seu time, seus jogos, seus campeonatos e sua torcida — conectados.
          </Text>
        </View>

        <View style={styles.actions}>
          <Button label="Criar conta" variant="primary" onPress={onCreateAccount} />
          <Button label="Já tenho conta" variant="secondary" onPress={onSignIn} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    justifyContent: 'space-between',
  },
  brand: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  logo: {
    width: '100%',
    // A logo já traz respiro interno; travar a altura evita que ela domine a
    // tela em aparelho pequeno e empurre os botões para fora.
    height: 200,
    maxWidth: 420,
  },
  pitch: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
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
