import { Fragment } from 'react';
import { StyleSheet, Text, type TextStyle } from 'react-native';

import { colors, typography } from '../theme';

/**
 * Renderiza **negrito** e `código` dentro de um texto corrido.
 *
 * É deliberadamente pequeno: cobre o que os documentos legais usam e nada
 * mais. Trazer uma biblioteca de Markdown inteira para exibir dois documentos
 * seria pagar caro por um problema que tem este tamanho.
 */
export function TextoRico({ texto, style }: { texto: string; style?: TextStyle | TextStyle[] }) {
  // Captura os marcadores de uma vez para preservar a ordem original.
  // `**` vem ANTES de `*` na alternância: ao contrário, o negrito seria
  // consumido como itálico e sobraria um asterisco solto na tela.
  const pedacos = texto.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).filter(Boolean);

  return (
    <Text style={style}>
      {pedacos.map((pedaco, i) => {
        // Cada marcador recorre sobre o próprio miolo: é o que faz
        // `*texto com `código` dentro*` funcionar. Sem recursão o marcador de
        // dentro sobra como caractere na tela. Termina sempre, porque o miolo
        // é estritamente menor que o pedaço.
        if (pedaco.startsWith('**') && pedaco.endsWith('**')) {
          return <TextoRico key={i} texto={pedaco.slice(2, -2)} style={styles.forte} />;
        }
        if (pedaco.startsWith('*') && pedaco.endsWith('*')) {
          return <TextoRico key={i} texto={pedaco.slice(1, -1)} style={styles.italico} />;
        }
        if (pedaco.startsWith('`') && pedaco.endsWith('`')) {
          return <TextoRico key={i} texto={pedaco.slice(1, -1)} style={styles.codigo} />;
        }
        // Link em Markdown: mostra o rótulo, descarta a URL. Os documentos só
        // linkam para a ANPD, e endereço cru no meio da frase atrapalha a
        // leitura mais do que ajuda.
        return <Fragment key={i}>{pedaco.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')}</Fragment>;
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  forte: { ...typography.bodyStrong, color: colors.text },
  italico: { fontStyle: 'italic' },
  codigo: { color: colors.textMuted },
});
