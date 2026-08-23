import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../components/Button';
import { Fundo } from '../components/Fundo';
import { LARGURA_MAXIMA_CONTEUDO } from '../hooks/useLayout';
import type { Perfil } from '../services/contaService';
import { colors, radius, spacing, typography } from '../theme';

export interface HomeScreenProps {
  perfil: Perfil;
  onSair?: () => void;
  saindo?: boolean;
}

/**
 * Início — **provisória**.
 *
 * Existe porque sem ela o login não tinha para onde levar: quem entrava caía
 * na tela de "Conta criada", que mentia para quem só estava voltando. E sem um
 * destino de pessoa logada não havia como verificar que a sessão sobrevive ao
 * fechar o app.
 *
 * É o lugar do Feed (Fase 3). Até lá, mostra quem está logado e deixa sair —
 * o mínimo para o fluxo de conta fazer sentido de ponta a ponta.
 */
export function HomeScreen({ perfil, onSair, saindo = false }: HomeScreenProps) {
  return (
    <Fundo variante="app">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.black} />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.coluna}>
            <View style={styles.cabecalho}>
              <Text style={styles.saudacao}>Oi, {perfil.nome}</Text>
              <Text style={styles.apelido}>@{perfil.apelido}</Text>
            </View>

            <View style={styles.aviso}>
              <Text style={styles.avisoTitulo}>Esta tela é provisória</Text>
              <Text style={styles.avisoTexto}>
                Aqui vai ficar o feed da várzea: os jogos dos seus times, os gols da rodada e o que
                a sua turma está postando. Por enquanto ela só confirma que você entrou.
              </Text>
            </View>

            <View style={styles.dados}>
              <Linha rotulo="Nome" valor={`${perfil.nome} ${perfil.sobrenome}`} />
              <Linha rotulo="Apelido" valor={`@${perfil.apelido}`} />
              <Linha rotulo="Nascimento" valor={perfil.nascimento} />
              {perfil.responsavelUid ? (
                <Linha rotulo="Conta acompanhada por" valor="seu responsável" />
              ) : null}
            </View>

            <Button label="Sair" variant="secondary" onPress={onSair} loading={saindo} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fundo>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.linhaRotulo}>{rotulo}</Text>
      <Text style={styles.linhaValor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  coluna: { width: '100%', maxWidth: LARGURA_MAXIMA_CONTEUDO, gap: spacing.xl },

  cabecalho: { gap: spacing.xs },
  saudacao: { ...typography.title, color: colors.text },
  apelido: { ...typography.bodyStrong, color: colors.green },

  aviso: {
    backgroundColor: colors.greenSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  avisoTitulo: { ...typography.bodyStrong, color: colors.text },
  avisoTexto: { ...typography.caption, color: colors.textOverPhoto, lineHeight: 20 },

  dados: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  linha: { gap: 2 },
  linhaRotulo: { ...typography.caption, color: colors.textMuted },
  linhaValor: { ...typography.body, color: colors.text },
});
