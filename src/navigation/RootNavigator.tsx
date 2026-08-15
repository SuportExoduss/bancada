import { NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LegalDocumentScreen } from '../screens/LegalDocumentScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import {
  APELIDOS_OCUPADOS_DEMO,
  criarApelidoRepositoryMemoria,
} from '../repositories/ApelidoRepository';
import type { ChaveDocumento } from '../content/documentosLegais';
import { colors } from '../theme';

/**
 * Rotas do primeiro acesso.
 *
 * Tipada: `navigation.navigate('Cadastro')` erra em tempo de compilação se a
 * rota não existir. Rota escrita como texto solto é erro que só aparece
 * quando o usuário toca no botão.
 */
export type RootStackParamList = {
  BoasVindas: undefined;
  Entrar: undefined;
  Cadastro: undefined;
  Onboarding: undefined;
  /** Termos de Uso e Politica de Privacidade, lidos dentro do app */
  Documento: { documento: ChaveDocumento };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Tema escuro do próprio navegador.
 *
 * Sem isto o fundo entre transições pisca branco — o "flash" que denuncia
 * app mal-acabado, e que é especialmente feio num app de tema escuro.
 */
const temaBancada: Theme = {
  dark: true,
  colors: {
    primary: colors.green,
    background: colors.black,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.green,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '800' },
  },
};

// Temporario: sai quando o FirestoreApelidoRepository entrar. Existe para a
// tela poder exercitar de verdade os estados de disponivel e em uso.
const repositorioApelido = criarApelidoRepositoryMemoria(APELIDOS_OCUPADOS_DEMO);

export function RootNavigator() {
  return (
    <NavigationContainer theme={temaBancada}>
      <Stack.Navigator
        initialRouteName="BoasVindas"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.black },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="BoasVindas">
          {({ navigation }) => (
            <WelcomeScreen
              onCreateAccount={() => navigation.navigate('Cadastro')}
              onSignIn={() => navigation.navigate('Entrar')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Entrar">
          {({ navigation }) => (
            <SignInScreen
              // `canGoBack` antes de voltar: se a tela for a primeira da pilha
              // (link direto, futuro deep link), voltar nao existe e a seta
              // sai. Chamar `goBack` numa pilha vazia nao faz nada, e seta
              // que nao faz nada e pior que seta nenhuma.
              onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
              // `replace` e nao `navigate`: quem esta no Entrar e vai para o
              // Cadastro nao deveria voltar para o Entrar com o botao voltar.
              // Sao dois caminhos alternativos, nao uma sequencia.
              onSignUp={() => navigation.replace('Cadastro')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Cadastro">
          {({ navigation }) => (
            <SignUpScreen
              onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
              onSubmit={() => navigation.navigate('Onboarding')}
              onSignIn={() => navigation.replace('Entrar')}
              onOpenTerms={() => navigation.navigate('Documento', { documento: 'termos' })}
              onOpenPrivacy={() =>
                navigation.navigate('Documento', { documento: 'privacidade' })
              }
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Onboarding">
          {({ navigation }) => (
            <OnboardingScreen
              onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
              repositorioApelido={repositorioApelido}
            />
          )}
        </Stack.Screen>
        {/* `slide_from_bottom`: ler os termos e uma pausa na leitura do
            cadastro, nao um passo adiante no fluxo. A animacao diz isso. */}
        <Stack.Screen name="Documento" options={{ animation: 'slide_from_bottom' }}>
          {({ navigation, route }) => (
            <LegalDocumentScreen
              documento={route.params.documento}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
