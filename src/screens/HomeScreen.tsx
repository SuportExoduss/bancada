import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { QueryDocumentSnapshot } from 'firebase/firestore';

import { Moments } from '../components/Moments';
import { PostDoFeed } from '../components/PostDoFeed';
import { Publicar } from '../components/Publicar';
import { LARGURA_MAXIMA_CONTEUDO } from '../hooks/useLayout';
import type { Perfil } from '../services/contaService';
import { mensagemDoErro } from '../services/erros';
import { apagarPost, carregarFeed, publicar, type Post } from '../services/postService';
import { feedDeQuemSigo, quemEuSigo, seguir } from '../services/seguirService';
import { colors, radius, spacing, typography } from '../theme';

export interface HomeScreenProps {
  perfil: Perfil;
  /** Margem lateral da casca, para o conteúdo alinhar com a barra de cima */
  margem: number;
  /**
   * Contador de pedidos do "+" da barra de cima.
   *
   * Cada toque incrementa. A caixa de escrever abre quando o número muda, e
   * não quando ele é verdadeiro — assim tocar duas vezes seguidas funciona.
   */
  abrirPublicar?: number;
  onAbrirPerfil?: (uid: string) => void;
  /** Avisa a casca que houve publicação, para o "+" ficar verde */
  onPublicou?: () => void;
}

/**
 * As abas do feed.
 *
 * TUDO é descoberta, SEGUINDO é a turma da pessoa. Não confundir com a barra
 * de baixo: aquela troca de seção do app, esta troca a fonte do mesmo feed.
 */
type Aba = 'tudo' | 'seguindo';

/**
 * Home — o feed da várzea, e a tela em que o app abre.
 *
 * Cronológico, do mais novo para o mais velho. A pendência 7 (cronológico ou
 * híbrido) segue aberta; híbrido precisa de sinais que ainda não existem —
 * reações e histórico de leitura.
 *
 * A tela **não** desenha fundo, área segura nem barra: quem cuida disso é a
 * `CascaDoApp`. Aqui é só o conteúdo, para o feed poder rolar por baixo das
 * barras em vez de ficar preso numa caixa entre elas.
 */
