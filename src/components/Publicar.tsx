import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { MENSAGENS_POST, POST_MAX, restam, validarPost } from '../domain/post';
import { Button } from './Button';
import { colors, radius, spacing, typography } from '../theme';

export interface PublicarProps {
  onPublicar: (texto: string) => Promise<void>;
  /** Primeiro nome de quem escreve, só para o convite não ser genérico */
  nome: string;
}

/**
 * Caixa de escrever no feed.
 *
 * O contador só aparece perto do limite. Contador sempre visível transforma
 * escrever num exercício de caber — e a maioria dos posts da várzea tem duas
 * linhas.
 */
export function Publicar({ onPublicar, nome }: PublicarProps) {
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | undefined>();

  const sobrando = restam(texto);
  const problema = validarPost(texto);
  // A 80 caracteres do fim: perto o bastante para avisar, longe o bastante
  // para dar tempo de cortar.
  const mostrarContador = sobrando <= 80;

  async function enviar() {
    if (problema) {
      setErro(MENSAGENS_POST[problema]);
      return;
    }
    setErro(undefined);
    setEnviando(true);
    try {
      await onPublicar(texto);
      // Só limpa depois de gravar. Limpar antes e falhar depois apagaria o
      // que a pessoa escreveu, e ela não teria como recuperar.
      setTexto('');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não deu para publicar agora.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.caixa}>
      <TextInput
        value={texto}
        onChangeText={(t) => {
          setTexto(t);
          if (erro) setErro(undefined);
        }}
        placeholder={`E aí, ${nome}? Como foi o jogo?`}
        placeholderTextColor={colors.textMuted}
        style={styles.campo}
        multiline
        // Sem `maxLength`: cortar a digitação no limite faz a pessoa achar que
        // o teclado travou. Melhor deixar passar e mostrar o contador negativo.
        textAlignVertical="top"
        accessibilityLabel="Escreva sua publicação"
        editable={!enviando}
      />

      <View style={styles.rodape}>
        {mostrarContador ? (
          <Text style={[styles.contador, sobrando < 0 && styles.contadorEstourado]}>
            {sobrando < 0 ? `${-sobrando} a mais` : `${sobrando}`}
          </Text>
        ) : (
          <View />
        )}

        <Button
          label="Publicar"
          variant="primary"
          size="medium"
          onPress={enviar}
          loading={enviando}
        />
      </View>

      {erro ? (
        <Text style={styles.erro} accessibilityRole="alert">
          {erro}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  campo: {
    ...typography.body,
    color: colors.text,
    minHeight: 80,
    maxHeight: 200,
  },
  rodape: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  contador: { ...typography.caption, color: colors.textMuted },
  contadorEstourado: { color: colors.danger },
  erro: { ...typography.caption, color: colors.danger },
});
