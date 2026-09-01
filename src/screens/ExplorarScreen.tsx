import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Avatar } from '../components/Avatar';
import { EmBreve } from '../components/EmBreve';
import { Input } from '../components/Input';
import { procurarPessoas, type PessoaEncontrada } from '../services/buscaService';
import { mensagemDoErro } from '../services/erros';
import { colors, radius, spacing, typography } from '../theme';

export interface ExplorarScreenProps {
  onAbrirPerfil?: (uid: string) => void;
  /** Para não listar a própria pessoa no resultado */
  meuUid?: string | null;
}

/** Espera antes de consultar, em milissegundos. */
const ESPERA_MS = 350;

/**
 * Os filtros do topo, na ordem da especificação.
 *
 * `pronto: false` não esconde o filtro — a fileira inteira faz parte do
 * desenho, e mostrar dois hoje e cinco daqui a três meses mudaria a cara da
 * tela na cara de quem já se acostumou. Quem toca num que não está pronto vê
 * o que vai ter e de que fase depende.
 */
const FILTROS = [
  { chave: 'perfis', rotulo: 'Perfis', pronto: true },
  { chave: 'times', rotulo: 'Times', pronto: false },
  { chave: 'rolls', rotulo: 'Rolls', pronto: false },
  { chave: 'posts', rotulo: 'Posts', pronto: false },
  { chave: 'campeonatos', rotulo: 'Campeonatos', pronto: false },
] as const;

type ChaveDeFiltro = (typeof FILTROS)[number]['chave'];

/** O que cada filtro por vir vai mostrar, e quando. */
const PROMESSAS: Record<Exclude<ChaveDeFiltro, 'perfis'>, { promessa: string; quando: string }> = {
  times: {
    promessa: 'Procurar times da sua quebrada, ver o elenco e acompanhar o que eles jogam.',
    quando: 'Chega junto com os Times',
  },
  rolls: {
    promessa: 'Os lances em vídeo — o gol, a defesa, a resenha do vestiário.',
    quando: 'Chega junto com a Mídia',
  },
  posts: {
    promessa: 'Achar publicação por assunto e por hashtag, não só por quem escreveu.',
    quando: 'Chega junto com hashtags e reações',
  },
  campeonatos: {
    promessa: 'Campeonatos abertos, tabela, classificação e próximos jogos.',
    quando: 'Chega junto com os Campeonatos',
  },
};

/**
 * Explorar — a descoberta da BANCADA.
 *
 * Substitui a lupa que ficava no topo do feed. A especificação é explícita:
 * a descoberta é uma seção da barra de baixo, não um botão do cabeçalho, e
 * ter os dois faria a mesma função existir em dois lugares.
 *
 * Hoje só o filtro **Perfis** tem o que mostrar — procura pelo começo do
 * apelido. Os outros quatro estão desenhados e desligados; o motivo está em
 * `FILTROS`.
 */
export function ExplorarScreen({ onAbrirPerfil, meuUid }: ExplorarScreenProps) {
  const [filtro, setFiltro] = useState<ChaveDeFiltro>('perfis');
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState<PessoaEncontrada[]>([]);
  const [procurando, setProcurando] = useState(false);
  const [jaProcurou, setJaProcurou] = useState(false);
  const [erro, setErro] = useState<string | undefined>();

  useEffect(() => {
    // Só o filtro de perfis consulta alguma coisa. Sem esta guarda, trocar
    // para "Times" com texto digitado dispararia uma busca de pessoas cujo
    // resultado ninguém veria — leitura cobrada e jogada fora.
    if (filtro !== 'perfis') return;

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
  }, [termo, meuUid, filtro]);

  const porVir = filtro === 'perfis' ? null : PROMESSAS[filtro];

  return (
    <View style={styles.raiz}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        // `flexGrow: 0` no proprio ScrollView: sem isso ele estica ate o fim
        // da coluna e as pilulas viram cinco colunas de tela inteira. Foi
        // exatamente o que aconteceu na primeira montagem.
        style={styles.filtrosCaixa}
        contentContainerStyle={styles.filtros}
        accessibilityRole="tablist"
      >
        {FILTROS.map((f) => {
          const ativo = f.chave === filtro;
          return (
            <Pressable
              key={f.chave}
              onPress={() => setFiltro(f.chave)}
              style={({ pressed }) => [
                styles.filtro,
                ativo && styles.filtroAtivo,
                pressed && styles.filtroPressionado,
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: ativo }}
              accessibilityLabel={f.pronto ? f.rotulo : `${f.rotulo}, ainda não disponível`}
            >
              <Text style={[styles.filtroTexto, ativo && styles.filtroTextoAtivo]}>
                {f.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {porVir ? (
        <EmBreve
          icone="explorar"
          titulo={FILTROS.find((f) => f.chave === filtro)!.rotulo}
          promessa={porVir.promessa}
          quando={porVir.quando}
        />
      ) : (
        <View style={styles.coluna}>
          <Input
            label="Apelido"
            value={termo}
            onChangeText={setTermo}
            placeholder="lucas_rocha"
            autoCapitalize="none"
            autoCorrect={false}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: { flex: 1 },

  filtrosCaixa: { flexGrow: 0, flexShrink: 0 },
  filtros: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  filtro: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  // Selecionado é o verde da marca em fundo translúcido, não em fundo cheio.
  // A especificação pede filtro discreto; verde chapado em cinco pílulas
  // lado a lado transformaria a fileira no elemento mais forte da tela.
  filtroAtivo: { borderColor: colors.green, backgroundColor: colors.greenSoft },
  filtroPressionado: { opacity: 0.7 },
  filtroTexto: { ...typography.caption, color: colors.textMuted, fontWeight: '600' },
  filtroTextoAtivo: { color: colors.green },

  coluna: { flex: 1, gap: spacing.lg, paddingTop: spacing.sm },
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
