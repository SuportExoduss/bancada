import { NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { ChaveDocumento } from '../content/documentosLegais';
import { AccountChoiceScreen } from '../screens/AccountChoiceScreen';
import { AccountCreatedScreen } from '../screens/AccountCreatedScreen';
import { GuardianFirstScreen } from '../screens/GuardianFirstScreen';
import { LegalDocumentScreen } from '../screens/LegalDocumentScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import {
  APELIDOS_OCUPADOS_DEMO,
  criarApelidoRepositoryMemoria,
} from '../repositories/ApelidoRepository';
import { CadastroProvider, useCadastro } from '../state/cadastroEmAndamento';
import { colors } from '../theme';

/**
 * Rotas do primeiro acesso.
 *
 * Tipada: `navigation.navigate('Cadastro')` erra em tempo de compilação se a
 * rota não existir. Rota escrita como texto solto é erro que só aparece
 * quando o usuário toca no botão.
 *
 * Repare que nenhuma rota carrega e-mail ou senha. Os dados do cadastro em
 * andamento vivem no `CadastroProvider`, em memória — estado de navegação é
 * serializável e pode ser persistido em disco, e senha ali seria senha
 * gravada sem ninguém pedir.
 */
export type RootStackParamList = {
  BoasVindas: undefined;
  Entrar: undefined;
  ParaQuem: undefined;
  ContaDoResponsavel: undefined;
  Cadastro: undefined;
  Onboarding: undefined;
  ContaCriada: undefined;
  /** Termos de Uso e Política de Privacidade, lidos dentro do app */
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
    <CadastroProvider>
      <NavigationContainer theme={temaBancada}>
        <Rotas />
      </NavigationContainer>
    </CadastroProvider>
  );
}

function Rotas() {
  const { dados, iniciar, guardar, limpar } = useCadastro();

  return (
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
            onCreateAccount={() => navigation.navigate('ParaQuem')}
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
            onSignUp={() => navigation.replace('ParaQuem')}
          />
        )}
      </Stack.Screen>

      {/* A pergunta vem ANTES do e-mail: a resposta muda o fluxo inteiro, e
          descobrir isso depois obrigaria a jogar fora o que a pessoa digitou. */}
      <Stack.Screen name="ParaQuem">
        {({ navigation }) => (
          <AccountChoiceScreen
            onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
            onParaMim={() => {
              iniciar('para_mim');
              navigation.navigate('Cadastro');
            }}
            onParaMenor={() => {
              // Ainda nao e 'menor': primeiro nasce a conta do responsavel.
              iniciar('responsavel');
              navigation.navigate('ContaDoResponsavel');
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ContaDoResponsavel">
        {({ navigation }) => (
          <GuardianFirstScreen
            onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
            onEntrar={() => navigation.navigate('Entrar')}
            onCriarMinhaConta={() => navigation.navigate('Cadastro')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Cadastro">
        {({ navigation }) => (
          <SignUpScreen
            onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
            alvo={dados.alvo}
            onSubmit={({ email, senha }) => {
              guardar({ email, senha, aceitouTermos: true });
              navigation.navigate('Onboarding');
            }}
            onSignIn={() => navigation.replace('Entrar')}
            onOpenTerms={() => navigation.navigate('Documento', { documento: 'termos' })}
            onOpenPrivacy={() => navigation.navigate('Documento', { documento: 'privacidade' })}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Onboarding">
        {({ navigation }) => (
          <OnboardingScreen
            onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
            alvo={dados.alvo}
            repositorioApelido={repositorioApelido}
            onSubmit={(perfil) => {
              // AQUI a conta nasce (D-024). Enquanto o Firebase nao entra, o
              // que existe e o registro do que seria gravado -- e e de
              // proposito que so exista um lugar onde isso acontece.
              guardar(perfil);
              navigation.navigate('ContaCriada');
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ContaCriada" options={{ animation: 'fade' }}>
        {({ navigation }) => (
          <AccountCreatedScreen
            alvo={dados.alvo}
            apelido={dados.apelido}
            onContinuarParaMenor={() => {
              // Segunda volta pelo mesmo par de telas, agora para o menor.
              // `reset` e nao `navigate`: a pilha do cadastro do responsavel
              // ja cumpriu o papel, e deixa-la embaixo faria o botao voltar
              // reabrir um formulario que ja virou conta.
              iniciar('menor');
              navigation.reset({ index: 0, routes: [{ name: 'Cadastro' }] });
            }}
            onAgoraNao={() => {
              limpar();
              navigation.reset({ index: 0, routes: [{ name: 'BoasVindas' }] });
            }}
            onEntrarNoApp={() => {
              limpar();
              navigation.reset({ index: 0, routes: [{ name: 'BoasVindas' }] });
            }}
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
  );
}