export function HomeScreen({
  perfil,
  margem,
  abrirPublicar = 0,
  onAbrirPerfil,
  onPublicou,
}: HomeScreenProps) {
  const [aba, setAba] = useState<Aba>('tudo');
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot | null>(null);
  const [acabou, setAcabou] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState<string | undefined>();
  const [escrevendo, setEscrevendo] = useState(false);

  /**
   * Quem eu sigo, carregado **uma vez** para o feed inteiro.
   *
   * A alternativa seria perguntar por post se eu sigo aquele autor — e um
   * feed de 20 posts viraria 20 leituras extras. Aqui é uma consulta só, e o
   * conjunto responde a todas as perguntas na memória.
   */
  const [sigo, setSigo] = useState<Set<string>>(new Set());
  const [seguindoAgora, setSeguindoAgora] = useState<string | null>(null);

  const buscar = useCallback(async (recomecar: boolean) => {
    try {
      setErro(undefined);

      if (aba === 'seguindo') {
        // Sem paginação nesta aba, de propósito: quem segue mais de 30 pessoas
        // precisa de várias consultas, e paginar isso direito exige um cursor
        // por bloco. Não vale enquanto ninguém segue 30 pessoas -- ver o
        // comentário em `feedDeQuemSigo`.
        const lista = await feedDeQuemSigo(perfil.uid);
        setPosts(lista);
        setCursor(null);
        setAcabou(true);
        return;
      }

      const pagina = await carregarFeed(recomecar ? null : cursor);
      // `recomecar` troca a lista; senão acumula. Sem essa distinção, puxar
      // para atualizar duplicaria tudo o que já estava na tela.
      setPosts((atuais) => (recomecar ? pagina.posts : [...atuais, ...pagina.posts]));
      setCursor(pagina.cursor);
      setAcabou(pagina.acabou);
    } catch (e) {
      setErro(mensagemDoErro(e));
    }
  }, [cursor, aba, perfil.uid]);

  useEffect(() => {
    quemEuSigo(perfil.uid)
      .then((lista) => setSigo(new Set(lista)))
      // Falhar aqui não pode derrubar o feed: sem a lista o botão Seguir
      // simplesmente não aparece, e o resto continua funcionando.
      .catch(() => setSigo(new Set()));
  }, [perfil.uid]);

  useEffect(() => {
    setCarregando(true);
    setPosts([]);
    buscar(true).finally(() => setCarregando(false));
    // Depende só da ABA, não de `buscar`: `buscar` muda quando o cursor muda, e
    // depender dele aqui faria a lista recarregar sozinha a cada página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aba]);

  useEffect(() => {
    // Zero é o valor de partida do contador: significa "ninguém tocou no +".
    if (abrirPublicar > 0) setEscrevendo(true);
  }, [abrirPublicar]);

  async function atualizar() {
    setAtualizando(true);
    await buscar(true);
    setAtualizando(false);
  }

  async function maisUmaPagina() {
    if (acabou || carregandoMais || carregando) return;
    setCarregandoMais(true);
    await buscar(false);
    setCarregandoMais(false);
  }

  async function enviarPost(texto: string) {
    await publicar(perfil, texto);
    setEscrevendo(false);
    // Recarrega do começo em vez de inserir na mão: o carimbo de hora vem do
    // servidor, e montar o post localmente mostraria uma hora que pode não ser
    // a que ficou gravada.
    await buscar(true);
    // O "+" da barra de cima fica verde a partir daqui.
    onPublicou?.();
  }

  async function seguirAutor(uid: string) {
    setSeguindoAgora(uid);
    // Entra no conjunto antes da rede: o botão some na hora, e é isso que faz
    // o toque parecer instantâneo. Se falhar, volta.
    setSigo((atual) => new Set(atual).add(uid));
    try {
      await seguir(perfil.uid, uid);
    } catch (e) {
      setSigo((atual) => {
        const copia = new Set(atual);
        copia.delete(uid);
        return copia;
      });
      setErro(mensagemDoErro(e));
    } finally {
      setSeguindoAgora(null);
    }
  }

  async function removerPost(post: Post) {
    // Some da tela primeiro. Se a remoção falhar, ele volta — mas o caso comum
    // é dar certo, e esperar a rede para o item sumir faz o toque parecer
    // ignorado.
    setPosts((atuais) => atuais.filter((p) => p.id !== post.id));
    try {
      await apagarPost(post.id);
    } catch (e) {
      setErro(mensagemDoErro(e));
      await buscar(true);
    }
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(p) => p.id}
      contentContainerStyle={[styles.lista, { paddingHorizontal: margem }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={atualizando}
          onRefresh={atualizar}
          tintColor={colors.green}
          colors={[colors.green]}
        />
      }
      ListHeaderComponent={
        <View style={styles.cabecalho}>
          <Moments
            meuNome={perfil.nome}
            meuApelido={perfil.apelido}
            // A faixa chega vazia: Moment depende de a BANCADA guardar foto e
            // vídeo, que é a Fase 10. O primeiro círculo explica.
            momentos={[]}
            onMeuMoment={() =>
              setErro('Moment chega junto com foto e vídeo. Por enquanto, publique em texto.')
            }
          />

          <View style={styles.abas}>
            <AbaBotao rotulo="Tudo" ativa={aba === 'tudo'} onPress={() => setAba('tudo')} />
            <AbaBotao
              rotulo="Seguindo"
              ativa={aba === 'seguindo'}
              onPress={() => setAba('seguindo')}
            />
          </View>

          {/* A caixa de escrever só aparece quando pedida pelo "+" do topo.
              Fixa no cabeçalho, ela empurrava o primeiro post para fora da
              tela em todo carregamento — e a maior parte das aberturas do app
              é para ler, não para escrever. */}
          {escrevendo ? (
            <View style={styles.caixaDeEscrever}>
              <Publicar onPublicar={enviarPost} nome={perfil.nome} />
              <Pressable
                onPress={() => setEscrevendo(false)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Fechar a caixa de escrever"
              >
                <Text style={styles.cancelar}>Agora não</Text>
              </Pressable>
            </View>
          ) : null}

          {erro ? (
            <Text style={styles.erro} accessibilityRole="alert">
              {erro}
            </Text>
          ) : null}
        </View>
      }
      renderItem={({ item }) => (
        <PostDoFeed
          post={item}
          onApagar={item.autorUid === perfil.uid ? () => removerPost(item) : undefined}
          onAbrirAutor={onAbrirPerfil ? () => onAbrirPerfil(item.autorUid) : undefined}
          // Três condições para o botão existir: não é meu post, ainda não
          // sigo, e não estou na aba Seguindo -- onde por definição já
          // sigo todo mundo.
          onSeguir={
            item.autorUid !== perfil.uid && !sigo.has(item.autorUid) && aba === 'tudo'
              ? () => seguirAutor(item.autorUid)
              : undefined
          }
          seguindoAgora={seguindoAgora === item.autorUid}
        />
      )}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      ListEmptyComponent={
        carregando ? (
          <View style={styles.centro}>
            <ActivityIndicator color={colors.green} />
          </View>
        ) : (
          <View style={styles.vazio}>
            <Text style={styles.vazioTitulo}>
              {aba === 'seguindo' ? 'Você ainda não segue ninguém' : 'Ainda não tem nada por aqui'}
            </Text>
            <Text style={styles.vazioTexto}>
              {aba === 'seguindo'
                ? 'Toque no nome de alguém em Tudo para ver o perfil e seguir. O que essa pessoa publicar aparece aqui.'
                : 'Seja o primeiro. Toque no + lá em cima: conte o resultado do jogo, chame a galera para a pelada de domingo, mostre o gol que você fez.'}
            </Text>
          </View>
        )
      }
      onEndReached={maisUmaPagina}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        carregandoMais ? (
          <View style={styles.centro}>
            <ActivityIndicator color={colors.textMuted} />
          </View>
        ) : posts.length > 0 && acabou ? (
          <Text style={styles.fim}>Você chegou ao começo de tudo.</Text>
        ) : null
      }
    />
  );
}

function AbaBotao({
  rotulo,
  ativa,
  onPress,
}: {
  rotulo: string;
  ativa: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.aba}
      accessibilityRole="tab"
      accessibilityState={{ selected: ativa }}
      aria-selected={ativa}
    >
      <Text style={[styles.abaTexto, ativa && styles.abaTextoAtiva]}>{rotulo}</Text>
      {/* A barra embaixo fica sempre no lugar, mudando só a cor: sem isso a
          linha aparece e some, e o texto pula um pixel a cada troca. */}
      <View style={[styles.abaBarra, ativa && styles.abaBarraAtiva]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  lista: {
    paddingBottom: spacing.xxxl,
    alignSelf: 'center',
    width: '100%',
    maxWidth: LARGURA_MAXIMA_CONTEUDO,
  },
  cabecalho: { gap: spacing.md, marginBottom: spacing.lg },

  abas: { flexDirection: 'row', gap: spacing.xl },
  aba: { gap: spacing.xs, paddingTop: spacing.xs },
  abaTexto: { ...typography.bodyStrong, color: colors.textMuted },
  abaTextoAtiva: { color: colors.text },
  abaBarra: { height: 2, borderRadius: 1, backgroundColor: 'transparent' },
  abaBarraAtiva: { backgroundColor: colors.green },

  caixaDeEscrever: { gap: spacing.sm, alignItems: 'flex-start' },
  cancelar: { ...typography.caption, color: colors.textMuted, paddingVertical: spacing.xs },

  erro: { ...typography.caption, color: colors.danger },

  centro: { paddingVertical: spacing.xxl, alignItems: 'center' },

  vazio: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  vazioTitulo: { ...typography.bodyStrong, color: colors.text },
  vazioTexto: { ...typography.caption, color: colors.textMuted, lineHeight: 20 },

  fim: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
