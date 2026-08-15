import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TextoRico } from '../components/TextoRico';
import { TopBar } from '../components/TopBar';
import { documentosLegais, type Bloco, type ChaveDocumento } from '../content/documentosLegais';
import { LARGURA_MAXIMA_CONTEUDO } from '../hooks/useLayout';
import { colors, radius, spacing, typography } from '../theme';

export interface LegalDocumentScreenProps {
  documento: ChaveDocumento;
  onBack?: () => void;
}

/**
 * Exibe os Termos de Uso e a Política de Privacidade dentro do app.
 *
 * **Isto não é conforto de interface, é requisito de validade.** O art. 46 do
 * CDC diz que o consumidor não se vincula a contrato cujo conteúdo não teve
 * oportunidade de conhecer. Termo atrás de um link que não abre é termo que
 * não vale — e aí a plataforma fica sem contrato, não o usuário.
 *
 * O conteúdo vem de `docs/12-legal/*.md` pelo gerador, para não existir uma
 * segunda cópia do texto jurídico que possa divergir da primeira.
 */
export function LegalDocumentScreen({ documento, onBack }: LegalDocumentScreenProps) {
  const { titulo, blocos, rascunho } = documentosLegais[documento];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />

      <TopBar onBack={onBack} title={titulo} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={true}
        accessibilityLabel={titulo}
      >
        <View style={styles.coluna}>
          {/* Enquanto o texto tiver lacuna, quem lê precisa saber. Exibir um
              documento incompleto como se fosse final é pior que não exibir:
              a pessoa sai achando que leu o contrato inteiro. */}
          {rascunho ? (
            <View style={styles.rascunho} accessibilityRole="alert">
              <Text style={styles.rascunhoTexto}>
                Este texto ainda é um rascunho e não está em vigor. Alguns trechos estão marcados
                como <Text style={styles.rascunhoForte}>[A DEFINIR]</Text> porque dependem de dados
                que ainda não existem.
              </Text>
            </View>
          ) : null}

          {blocos.map((bloco, i) => (
            <BlocoRenderizado key={i} bloco={bloco} />
          ))}

          <Text style={styles.rodape}>
            Ficou com dúvida sobre alguma parte? Fale com a gente — respondemos.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BlocoRenderizado({ bloco }: { bloco: Bloco }) {
  switch (bloco.t) {
    case 'h1':
      return <TextoRico texto={bloco.x} style={styles.h1} />;
    case 'h2':
      return <TextoRico texto={bloco.x} style={styles.h2} />;
    case 'h3':
      return <TextoRico texto={bloco.x} style={styles.h3} />;
    case 'h4':
      return <TextoRico texto={bloco.x} style={styles.h4} />;

    case 'p':
      return <TextoRico texto={bloco.x} style={styles.p} />;

    case 'li':
      return (
        <View style={styles.item}>
          <Text style={styles.marcador}>•</Text>
          <TextoRico texto={bloco.x} style={styles.itemTexto} />
        </View>
      );

    case 'hr':
      return <View style={styles.regua} />;

    // As cláusulas que limitam direito do consumidor precisam de destaque
    // visual — CDC art. 54, §4º. Não é decoração: sem destaque, a cláusula
    // pode ser considerada não escrita.
    case 'destaque':
      return (
        <View style={styles.destaque}>
          {bloco.linhas
            .filter((l) => l !== '')
            .map((linha, i) => (
              <TextoRico key={i} texto={linha} style={styles.destaqueTexto} />
            ))}
        </View>
      );

    // Tabela em tela de celular vira pilha: cada linha é um bloco, com o
    // primeiro campo servindo de título. Tentar manter colunas em 320px de
    // largura produz texto ilegível de tão espremido.
    case 'cabecalho':
      return null;

    case 'linha':
      return (
        <View style={styles.linhaTabela}>
          <TextoRico texto={bloco.c[0] ?? ''} style={styles.linhaTitulo} />
          {bloco.c.slice(1).map((celula, i) => (
            <TextoRico key={i} texto={celula} style={styles.linhaValor} />
          ))}
        </View>
      );
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.black },
  scroll: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  coluna: { width: '100%', maxWidth: LARGURA_MAXIMA_CONTEUDO },

  h1: { ...typography.title, color: colors.text, marginTop: spacing.xl, marginBottom: spacing.sm },
  h2: {
    ...typography.subtitle,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  h3: {
    ...typography.bodyStrong,
    color: colors.green,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  h4: { ...typography.bodyStrong, color: colors.text, marginTop: spacing.md },

  // `lineHeight` generoso: são textos longos lidos em tela pequena, e linha
  // apertada é o que faz a pessoa desistir na metade.
  p: { ...typography.body, color: colors.textMuted, lineHeight: 23, marginBottom: spacing.md },

  item: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm, paddingRight: spacing.sm },
  marcador: { ...typography.body, color: colors.green },
  itemTexto: { ...typography.body, color: colors.textMuted, lineHeight: 23, flex: 1 },

  regua: { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },

  destaque: {
    backgroundColor: colors.surface,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  destaqueTexto: { ...typography.body, color: colors.text, lineHeight: 23 },

  linhaTabela: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  linhaTitulo: { ...typography.bodyStrong, color: colors.text },
  linhaValor: { ...typography.caption, color: colors.textMuted, lineHeight: 20 },

  rascunho: {
    backgroundColor: 'rgba(245, 165, 36, 0.12)',
    borderColor: colors.warning,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  rascunhoTexto: { ...typography.caption, color: colors.warning, lineHeight: 20 },
  rascunhoForte: { fontWeight: '700' },

  rodape: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
