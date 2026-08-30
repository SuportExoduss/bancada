import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Post } from '../services/postService';
import { colors, radius, spacing, typography } from '../theme';

export interface PostDoFeedProps {
  post: Post;
  /** Passado só quando quem lê é o autor */
  onApagar?: () => void;
}

/**
 * Quanto tempo faz, em português de conversa.
 *
 * "há 3 h" é mais útil que a data completa para o que domina o feed: jogo de
 * ontem, gol de agora. A data cheia só aparece depois de uma semana, quando
 * "há 9 dias" deixa de ajudar.
 */
export function quandoFoi(data: Date | null, agora = new Date()): string {
  // `null` no instante entre gravar e o servidor carimbar a hora.
  if (!data) return 'agora';

  const segundos = Math.floor((agora.getTime() - data.getTime()) / 1000);
  if (segundos < 60) return 'agora';

  const minutos = Math.floor(segundos / 60);
  if (minutos < 60) return `há ${minutos} min`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas} h`;

  const dias = Math.floor(horas / 24);
  if (dias === 1) return 'ontem';
  if (dias < 7) return `há ${dias} dias`;

  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export function PostDoFeed({ post, onApagar }: PostDoFeedProps) {
  return (
    <View style={styles.cartao}>
      <View style={styles.cabecalho}>
        <View style={styles.identidade}>
          <Text style={styles.apelido}>@{post.autorApelido}</Text>
          <Text style={styles.nome} numberOfLines={1}>
            {post.autorNome}
          </Text>
        </View>

        <View style={styles.direita}>
          <Text style={styles.quando}>{quandoFoi(post.criadoEm)}</Text>
          {onApagar ? (
            <Pressable
              onPress={onApagar}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Apagar esta publicação"
            >
              <Text style={styles.apagar}>Apagar</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <Text style={styles.texto}>{post.texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  identidade: { flex: 1, gap: 2 },
  apelido: { ...typography.bodyStrong, color: colors.green },
  nome: { ...typography.caption, color: colors.textMuted },
  direita: { alignItems: 'flex-end', gap: spacing.xs },
  quando: { ...typography.caption, color: colors.textMuted },
  apagar: { ...typography.caption, color: colors.danger },
  // `lineHeight` folgado: post de várzea tem parágrafo, não frase solta.
  texto: { ...typography.body, color: colors.text, lineHeight: 23 },
});
