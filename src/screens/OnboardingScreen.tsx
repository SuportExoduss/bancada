import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import {
  APELIDO_MAX,
  MENSAGENS_PERFIL,
  apelidoParaExibicao,
  chaveDoApelido,
  sugerirApelidos,
  validarApelido,
  validarNome,
} from '../domain/profile';
import { useApelidoDisponivel, type EstadoApelido } from '../hooks/useApelidoDisponivel';
import { LARGURA_MAXIMA_CONTEUDO, useLayout } from '../hooks/useLayout';
import type { ApelidoRepository } from '../repositories/ApelidoRepository';
import { colors, radius, spacing, typography } from '../theme';

export interface OnboardingScreenProps {
  repositorioApelido: ApelidoRepository;
  onSubmit?: (dados: {
    nome: string;
    sobrenome: string;
    /** Como a pessoa escreveu — vai para o perfil */
    apelido: string;
    /** Minúscula — é o ID em apelidos/{chave} e garante a unicidade */
    apelidoChave: string;
  }) => void;
  loading?: boolean;
  serverError?: string;
}

/**
 * Segunda tela do primeiro acesso: quem é você na BANCADA.
 *
 * O apelido é a identidade pública (D-014) e é **único** (D-017). Por isso a
 * disponibilidade é conferida enquanto a pessoa digita — descobrir que o
 * apelido está tomado só depois de preencher tudo é o tipo de atrito que faz
 * gente desistir no último passo.
 */
