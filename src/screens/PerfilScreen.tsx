import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { PostDoFeed } from '../components/PostDoFeed';
import { TopBar } from '../components/TopBar';
import { LARGURA_MAXIMA_CONTEUDO } from '../hooks/useLayout';
import { perfilDe, type Perfil } from '../services/contaService';
import { mensagemDoErro } from '../services/erros';
import { postsDe, type Post } from '../services/postService';
import {
  contarSeguidores,
  contarSeguindo,
  deixarDeSeguir,
  jaSigo,
  seguir,
} from '../services/seguirService';
import { colors, radius, spacing, typography } from '../theme';

export interface PerfilScreenProps {
  /** De quem é o perfil */
  uid: string;
  /** Quem está olhando; `null` quando ninguém está logado */
  meuUid: string | null;
  onBack?: () => void;
}

/**
 * Perfil público de uma pessoa.
 *
 * Público mesmo sem conta (D-015) — a BANCADA existe para dar visibilidade, e
 * perfil que só quem tem conta enxerga não dá visibilidade a ninguém. O botão
 * de seguir é o único que exige estar logado.
 *
 * Vive em dois lugares: como **aba** (o próprio perfil, dentro da casca) e
 * como **tela empilhada** (o perfil de outra pessoa, aberto do feed). Por isso
 * não desenha fundo nem área segura — quem monta é que sabe qual dos dois é —
 * e a barra com a seta de voltar só aparece quando existe para onde voltar.
 */
export function PerfilScreen({ uid, meuUid, onBack }: PerfilScreenProps) {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [seguidores, setSeguidores] = useState(0);
  const [seguindo, setSeguindo] = useState(0);
  const [euSigo, setEuSigo] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [mudandoVinculo, setMudandoVinculo] = useState(false);
  const [erro, setErro] = useState<string | undefined>();

  const souEu = meuUid === uid;

  const buscar = useCallback(async () => {
    try {
      setErro(undefined);
      // Em paralelo: são consultas independentes, e em série a tela levaria o
      // tempo somado de todas.
      const [p, ps, nSeg, nSegdo, sigo] = await Promise.all([
        perfilDe(uid),
        postsDe(uid),
        contarSeguidores(uid),
        contarSeguindo(uid),
        meuUid && !souEu ? jaSigo(meuUid, uid) : Promise.resolve(false),
      ]);
      setPerfil(p);
      setPosts(ps);
      setSeguidores(nSeg);
      setSeguindo(nSegdo);
      setEuSigo(sigo);
    } catch (e) {
      setErro(mensagemDoErro(e));
    }
  }, [uid, meuUid, souEu]);

  useEffect(() => {
    buscar().finally(() => setCarregando(false));
  }, [buscar]);

  async function alternarVinculo() {
    if (!meuUid) return;
    // Muda na tela antes da rede: o toque precisa responder na hora. Se
    // falhar, volta ao estado anterior e o erro aparece.
    const antes = euSigo;
    setEuSigo(!antes);
    setSeguidores((n) => n + (antes ? -1 : 1));
    setMudandoVinculo(true);
    try {
      await (antes ? deixarDeSeguir(meuUid, uid) : seguir(meuUid, uid));
    } catch (e) {
      setEuSigo(antes);
      setSeguidores((n) => n + (antes ? 1 : -1));
      setErro(mensagemDoErro(e));
    } finally {
      setMudandoVinculo(false);
    }
  }

  // A barra com a seta só existe quando a tela foi empilhada. Como aba, ela
  // seria uma seta que não leva a lugar nenhum.
  const barra = onBack ? <TopBar onBack={onBack} title={perfil ? `@${perfil.apelido}` : 'Perfil'} /> : null;

  if (carregando) {
    return (
      <View style={styles.raiz}>
        {barra}
        <View style={styles.centro}>
          <ActivityIndicator color={colors.green} />
        </View>
      </View>
    );
  }

  if (!perfil) {
    return (
      <View style={styles.raiz}>
        {barra}
        <View style={styles.centro}>
          <Text style={styles.vazioTitulo}>Este perfil não existe</Text>
          <Text style={styles.vazioTexto}>
            Ou a conta foi encerrada, ou o endereço está errado.
          </Text>
        </View>
      </View>
    );
  }

  const nomeCompleto = `${perfil.nome} ${perfil.sobrenome}`;

  return (
    <View style={styles.raiz}>
      {barra}

      <FlatList
        data={posts}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.espaco} />}
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            <View style={styles.identidade}>
              <Avatar nome={nomeCompleto} apelido={perfil.apelido} tamanho={72} />
              <View style={styles.nomes}>
                <Text style={styles.nome}>{nomeCompleto}</Text>
                <Text style={styles.apelido}>@{perfil.apelido}</Text>
              </View>
            </View>

            <View style={styles.numeros}>
              <Numero
                valor={posts.length}
                rotulo={posts.length === 1 ? 'publicação' : 'publicações'}
              />
              <Numero valor={seguidores} rotulo={seguidores === 1 ? 'seguidor' : 'seguidores'} />
              <Numero valor={seguindo} rotulo="seguindo" />
            </View>

            {souEu ? (
              <Text style={styles.souEu}>Este é o seu perfil.</Text>
            ) : meuUid ? (
              <Button
                label={euSigo ? 'Seguindo' : 'Seguir'}
                variant={euSigo ? 'secondary' : 'primary'}
                onPress={alternarVinculo}
                loading={mudandoVinculo}
              />
            ) : (
              <Text style={styles.souEu}>Entre para seguir.</Text>
            )}

            {erro ? (
              <Text style={styles.erro} accessibilityRole="alert">
                {erro}
              </Text>
            ) : null}
          </View>
        }
        renderItem={({ item }) => <PostDoFeed post={item} />}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioTitulo}>
              {souEu ? 'Você ainda não publicou nada' : 'Ainda não publicou nada'}
            </Text>
            <Text style={styles.vazioTexto}>
              {souEu
                ? 'O que você publicar aparece aqui e no feed.'
                : 'Quando publicar, aparece aqui.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

function Numero({ valor, rotulo }: { valor: number; rotulo: string }) {
  return (
    <View>
      <Text style={styles.numeroValor}>{valor}</Text>
      <Text style={styles.numeroRotulo}>{rotulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1 },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  espaco: { height: spacing.md },

  lista: {
    paddingBottom: spacing.xxxl,
    alignSelf: 'center',
    width: '100%',
    maxWidth: LARGURA_MAXIMA_CONTEUDO,
  },
  cabecalho: { gap: spacing.lg, marginBottom: spacing.xl },

  identidade: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  nomes: { flex: 1, gap: 2 },
  nome: { ...typography.title, color: colors.text },
  apelido: { ...typography.bodyStrong, color: colors.green },

  numeros: { flexDirection: 'row', gap: spacing.xl },
  numeroValor: { ...typography.bodyStrong, color: colors.text },
  numeroRotulo: { ...typography.caption, color: colors.textMuted },

  souEu: { ...typography.caption, color: colors.textMuted },
  erro: { ...typography.caption, color: colors.danger },

  vazio: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  vazioTitulo: { ...typography.bodyStrong, color: colors.text, textAlign: 'center' },
  vazioTexto: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 20,
    textAlign: 'center',
  },
});
