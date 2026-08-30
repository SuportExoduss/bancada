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
import { colors, radius, spacing, typography } from '../theme';

export interface HomeScreenProps {
  perfil: Perfil;
  onSair?: () => void;
  saindo?: boolean;
}

/**
 * Início — o feed da várzea.
 *
 * Cronológico, do mais novo para o mais velho. A pendência 7 (cronológico ou
 * híbrido) segue aberta; híbrido precisa de sinais que ainda não existem —
 * seguidores, reações, histórico de leitura.
 */
export function HomeScreen({ perfil, onSair, saindo = false }: HomeScreenProps) {
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
      const pagina = await carregarFeed(recomecar ? null : cursor);
      // `recomecar` troca a lista; senão acumula. Sem essa distinção, puxar
      // para atualizar duplicaria tudo o que já estava na tela.
      setPosts((atuais) => (recomecar ? pagina.posts : [...atuais, ...pagina.posts]));
      setCursor(pagina.cursor);
      setAcabou(pagina.acabou);
    } catch (e) {
      setErro(mensagemDoErro(e));
    }
  }, [cursor]);

  useEffect(() => {
    buscar(true).finally(() => setCarregando(false));
    // Só na abertura. `buscar` muda quando o cursor muda, e depender dele aqui
    // faria a lista recarregar sozinha a cada página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <Text style={styles.vazioTitulo}>Ainda não tem nada por aqui</Text>
                <Text style={styles.vazioTexto}>
                  Seja o primeiro. Conte o resultado do jogo, chame a galera para a pelada de
                  domingo, mostre o gol que você fez.
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
  cabecalho: { gap: spacing.sm, marginBottom: spacing.lg },
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
