/**
 * Regras de credencial — puras, sem Firebase.
 *
 * Ficam em `domain/` porque a tela e, mais tarde, o serviço de autenticação
 * precisam concordar. Escrever a mesma regra em dois lugares é como os dois
 * divergem: a tela aceita e o servidor recusa, e o usuário não entende por quê.
 */

/**
 * Validação de e-mail deliberadamente permissiva.
 *
 * Regex rigoroso de e-mail rejeita endereço válido e é fonte clássica de
 * usuário perdido. Quem valida de verdade é o envio: se o e-mail não existir,
 * a confirmação não chega.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const SENHA_MINIMA = 8;

export type ErroEmail = 'vazio' | 'formato';
export type ErroSenha = 'vazio' | 'curta' | 'so_numeros';
export type ErroConfirmacao = 'vazio' | 'diferente';

export function validarEmail(bruto: string): ErroEmail | null {
  const email = bruto.trim();
  if (email.length === 0) return 'vazio';
  if (!EMAIL.test(email)) return 'formato';
  return null;
}

export function validarSenha(senha: string): ErroSenha | null {
  if (senha.length === 0) return 'vazio';
  if (senha.length < SENHA_MINIMA) return 'curta';
  // Data de nascimento e telefone são as senhas mais comuns e as primeiras
  // que um ataque tenta.
  if (/^\d+$/.test(senha)) return 'so_numeros';
  return null;
}

export function validarConfirmacao(senha: string, confirmacao: string): ErroConfirmacao | null {
  if (confirmacao.length === 0) return 'vazio';
  if (senha !== confirmacao) return 'diferente';
  return null;
}

/** Mensagens em português claro. Nunca código de erro na tela. */
export const MENSAGENS = {
  email: {
    vazio: 'Digite seu e-mail.',
    formato: 'Esse e-mail não parece válido.',
  },
  senha: {
    vazio: 'Crie uma senha.',
    curta: `Use pelo menos ${SENHA_MINIMA} caracteres.`,
    so_numeros: 'Misture letras com os números.',
  },
  confirmacao: {
    vazio: 'Repita a senha.',
    diferente: 'As senhas não são iguais.',
  },
} as const;

export type ForcaSenha = 'fraca' | 'media' | 'forte';

/**
 * Força da senha, para o indicador visual.
 *
 * Contagem simples de variedade — não é medida de segurança real, é sinal
 * para o usuário. Medida real seria comparar com lista de senhas vazadas,
 * e isso não cabe no cliente.
 */
export function forcaDaSenha(senha: string): ForcaSenha {
  if (senha.length < SENHA_MINIMA) return 'fraca';

  let variedade = 0;
  if (/[a-z]/.test(senha)) variedade++;
  if (/[A-Z]/.test(senha)) variedade++;
  if (/\d/.test(senha)) variedade++;
  if (/[^a-zA-Z0-9]/.test(senha)) variedade++;

  if (senha.length >= 12 && variedade >= 3) return 'forte';
  if (variedade >= 2) return 'media';
  return 'fraca';
}
