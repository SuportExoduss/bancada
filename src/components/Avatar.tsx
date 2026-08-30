import { StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '../theme';

export interface AvatarProps {
  /** Usado para as iniciais */
  nome: string;
  /** Usado para escolher a cor — a mesma pessoa recebe sempre a mesma */
  apelido: string;
  tamanho?: number;
}

/**
 * Paleta de fundos para o avatar.
 *
 * Escolhidas escuras o bastante para texto branco ficar legível em cima, e
 * dentro do clima da marca — sem rosa neon no meio de um app de várzea.
 */
const CORES = [
  '#2E5E3A',
  '#1F4D5C',
  '#5C3A1F',
  '#4A2E5C',
  '#5C1F2E',
  '#3A3A5C',
  '#1F5C4A',
  '#5C4A1F',
] as const;

/**
 * Cor estável a partir do apelido.
 *
 * Soma simples dos códigos dos caracteres. Não precisa ser criptográfico —
 * precisa é ser **determinístico**: a mesma pessoa tem que ter a mesma cor
 * hoje, amanhã e no celular de outra pessoa. Cor sorteada faria o avatar
 * mudar a cada abertura, e aí ele deixa de ajudar a reconhecer alguém.
 */
export function corDoApelido(apelido: string): string {
  let soma = 0;
  for (let i = 0; i < apelido.length; i++) soma += apelido.charCodeAt(i);
  return CORES[soma % CORES.length];
}

/**
 * Iniciais: primeira letra do primeiro e do último nome.
 *
 * "Andre Roberth" → AR. Nome único → uma letra só. Sem nome → "?", que é
 * melhor que um círculo vazio parecendo defeito.
 */
export function iniciaisDe(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
  return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
}

/**
 * Avatar de iniciais.
 *
 * **Provisório por escolha, não por falta.** Foto de verdade depende do
 * Storage, que é Fase 10. Mas o avatar aparece em cada linha do feed e é o
 * que faz a lista parecer gente em vez de texto — então ele entra agora, com
 * iniciais, e o desenho não muda quando a foto chegar.
 */
export function Avatar({ nome, apelido, tamanho = 44 }: AvatarProps) {
  return (
    <View
      style={[
        styles.circulo,
        {
          width: tamanho,
          height: tamanho,
          borderRadius: tamanho / 2,
          backgroundColor: corDoApelido(apelido),
        },
      ]}
      // Decorativo: o nome já está escrito ao lado, e um leitor de tela
      // anunciando "AR" antes de "Andre Roberth" só atrapalha.
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Text style={[styles.iniciais, { fontSize: tamanho * 0.38 }]}>{iniciaisDe(nome)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circulo: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iniciais: { ...typography.bodyStrong, color: colors.text },
});
