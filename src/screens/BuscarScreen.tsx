import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '../components/Avatar';
import { Fundo } from '../components/Fundo';
import { Input } from '../components/Input';
import { TopBar } from '../components/TopBar';
import { LARGURA_MAXIMA_CONTEUDO } from '../hooks/useLayout';
import { procurarPessoas, type PessoaEncontrada } from '../services/buscaService';
import { mensagemDoErro } from '../services/erros';
import { colors, radius, spacing, typography } from '../theme';

export interface BuscarScreenProps {
  onBack?: () => void;
  onAbrirPerfil?: (uid: string) => void;
  /** Para não listar a própria pessoa no resultado */
  meuUid?: string | null;
}

/** Espera antes de consultar, em milissegundos. */
const ESPERA_MS = 350;

/**
 * Procurar pessoas pelo apelido.
 *
 * Existe porque "seguir" abriu um buraco: até agora só dava para achar alguém
 * pelo post dela no feed, e quem não publica era invisível.
 *
 * A busca é **por prefixo** — `rob` acha `roberth`, mas `berth` não acha. O
 * porquê está em `buscaService`; aqui a tela só diz isso à pessoa quando não
 * encontra nada, em vez de deixá-la achando que a outra não tem conta.
 */
export function BuscarScreen({ onBack, onAbrirPerfil, meuUid }: BuscarScreenProps) {
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState<PessoaEncontrada[]>([]);
  const [procurando, setProcurando] = useState(false);
  const [jaProcurou, setJaProcurou] = useState(false);
  const [erro, setErro] = useState<string | undefined>();

  useEffect(() => {
    const limpo = termo.trim();
    if (limpo.length < 2) {
      setResultados([]);
      setJaProcurou(false);
      return;
    }

    setProcurando(true);
    // Espera antes de consultar: sem isso, "roberth" dispara sete consultas —
    // uma por letra — e cada resultado é uma leitura cobrada.
    const temporizador = setTimeout(async () => {
      try {
        setErro(undefined);
        const achados = await procurarPessoas(limpo);
        setResultados(achados.filter((p) => p.uid !== meuUid));
        setJaProcurou(true);
      } catch (e) {
        setErro(mensagemDoErro(e));
      } finally {
        setProcurando(false);
      }
    }, ESPERA_MS);

    return () => clearTimeout(temporizador);
  }, [termo, meuUid]);

  return (
    <Fundo variante="app">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.black} />
        <TopBar onBack={onBack} title="Procurar" />

        <View style={styles.coluna}>
          <Input
            label="Apelido"
            value={termo}
            onChangeText={setTermo}
            placeholder="lucas_rocha"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            hint="Procura pelo começo do apelido"
            accessibilityLabel="Procurar pessoa pelo apelido"
          />

          {erro ? (
            <Text style={styles.erro} accessibilityRole="alert">
              {erro}
            </Text>
          ) : null}

          <FlatList
            data={resultados}
            keyExtractor={(p) => p.uid}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.lista}
            ItemSeparatorComponent={() => <View style={styles.espaco} />}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onAbrirPerfil?.(item.uid)}
                style={({ pressed }) => [styles.pessoa, pressed && styles.pessoaPressionada]}
                accessibilityRole="button"
                accessibilityLabel={`Ver o perfil de ${item.apelido}`}
              >
                <Avatar
                  nome={`${item.nome} ${item.sobrenome}`}
                  apelido={item.apelido}
                  tamanho={44}
                />
                <View style={styles.nomes}>
                  <Text style={styles.apelido}>@{item.apelido}</Text>
                  <Text style={styles.nome} numberOfLines={1}>
                    {item.nome} {item.sobrenome}
                  </Text>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              procurando ? (
                <View style={styles.centro}>
                  <ActivityIndicator color={colors.green} />
                </View>
              ) : jaProcurou ? (
                <View style={styles.aviso}>
                  <Text style={styles.avisoTitulo}>Ninguém com esse começo de apelido</Text>
                  <Text style={styles.avisoTexto}>
                    A procura é pelo <Text style={styles.avisoForte}>começo</Text> do apelido:
                    digitar “rob” acha “roberth”, mas “berth” não acha. Tente as primeiras letras.
                  </Text>
                </View>
              ) : (
                <View style={styles.aviso}>
                  <Text style={styles.avisoTitulo}>Digite pelo menos duas letras</Text>
                  <Text style={styles.avisoTexto}>
                    Procure pelo apelido de quem você quer achar — o mesmo que aparece com @ nas
                    publicações.
                  </Text>
                </View>
              )
            }
          />
        </View>
      </SafeAreaView>
    </Fundo>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  coluna: {
    flex: 1,
    width: '100%',
    maxWidth: LARGURA_MAXIMA_CONTEUDO,
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  espaco: { height: spacing.sm },
  lista: { paddingBottom: spacing.xxl },
  centro: { paddingVertical: spacing.xxl, alignItems: 'center' },

  pessoa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  pessoaPressionada: { backgroundColor: colors.surfaceHigh },
  nomes: { flex: 1, gap: 2 },
  apelido: { ...typography.bodyStrong, color: colors.green },
  nome: { ...typography.caption, color: colors.textMuted },

  aviso: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  avisoTitulo: { ...typography.bodyStrong, color: colors.text },
  avisoTexto: { ...typography.caption, color: colors.textMuted, lineHeight: 20 },
  avisoForte: { fontWeight: '700' },

  erro: { ...typography.caption, color: colors.danger },
});
