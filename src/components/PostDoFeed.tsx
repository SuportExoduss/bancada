import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from './Avatar';
import type { Post } from '../services/postService';
import { colors, radius, spacing, typography } from '../theme';

export interface PostDoFeedProps {
  post: Post;
  /** Passado só quando quem lê é o autor */
  onApagar?: () => void;
  /** Abre o perfil de quem publicou */
  onAbrirAutor?: () => void;
  /**
   * Passado só quando faz sentido oferecer: quem lê está logado, não é o
   * autor, e ainda não segue. Nos outros casos o botão não aparece.
   */
  onSeguir?: () => void;
  seguindoAgora?: boolean;
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

export function PostDoFeed({
  post,
  onApagar,
  onAbrirAutor,
  onSeguir,
  seguindoAgora = false,
}: PostDoFeedProps) {
  return (
    <View style={styles.cartao}>
      <View style={styles.cabecalho}>
        {/* O bloco inteiro do autor é tocável, não só o @: alvo de toque de
            uma linha de texto é pequeno demais para o dedo. */}
        <Pressable
          onPress={onAbrirAutor}
          disabled={!onAbrirAutor}
          style={styles.identidade}
          accessibilityRole={onAbrirAutor ? 'button' : undefined}
          accessibilityLabel={onAbrirAutor ? `Ver o perfil de ${post.autorApelido}` : undefined}
        >
          <Avatar nome={post.autorNome} apelido={post.autorApelido} tamanho={40} />
          <View style={styles.nomes}>
            <Text style={styles.apelido}>@{post.autorApelido}</Text>
            <Text style={styles.nome} numberOfLines={1}>
              {post.autorNome}
            </Text>
          </View>
        </Pressable>

        <View style={styles.direita}>
          <Text style={styles.quando}>{quandoFoi(post.criadoEm)}</Text>

          {/* Seguir aqui, e não só no perfil: quem acabou de ler um post bom é
              quem mais quer seguir aquela pessoa, e obrigar a abrir o perfil
              para isso é atrito no momento exato em que a vontade existe.
              Some depois de seguir, como no Instagram -- botão que não faz
              mais nada só ocupa espaço. */}
          {onSeguir ? (
            <Pressable
              onPress={onSeguir}
              disabled={seguindoAgora}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={`Seguir ${post.autorApelido}`}
            >
              <Text style={[styles.seguir, seguindoAgora && styles.seguirOcupado]}>
                {seguindoAgora ? 'Seguindo…' : 'Seguir'}
              </Text>
            </Pressable>
          ) : null}

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
  identidade: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  nomes: { flex: 1, gap: 2 },
  apelido: { ...typography.bodyStrong, color: colors.green },
  nome: { ...typography.caption, color: colors.textMuted },
  direita: { alignItems: 'flex-end', gap: spacing.xs },
  quando: { ...typography.caption, color: colors.textMuted },
  apagar: { ...typography.caption, color: colors.danger },
  // Spread ANTES do fontWeight: ao contrário, typography.caption apagaria o
  // peso logo abaixo dele.
  seguir: { ...typography.caption, color: colors.green, fontWeight: '600' },
  seguirOcupado: { color: colors.textMuted },
  // `lineHeight` folgado: post de várzea tem parágrafo, não frase solta.
  texto: { ...typography.body, color: colors.text, lineHeight: 23 },
});
