import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fundo } from '../components/Fundo';
import { Button } from '../components/Button';
import { TopBar } from '../components/TopBar';
import { LARGURA_MAXIMA_CONTEUDO, useLayout } from '../hooks/useLayout';
import { colors, radius, spacing, typography } from '../theme';

export interface GuardianFirstScreenProps {
  onBack?: () => void;
  onEntrar?: () => void;
  onCriarMinhaConta?: () => void;
}

/**
 * "Primeiro, a sua conta" — explica por que a conta do menor não começa aqui.
 *
 * A conta do menor **nasce da conta do responsável** e fica vinculada a ela.
 * Sem a conta do responsável não existe a que vincular, então esta tela é
 * inevitável — e é melhor explicar o motivo do que apenas barrar.
 *
 * Ela também é onde a promessa da supervisão é dita antes de qualquer dado ser
 * pedido: o responsável fica sabendo o que vai poder ver **e o que não vai**,
 * antes de decidir.
 */
export function GuardianFirstScreen({
  onBack,
  onEntrar,
  onCriarMinhaConta,
}: GuardianFirstScreenProps) {
  const { isShortHeight } = useLayout();

  return (
    <Fundo variante="auth">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.black} />

        <TopBar onBack={onBack} />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.coluna}>
            <View style={styles.cabecalho}>
              <Text style={styles.titulo}>Primeiro, a sua conta</Text>
              <Text style={styles.subtitulo}>
                A conta do seu filho fica ligada à sua. Por isso a sua precisa existir antes — é
                ela que vai acompanhar.
              </Text>
            </View>

            {isShortHeight ? null : (
              <View style={styles.promessa}>
                <Text style={styles.promessaTitulo}>O que você vai poder fazer</Text>
                <Item texto="Ver com quem seu filho conversa e bloquear qualquer contato" />
                <Item texto="Escolher quem pode segui-lo e mandar mensagem" />
                <Item texto="Bloquear conteúdos e assuntos" />
                <Item texto="Definir limite de tempo de uso" />
                <Item texto="Receber aviso de qualquer denúncia envolvendo ele" />

                <Text style={[styles.promessaTitulo, styles.promessaTituloSegundo]}>
                  O que você não vai fazer
                </Text>
                <Item texto="Ler o conteúdo das mensagens dele" negativo />

                <Text style={styles.explicacao}>
                  Alertas de risco chegam até você, e em caso de perigo concreto existe um pedido de
                  acesso — que fica registrado e visível para ele. Uma conta lida por inteiro tira da
                  criança o canal por onde ela pediria ajuda, e é justamente ali que um pedido de
                  socorro costuma sair.
                </Text>
                <Text style={styles.explicacao}>
                  Ele sempre vai saber o que você enxerga. Sem acompanhamento escondido.
                </Text>
              </View>
            )}

            <View style={styles.acoes}>
              <Button label="Já tenho conta" variant="primary" onPress={onEntrar} />
              <Button label="Criar minha conta" variant="secondary" onPress={onCriarMinhaConta} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fundo>
  );
}

function Item({ texto, negativo = false }: { texto: string; negativo?: boolean }) {
  return (
    <View style={styles.item}>
      <Text style={[styles.marcador, negativo && styles.marcadorNegativo]}>
        {negativo ? '×' : '✓'}
      </Text>
      <Text style={styles.itemTexto}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Transparente: quem pinta o fundo agora e o <Fundo>.
  safe: { flex: 1, backgroundColor: 'transparent' },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  coluna: { width: '100%', maxWidth: LARGURA_MAXIMA_CONTEUDO, gap: spacing.xl },

  cabecalho: { gap: spacing.xs },
  titulo: { ...typography.title, color: colors.text },
  subtitulo: { ...typography.body, color: colors.textOverPhoto },

  promessa: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  promessaTitulo: { ...typography.bodyStrong, color: colors.text },
  promessaTituloSegundo: { marginTop: spacing.md },

  item: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  marcador: { ...typography.body, color: colors.green, width: 16 },
  marcadorNegativo: { color: colors.textMuted },
  itemTexto: { ...typography.caption, color: colors.textMuted, lineHeight: 20, flex: 1 },

  explicacao: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: spacing.sm,
  },

  acoes: { gap: spacing.md },
});
