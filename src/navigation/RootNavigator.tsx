import { useState } from 'react';

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
import { criarApelidoRepositoryFirestore } from '../repositories/FirestoreApelidoRepository';
import { criarConta, entrar, recuperarSenha, usuarioAtual } from '../services/contaService';
import { mensagemDoErro } from '../services/erros';
import { useSessao } from '../hooks/useSessao';
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

// Agora consulta o Firestore de verdade: uma leitura por ID em apelidos/{chave},
// nao uma varredura da colecao.
const repositorioApelido = criarApelidoRepositoryFirestore();

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
  const sessao = useSessao();

  /**
   * Terceira camada da D-024: alguém autenticado **sem perfil**.
   *
   * Acontece se a gravação do perfil falhar E a exclusão da autenticação
   * também falhar — janela estreita, mas real. Deixar essa pessoa entrar num
   * app sem nome e sem apelido seria pior que pedir para terminar o cadastro,
   * então a rota inicial passa a ser o onboarding.
   *
   * Não é um erro para mostrar: do ponto de vista de quem usa, o cadastro
   * simplesmente continua de onde parou.
   */
  const contaSemPerfil = sessao.situacao === 'sem_perfil';

  // Um estado de "trabalhando" e um de erro por vez: so existe um formulario
  // em curso, e dois indicadores independentes so criariam a chance de a tela
  // mostrar carregando e erro ao mesmo tempo.
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | undefined>();

  return (
    <Stack.Navigator
      initialRouteName={contaSemPerfil ? 'Onboarding' : 'BoasVindas'}
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
            loading={ocupado}
            serverError={erro}
            onSubmit={async ({ email, senha }) => {
              setErro(undefined);
              setOcupado(true);
              try {
                const perfil = await entrar(email, senha);

                // Fluxo do responsavel: ele entrou justamente para criar a
                // conta do filho. Emenda direto, sem passar pelo inicio.
                if (dados.alvo === 'responsavel') {
                  // `iniciar` zera o estado, entao o `guardar` vem DEPOIS.
                  // Na ordem inversa o uid seria apagado logo em seguida.
                  iniciar('menor');
                  guardar({ responsavelUid: perfil.uid });
                  navigation.reset({ index: 0, routes: [{ name: 'Cadastro' }] });
                  return;
                }

                limpar();
                navigation.reset({ index: 0, routes: [{ name: 'ContaCriada' }] });
              } catch (e) {
                setErro(mensagemDoErro(e));
              } finally {
                setOcupado(false);
              }
            }}
            onForgotPassword={async () => {
              setErro(undefined);
              // Nao diz se o e-mail existe -- ver `recuperarSenha`.
              await recuperarSenha(dados.email ?? '');
              setErro('Se existir conta com esse e-mail, o link de recuperacao foi enviado.');
            }}
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
            loading={ocupado}
            serverError={erro}
            onSubmit={async (perfil) => {
              // AQUI a conta nasce (D-024). Antes deste toque nada existe:
              // nem autenticacao, nem apelido reservado, nem perfil.
              setErro(undefined);
              setOcupado(true);
              try {
                await criarConta({
                  email: dados.email ?? '',
                  senha: dados.senha ?? '',
                  nome: perfil.nome,
                  sobrenome: perfil.sobrenome,
                  apelido: perfil.apelido,
                  nascimento: perfil.nascimento,
                  faixa: perfil.faixa,
                  ...(dados.alvo === 'menor' && dados.responsavelUid
                    ? { responsavelUid: dados.responsavelUid }
                    : {}),
                });
                guardar(perfil);
                navigation.reset({ index: 0, routes: [{ name: 'ContaCriada' }] });
              } catch (e) {
                setErro(mensagemDoErro(e));
              } finally {
                setOcupado(false);
              }
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
              // O uid do responsavel e capturado AGORA, enquanto ele ainda e
              // quem esta logado. Criar a conta do filho troca a sessao, e
              // perguntar depois devolveria o uid errado.
              const uidDoResponsavel = usuarioAtual()?.uid;
              // Segunda volta pelo mesmo par de telas, agora para o menor.
              // `reset` e nao `navigate`: a pilha do cadastro do responsavel
              // ja cumpriu o papel, e deixa-la embaixo faria o botao voltar
              // reabrir um formulario que ja virou conta.
              iniciar('menor');
              guardar({ responsavelUid: uidDoResponsavel });
              setErro(undefined);
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
