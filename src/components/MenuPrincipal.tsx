import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, MIN_TOUCH, radius, spacing, typography } from '../theme';

/** O que o menu sabe fazer. Cada campo é um destino que já existe. */
export interface MenuPrincipalProps {
  aberto: boolean;
  onFechar: () => void;
  onMeuPerfil: () => void;
  onTermos: () => void;
  onPrivacidade: () => void;
  onSair: () => void;
  saindo?: boolean;
}

/**
 * Item que ainda não tem para onde levar.
 *
 * Aparece apagado, com o motivo escrito. **Não é decoração**: a especificação
 * pede Campeonatos, Lives e Calendário no menu, e as três dependem de fases
 * que nem começaram. Mostrar um item que abre uma tela vazia seria pior; e
 * escondê-los deixaria o menu parecendo completo quando não está.
 *
 * A frase entre parênteses é o contrato com quem testa: se ele tocar e nada
 * abrir, ele já sabe por quê antes de tocar.
 */
const AINDA_NAO: readonly { rotulo: string; porque: string }[] = [
  { rotulo: 'Campeonatos', porque: 'chega na Fase 8' },
  { rotulo: 'Lives', porque: 'chega na Fase 11' },
  { rotulo: 'Calendário', porque: 'depende dos jogos, Fase 6' },
] as const;

/**
 * Menu principal, aberto pelo hambúrguer.
 *
 * Entra pela direita porque é de lá que o botão vem — gaveta que abre do lado
 * oposto ao toque desliga a relação entre o gesto e o resultado.
 *
 * O `Sair` fica aqui, e não mais no topo do feed. Sair é uma ação rara e
 * definitiva; deixá-la a um toque de distância, ao lado das ações do dia a
 * dia, é convite para o acidente.
 */
export function MenuPrincipal({
  aberto,
  onFechar,
  onMeuPerfil,
  onTermos,
  onPrivacidade,
  onSair,
  saindo = false,
}: MenuPrincipalProps) {
  return (
    <Modal
      visible={aberto}
      // `fade` e nao `slide`. Duas razoes, e a segunda so apareceu testando:
      //
      // 1. o `slide` do React Native entra por BAIXO, e esta gaveta entra
      //    pela direita -- a animacao brigaria com o desenho;
      // 2. no react-native-web ele deixou o modal inteiro travado em
      //    `translateY(100%)`: o menu abria 812 pontos abaixo do topo, fora
      //    da tela, e o botao Fechar ficava inalcancavel.
      animationType="fade"
      transparent
      onRequestClose={onFechar}
      // Android: o botão físico de voltar fecha o menu. Sem isto ele fecharia
      // o app inteiro com o menu aberto.
      statusBarTranslucent
    >
      {/* Tocar fora fecha. É o que todo mundo tenta primeiro. */}
      <Pressable style={styles.veu} onPress={onFechar} accessibilityLabel="Fechar o menu" />

      <SafeAreaView style={styles.gaveta} edges={['top', 'bottom', 'right']}>
        <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
          <View style={styles.cabecalho}>
            <Text style={styles.titulo}>Menu</Text>
            <Pressable
              onPress={onFechar}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
            >
              <Text style={styles.fechar}>Fechar</Text>
            </Pressable>
          </View>

          <ItemDoMenu rotulo="Meu perfil" onPress={onMeuPerfil} />

          <View style={styles.separador} />

          {AINDA_NAO.map((item) => (
            <ItemDoMenu key={item.rotulo} rotulo={item.rotulo} porvir={item.porque} />
          ))}

          <View style={styles.separador} />

          <ItemDoMenu rotulo="Termos de Uso" onPress={onTermos} />
          <ItemDoMenu rotulo="Política de Privacidade" onPress={onPrivacidade} />

          <View style={styles.separador} />

          <ItemDoMenu rotulo={saindo ? 'Saindo…' : 'Sair da conta'} onPress={onSair} perigo />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function ItemDoMenu({
  rotulo,
  onPress,
  porvir,
  perigo = false,
}: {
  rotulo: string;
  onPress?: () => void;
  /** Motivo de ainda não abrir nada. Deixa o item apagado e sem toque. */
  porvir?: string;
  perigo?: boolean;
}) {
  const desligado = porvir !== undefined;

  return (
    <Pressable
      onPress={desligado ? undefined : onPress}
      disabled={desligado}
      style={({ pressed }) => [styles.item, pressed && !desligado && styles.itemPressionado]}
      accessibilityRole="button"
      accessibilityState={{ disabled: desligado }}
      accessibilityLabel={desligado ? `${rotulo}, ${porvir}` : rotulo}
    >
      <Text
        style={[
          styles.itemTexto,
          desligado && styles.itemApagado,
          perigo && styles.itemPerigo,
        ]}
      >
        {rotulo}
      </Text>
      {porvir ? <Text style={styles.porvir}>{porvir}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  veu: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  gaveta: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    // Larga o bastante para os rótulos, estreita o bastante para o feed
    // continuar visível atrás — quem abre o menu não saiu de onde estava.
    width: '78%',
    maxWidth: 320,
    backgroundColor: colors.surface,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: colors.border,
  },
  conteudo: { padding: spacing.lg, gap: 2 },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
  },
  titulo: { ...typography.subtitle, color: colors.text },
  fechar: { ...typography.caption, color: colors.textMuted },

  item: {
    minHeight: MIN_TOUCH,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    gap: 2,
  },
  itemPressionado: { backgroundColor: colors.surfaceHigh },
  itemTexto: { ...typography.body, color: colors.text },
  itemApagado: { color: colors.textMuted },
  itemPerigo: { color: colors.danger },
  porvir: { ...typography.caption, fontSize: 11, color: colors.textMuted, opacity: 0.75 },

  separador: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
});
