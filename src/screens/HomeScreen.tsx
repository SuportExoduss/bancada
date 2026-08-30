import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { QueryDocumentSnapshot } from 'firebase/firestore';

import { Fundo } from '../components/Fundo';
import { PostDoFeed } from '../components/PostDoFeed';
import { Publicar } from '../components/Publicar';
import { LARGURA_MAXIMA_CONTEUDO } from '../hooks/useLayout';
import type { Perfil } from '../services/contaService';
import { mensagemDoErro } from '../services/erros';
import { apagarPost, carregarFeed, publicar, type Post } from '../services/postService';
import { feedDeQuemSigo } from '../services/seguirService';
import { colors, radius, spacing, typography } from '../theme';

export interface HomeScreenProps {
  perfil: Perfil;
  onSair?: () => void;
  saindo?: boolean;
  onAbrirPerfil?: (uid: string) => void;
}

/**
 * As abas do feed.
 *
 * Vêm dos mockups (D-032), que reformularam a pendência 7: não é
 * "cronológico OU híbrido", são superfícies diferentes. TUDO é descoberta,
 * SEGUINDO é a turma da pessoa.
 *
 * COMUNIDADES e TRENDING existem no desenho e ainda não têm o que mostrar --
 * entram quando houver comunidade e sinal de engajamento.
 */
type Aba = 'tudo' | 'seguindo';

/**
 * Início — o feed da várzea.
 *
 * Cronológico, do mais novo para o mais velho. A pendência 7 (cronológico ou
 * híbrido) segue aberta; híbrido precisa de sinais que ainda não existem —
 * seguidores, reações, histórico de leitura.
 */
export function HomeScreen({ perfil, onSair, saindo = false, onAbrirPerfil }: HomeScreenProps) {
  const [aba, setAba] = useState<Aba>('tudo');
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot | null>(null);
  const [acabou, setAcabou] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState<string | undefined>();

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
    setCarregando(true);
    setPosts([]);
    buscar(true).finally(() => setCarregando(false));
    // Depende só da ABA, não de `buscar`: `buscar` muda quando o cursor muda, e
    // depender dele aqui faria a lista recarregar sozinha a cada página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aba]);

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
    // Recarrega do começo em vez de inserir na mão: o carimbo de hora vem do
    // servidor, e montar o post localmente mostraria uma hora que pode não ser
    // a que ficou gravada.
    await buscar(true);
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
    <Fundo variante="app">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.black} />

        <View style={styles.barra}>
          <View>
            <Text style={styles.saudacao}>Oi, {perfil.nome}</Text>
            <Text style={styles.apelido}>@{perfil.apelido}</Text>
          </View>
          <Pressable
            onPress={onSair}
            disabled={saindo}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Sair da conta"
          >
            <Text style={styles.sair}>{saindo ? 'Saindo…' : 'Sair'}</Text>
          </Pressable>
        </View>

        <FlatList
          data={posts}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.lista}
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
              <View style={styles.abas}>
                <AbaBotao rotulo="Tudo" ativa={aba === 'tudo'} onPress={() => setAba('tudo')} />
                <AbaBotao
                  rotulo="Seguindo"
                  ativa={aba === 'seguindo'}
                  onPress={() => setAba('seguindo')}
                />
              </View>

              <Publicar onPublicar={enviarPost} nome={perfil.nome} />
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
                  {aba === 'seguindo'
                    ? 'Você ainda não segue ninguém'
                    : 'Ainda não tem nada por aqui'}
                </Text>
                <Text style={styles.vazioTexto}>
                  {aba === 'seguindo'
                    ? 'Toque no nome de alguém em Tudo para ver o perfil e seguir. O que essa pessoa publicar aparece aqui.'
                    : 'Seja o primeiro. Conte o resultado do jogo, chame a galera para a pelada de domingo, mostre o gol que você fez.'}
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
      </SafeAreaView>
    </Fundo>
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
  safe: { flex: 1, backgroundColor: 'transparent' },

  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  saudacao: { ...typography.bodyStrong, color: colors.text },
  apelido: { ...typography.caption, color: colors.green },
  sair: { ...typography.caption, color: colors.textMuted },

  lista: {
    paddingHorizontal: spacing.xl,
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
