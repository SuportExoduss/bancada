/**
 * Regras de idade — puras, sem Firebase.
 *
 * As faixas vêm da D-026 e da Lei 15.211/2025. A tela, o caso de uso e a
 * Security Rule precisam concordar sobre elas, então moram aqui.
 */

export const IDADE_MINIMA = 13;
/** Abaixo disto a conta precisa estar vinculada à de um responsável. */
export const IDADE_SEM_RESPONSAVEL = 16;
export const MAIORIDADE = 18;

export type FaixaEtaria =
  /** Não pode ter conta na BANCADA. */
  | 'nao_permitida'
  /** 13 a 15: a conta é criada pelo responsável e fica vinculada à dele. */
  | 'precisa_responsavel'
  /** 16 e 17: conta própria; a lei não exige vinculação. */
  | 'adolescente'
  /** 18 ou mais. */
  | 'adulto';

export type ErroData = 'vazio' | 'incompleto' | 'invalido' | 'futuro' | 'antiga_demais';

/**
 * Aplica a máscara DD/MM/AAAA enquanto a pessoa digita.
 *
 * Campo de data com máscara em vez de seletor de calendário: para digitar uma
 * data de nascimento, rolar um calendário até 1994 é pior que teclar oito
 * números. Seletor é bom para data próxima, não para aniversário.
 */
export function formatarData(bruto: string): string {
  const numeros = bruto.replace(/\D/g, '').slice(0, 8);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

/**
 * Converte DD/MM/AAAA em Date, ou `null` se a data não existir.
 *
 * Confere os componentes depois de montar o Date: sem isso, 31/02/2000 vira
 * 02/03/2000 silenciosamente — o JavaScript "conserta" a data e o app aceita
 * um aniversário que nunca aconteceu.
 */
export function analisarData(bruto: string): Date | null {
  const partes = bruto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!partes) return null;

  const dia = Number(partes[1]);
  const mes = Number(partes[2]);
  const ano = Number(partes[3]);

  const data = new Date(ano, mes - 1, dia);
  if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
    return null;
  }
  return data;
}

export function validarData(bruto: string, hoje = new Date()): ErroData | null {
  const texto = bruto.trim();
  if (texto.length === 0) return 'vazio';
  if (texto.length < 10) return 'incompleto';

  const data = analisarData(texto);
  if (!data) return 'invalido';
  if (data > hoje) return 'futuro';
  if (hoje.getFullYear() - data.getFullYear() > 120) return 'antiga_demais';
  return null;
}

/**
 * Idade completa em anos.
 *
 * Desconta o ano quando o aniversário ainda não chegou: quem nasceu em
 * dezembro não faz aniversário em janeiro, e arredondar para cima deixaria
 * uma criança de 12 entrar como se tivesse 13.
 */
export function idadeEm(nascimento: Date, hoje = new Date()): number {
  let anos = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) anos--;
  return anos;
}

export function faixaDaIdade(idade: number): FaixaEtaria {
  if (idade < IDADE_MINIMA) return 'nao_permitida';
  if (idade < IDADE_SEM_RESPONSAVEL) return 'precisa_responsavel';
  if (idade < MAIORIDADE) return 'adolescente';
  return 'adulto';
}

export function faixaDaData(bruto: string, hoje = new Date()): FaixaEtaria | null {
  const data = analisarData(bruto.trim());
  if (!data) return null;
  return faixaDaIdade(idadeEm(data, hoje));
}

export const MENSAGENS_IDADE = {
  data: {
    vazio: 'Informe a data de nascimento.',
    incompleto: 'Complete a data: dia, mês e ano.',
    invalido: 'Essa data não existe.',
    futuro: 'A data não pode ser no futuro.',
    antiga_demais: 'Confira o ano.',
  },
  /** Quando alguém tenta criar a própria conta com menos de 13. */
  naoPermitida: `A BANCADA é para maiores de ${IDADE_MINIMA} anos.`,
  /** Quando alguém tenta criar a própria conta com 13 a 15. */
  precisaResponsavel:
    'Quem tem menos de 16 anos entra pela conta de um responsável. Peça para sua mãe, seu pai ou seu responsável criar a conta para você.',
  /** Quando o responsável informa uma idade que não precisa de vinculação. */
  menorJaPodeSozinho:
    'A partir dos 16 anos a conta é criada pela própria pessoa, sem precisar da sua.',
} as const;
