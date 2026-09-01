import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BarraDeAbas } from '../components/BarraDeAbas';
import { BarraSuperior } from '../components/BarraSuperior';
import { EmBreve } from '../components/EmBreve';
import { MenuPrincipal } from '../components/MenuPrincipal';
import { Tela, useMargemLateral } from '../components/Tela';
import { ExplorarScreen } from '../screens/ExplorarScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { PerfilScreen } from '../screens/PerfilScreen';
import type { Perfil } from '../services/contaService';
import { publiqueiHoje } from '../services/postService';
import type { ChaveDeAba } from './abas';

export interface CascaDoAppProps {
  perfil: Perfil;
  onAbrirPerfil: (uid: string) => void;
  onNotificacoes: () => void;
  onTermos: () => void;
  onPrivacidade: () => void;
  onSair: () => void;
  saindo?: boolean;
}

/**
 * A casca do app depois de entrar: barra de cima, conteúdo da aba, barra de
 * abas.
 *
 * ## Por que as abas não são rotas
 *
 * Trocar de aba não é navegar — é trocar de contexto no mesmo lugar. Como
 * rota, cada toque empilharia uma tela e o botão voltar do Android
 * desmontaria a barra em ordem inversa, que não é o que ninguém espera.
 * Aqui a aba é estado, e a pilha continua reservada para o que é de fato um
 * passo adiante: o perfil de outra pessoa, um documento, as notificações.
 *
 * ## O que fica montado
 *
 * Só a aba visível. Manter as cinco vivas guardaria o feed carregado ao
 * voltar para ele — mas custaria memória e consultas de abas que a pessoa
 * talvez nem abra na sessão. Enquanto o feed cabe numa página de 20, recarregar
 * é mais barato que guardar.
 */
export function CascaDoApp({
  perfil,
  onAbrirPerfil,
  onNotificacoes,
  onTermos,
  onPrivacidade,
  onSair,
  saindo = false,
}: CascaDoAppProps) {
  const margem = useMargemLateral();
  const [aba, setAba] = useState<ChaveDeAba>('home');
  const [menuAberto, setMenuAberto] = useState(false);

  /**
   * Já publiquei hoje — o que pinta o "+" de verde.
   *
   * Começa `false` e não `null`: cinza é o estado neutro, e um "+" que nasce
   * verde e apaga meio segundo depois pisca à toa em quem não publicou.
   */
  const [publicouHoje, setPublicouHoje] = useState(false);

  /**
   * Pedido para a caixa de publicar abrir, vindo do "+" do topo.
   *
   * Um contador e não um booleano: com booleano, tocar no "+" duas vezes
   * seguidas não mudaria o valor na segunda, e a caixa não reagiria. O
   * contador sempre muda.
   */
  const [pedidoDePublicar, setPedidoDePublicar] = useState(0);

  const conferirPublicacao = useCallback(() => {
    publiqueiHoje(perfil.uid)
      .then(setPublicouHoje)
      // Falhar aqui deixa o "+" cinza e nada mais. Não vale derrubar a tela
      // inteira por causa da cor de um botão.
      .catch(() => setPublicouHoje(false));
  }, [perfil.uid]);

  useEffect(conferirPublicacao, [conferirPublicacao]);

  /**
   * Quantas notificações por ver.
   *
   * Fixo em zero, e é o valor honesto: a Fase 3 ainda não construiu
   * notificação nenhuma, então não existe o que contar. Quando existir, é
   * esta linha que passa a consultar — o sino e o contador já sabem
   * desenhar o resto.
   */
  const notificacoesNaoVistas = 0;
  /** Mesma coisa para Mensagens, que depende da Fase 13 (Chat). */
  const mensagensNaoLidas = 0;

  return (
    <Tela comAbas semMargem>
      <View style={{ paddingHorizontal: margem }}>
        <BarraSuperior
          onPublicar={() => {
            // Publicar mora no feed. Vindo de outra aba, primeiro volta para
            // lá — abrir a caixa por cima de Explorar deixaria o texto sem o
            // contexto de onde ele vai parar.
            setAba('home');
            setPedidoDePublicar((n) => n + 1);
          }}
          publicouHoje={publicouHoje}
          onNotificacoes={onNotificacoes}
          notificacoesNaoVistas={notificacoesNaoVistas}
          onMenu={() => setMenuAberto(true)}
        />
      </View>

      <View style={styles.conteudo}>
        <ConteudoDaAba
          aba={aba}
          perfil={perfil}
          margem={margem}
          pedidoDePublicar={pedidoDePublicar}
          onAbrirPerfil={onAbrirPerfil}
          onPublicou={conferirPublicacao}
        />
      </View>

      <BarraDeAbas ativa={aba} onTrocar={setAba} mensagensNaoLidas={mensagensNaoLidas} />

      <MenuPrincipal
        aberto={menuAberto}
        onFechar={() => setMenuAberto(false)}
        onMeuPerfil={() => {
          setMenuAberto(false);
          setAba('perfil');
        }}
        onTermos={() => {
          setMenuAberto(false);
          onTermos();
        }}
        onPrivacidade={() => {
          setMenuAberto(false);
          onPrivacidade();
        }}
        onSair={onSair}
        saindo={saindo}
      />
    </Tela>
  );
}

function ConteudoDaAba({
  aba,
  perfil,
  margem,
  pedidoDePublicar,
  onAbrirPerfil,
  onPublicou,
}: {
  aba: ChaveDeAba;
  perfil: Perfil;
  margem: number;
  pedidoDePublicar: number;
  onAbrirPerfil: (uid: string) => void;
  onPublicou: () => void;
}) {
  switch (aba) {
    case 'home':
      return (
        <HomeScreen
          perfil={perfil}
          margem={margem}
          abrirPublicar={pedidoDePublicar}
          onAbrirPerfil={onAbrirPerfil}
          onPublicou={onPublicou}
        />
      );

    case 'explorar':
      return (
        <View style={{ flex: 1, paddingHorizontal: margem }}>
          <ExplorarScreen meuUid={perfil.uid} onAbrirPerfil={onAbrirPerfil} />
        </View>
      );

    case 'rolls':
      return (
        <EmBreve
          icone="rolls"
          titulo="Rolls"
          promessa="Vídeo curto da várzea: o gol de ontem, a defesa impossível, a resenha do vestiário — um atrás do outro, em tela cheia."
          quando="Depende de a BANCADA guardar vídeo, que é a Fase 10"
        />
      );

    case 'mensagens':
      return (
        <EmBreve
          icone="mensagens"
          titulo="Mensagens"
          promessa="Conversa direta com quem você segue, e o grupo do time em um lugar só — sem sair do app para combinar a pelada."
          quando="É a Fase 13 do roadmap"
        />
      );

    case 'perfil':
      return (
        <View style={{ flex: 1, paddingHorizontal: margem }}>
          {/* Sem `onBack`: aqui o perfil é uma aba, e seta de voltar numa aba
              não tem para onde voltar. */}
          <PerfilScreen uid={perfil.uid} meuUid={perfil.uid} />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  conteudo: { flex: 1 },
});
