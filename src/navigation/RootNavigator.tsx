import { NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SignUpScreen } from '../screens/SignUpScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
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
  Cadastro: undefined;
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
              // "Ja tenho conta" fica sem destino ate a tela Entrar existir.
              // Mandar quem ja tem conta para o cadastro seria mentir para o
              // usuario — pior que o botao nao fazer nada.
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Cadastro">{() => <SignUpScreen />}</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
