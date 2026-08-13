import { WelcomeScreen } from './src/screens/WelcomeScreen';

/**
 * Raiz do aplicativo.
 *
 * Sem navegação ainda, de propósito: existe uma tela só. A navegação entra
 * no passo em que a segunda tela nascer — instalar roteador para uma tela é
 * peça sem função, e peça sem função é dívida.
 */
export default function App() {
  return <WelcomeScreen />;
}