export function OnboardingScreen({
  repositorioApelido,
  onSubmit,
  loading = false,
  serverError,
}: OnboardingScreenProps) {
  const { isShortHeight, isCompactWidth } = useLayout();

  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [apelido, setApelido] = useState('');
  const [tentou, setTentou] = useState(false);

  const estadoApelido = useApelidoDisponivel(apelido, repositorioApelido);

  const erros = useMemo(
    () => ({
      nome: validarNome(nome),
      sobrenome: validarNome(sobrenome),
      apelido: validarApelido(apelido),
    }),
    [nome, sobrenome, apelido],
  );

  const sugestoes = useMemo(
    () => (apelido.length === 0 ? sugerirApelidos(nome, sobrenome) : []),
    [nome, sobrenome, apelido],
  );

  const valido =
    !erros.nome && !erros.sobrenome && !erros.apelido && estadoApelido.situacao === 'disponivel';

  function enviar() {
    setTentou(true);
    if (!valido || loading) return;
    onSubmit?.({
      nome: nome.trim(),
      sobrenome: sobrenome.trim(),
      // Guarda as duas formas: a exibicao preserva as maiusculas que a
      // pessoa escolheu; a chave e o que garante a unicidade.
      apelido: apelidoParaExibicao(apelido),
      apelidoChave: chaveDoApelido(apelido),
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.column}>
            <View style={styles.header}>
              <Text style={styles.title}>Quem é você na várzea?</Text>
              <Text style={styles.subtitle}>
                Seu apelido é como as pessoas vão te achar. Escolha com carinho — dá para
                trocar depois, mas não toda hora.
              </Text>
            </View>

            <View style={styles.form}>
              {/* Em tela estreita os campos empilham: lado a lado sobram 130px
                  cada, e nome comprido nao cabe. */}
              <View style={isCompactWidth ? styles.coluna : styles.linha}>
                <Input
                  label="Nome"
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Lucas"
                  autoCapitalize="words"
                  autoComplete="given-name"
                  containerStyle={styles.meio}
                  error={tentou && erros.nome ? MENSAGENS_PERFIL.nome[erros.nome] : undefined}
                />
                <Input
                  label="Sobrenome"
                  value={sobrenome}
                  onChangeText={setSobrenome}
                  placeholder="Rocha"
                  autoCapitalize="words"
                  autoComplete="family-name"
                  containerStyle={styles.meio}
                  error={
                    tentou && erros.sobrenome
                      ? MENSAGENS_PERFIL.sobrenome[erros.sobrenome]
                      : undefined
                  }
                />
              </View>

              <View style={styles.apelidoBloco}>
                <Input
                  label="Apelido"
                  value={apelido}
                  // Maiuscula PRESERVADA na tela: @Lucas_Rocha aparece como foi
                  // escrito. Para unicidade ela nao conta — @Lucas_Rocha e
                  // @lucas_rocha sao o mesmo apelido, e so um pode existir.
                  onChangeText={setApelido}
                  placeholder="lucas_rocha"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={APELIDO_MAX}
                  hint="Letras, números e _ · maiúscula não cria apelido diferente"
                  error={
                    tentou && erros.apelido
                      ? MENSAGENS_PERFIL.apelido[erros.apelido]
                      : undefined
                  }
                  onSubmitEditing={enviar}
                  returnKeyType="go"
                />
                <AvisoApelido estado={estadoApelido} apelido={apelido} />
              </View>

              {sugestoes.length > 0 ? (
                <View style={styles.sugestoes}>
                  <Text style={styles.sugestoesTitulo}>Sugestões</Text>
                  <View style={styles.sugestoesLista}>
                    {sugestoes.map((s) => (
                      <Pressable
                        key={s}
                        onPress={() => setApelido(s)}
                        style={styles.chip}
                        accessibilityRole="button"
                        accessibilityLabel={`Usar o apelido ${s}`}
                      >
                        <Text style={styles.chipTexto}>@{s}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : null}

              {serverError ? (
                <View style={styles.erroServidor} accessibilityRole="alert">
                  <Text style={styles.erroServidorTexto}>{serverError}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.actions}>
              <Button label="Continuar" variant="primary" onPress={enviar} loading={loading} />
              {isShortHeight ? null : (
                <Text style={styles.rodape}>
                  Você poderá completar o perfil com foto, cidade e time do coração depois.
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/**
 * O retorno da checagem, abaixo do campo.
 *
 * Cada situação tem cor e texto próprios — "verificando" precisa aparecer,
 * senão a tela parece travada em conexão lenta.
 */
function AvisoApelido({ estado, apelido }: { estado: EstadoApelido; apelido: string }) {
  if (estado.situacao === 'vazio' || estado.situacao === 'invalido') return null;

  const conteudo = {
    verificando: { texto: 'Verificando…', cor: colors.textMuted, girando: true },
    disponivel: { texto: `@${apelido} está livre`, cor: colors.green, girando: false },
    em_uso: { texto: MENSAGENS_PERFIL.apelido.em_uso, cor: colors.danger, girando: false },
    falhou: { texto: 'Não deu para verificar agora.', cor: colors.warning, girando: false },
  }[estado.situacao];

  return (
    <View style={styles.aviso} accessibilityLiveRegion="polite">
      {conteudo.girando ? <ActivityIndicator size="small" color={colors.textMuted} /> : null}
      <Text style={[styles.avisoTexto, { color: conteudo.cor }]}>{conteudo.texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.black },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  column: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA_CONTEUDO,
    gap: spacing.xl,
  },
  header: { gap: spacing.sm },
  title: { ...typography.title, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted },
  form: { gap: spacing.lg },
  linha: { flexDirection: 'row', gap: spacing.md },
  coluna: { gap: spacing.lg },
  meio: { flex: 1 },
  apelidoBloco: { gap: spacing.sm },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginLeft: spacing.xs,
    minHeight: 20,
  },
  avisoTexto: { ...typography.caption },
  sugestoes: { gap: spacing.sm },
  sugestoesTitulo: { ...typography.caption, color: colors.textMuted, marginLeft: spacing.xs },
  sugestoesLista: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    backgroundColor: colors.greenSoft,
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    minHeight: 36,
    justifyContent: 'center',
  },
  chipTexto: { ...typography.caption, color: colors.green, fontWeight: '600' },
  erroServidor: {
    backgroundColor: 'rgba(229, 72, 77, 0.12)',
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  erroServidorTexto: { ...typography.caption, color: colors.danger },
  actions: { gap: spacing.md },
  rodape: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
});
