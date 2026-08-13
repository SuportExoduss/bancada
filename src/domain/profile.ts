/**
 * Regras de perfil — puras, sem Firebase.
 *
 * A tela, o caso de uso e a Security Rule precisam concordar sobre o que é um
 * apelido válido. Escrever a regra em três lugares é como os três divergem.
 */

export const APELIDO_MIN = 3;
export const APELIDO_MAX = 20;

/**
 * Letras, números e `_`. Nada de acento, espaço ou ponto.
 *
 * Maiúscula é aceita **na escrita**: `Lucas_Rocha` é digitado e exibido assim.
 * Para efeito de unicidade, porém, ela não conta — ver `chaveDoApelido`.
 */
export const APELIDO_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

/**
 * Apelidos que ninguém pode tomar porque colidem com rotas do app.
 *
 * Sem isto, alguém pega `entrar` e a rota `/@entrar` briga com `/entrar`.
 */
export const APELIDOS_RESERVADOS = new Set([
  'admin',
  'ajuda',
  'api',
  'bancada',
  'cadastro',
  'campeonato',
  'campeonatos',
  'config',
  'configuracoes',
  'entrar',
  'eu',
  'explorar',
  'inicio',
  'jogo',
  'jogos',
  'login',
  'logout',
  'mensagens',
  'null',
  'perfil',
  'post',
  'posts',
  'privacidade',
  'root',
  'sobre',
  'suporte',
  'termos',
  'time',
  'times',
  'undefined',
]);

/**
 * O apelido tem DUAS formas, e a distinção é o coração da regra:
 *
 *   EXIBIÇÃO — como a pessoa escreveu.       `Lucas_Rocha`
 *   CHAVE    — minúscula, para comparação.   `lucas_rocha`
 *
 * A exibição é o que aparece no perfil, preservando as maiúsculas que a
 * pessoa escolheu. A chave é o ID do documento em `apelidos/{chave}`, e é ela
 * que garante a unicidade.
 *
 * Consequência: `Lucas_Rocha`, `lucas_rocha` e `LUCAS_ROCHA` são **o mesmo
 * apelido**. Só um deles pode existir. Sem isso, dois perfis ficariam com
 * endereços que diferem só em maiúscula — e ninguém saberia qual é qual.
 */
export function chaveDoApelido(bruto: string): string {
  return bruto.trim().toLowerCase();
}

/** Limpa só os espaços das pontas, preservando as maiúsculas. */
export function apelidoParaExibicao(bruto: string): string {
  return bruto.trim();
}

export type ErroApelido = 'vazio' | 'curto' | 'longo' | 'caracteres' | 'reservado';

export function validarApelido(bruto: string): ErroApelido | null {
  // Valida pela CHAVE: reservados e tamanho nao dependem de maiuscula.
  const apelido = chaveDoApelido(bruto);
  if (apelido.length === 0) return 'vazio';
  if (apelido.length < APELIDO_MIN) return 'curto';
  if (apelido.length > APELIDO_MAX) return 'longo';
  if (!APELIDO_REGEX.test(apelido)) return 'caracteres';
  if (APELIDOS_RESERVADOS.has(apelido)) return 'reservado';
  return null;
}

export type ErroNome = 'vazio' | 'curto' | 'longo';

export function validarNome(bruto: string): ErroNome | null {
  const nome = bruto.trim();
  if (nome.length === 0) return 'vazio';
  if (nome.length < 2) return 'curto';
  if (nome.length > 40) return 'longo';
  return null;
}

export const MENSAGENS_PERFIL = {
  nome: {
    vazio: 'Diga seu nome.',
    curto: 'Nome muito curto.',
    longo: 'Nome muito longo.',
  },
  sobrenome: {
    vazio: 'Diga seu sobrenome.',
    curto: 'Sobrenome muito curto.',
    longo: 'Sobrenome muito longo.',
  },
  apelido: {
    vazio: 'Escolha um apelido.',
    curto: `Use pelo menos ${APELIDO_MIN} caracteres.`,
    longo: `No máximo ${APELIDO_MAX} caracteres.`,
    caracteres: 'Use letras, números e _ (sem acento, espaço ou ponto).',
    reservado: 'Esse apelido é reservado pela BANCADA.',
    em_uso: 'Esse apelido já é de outra pessoa.',
  },
} as const;

/**
 * Sugere apelidos a partir do nome, para quem não quer pensar.
 *
 * Não garante disponibilidade — quem garante é a consulta.
 */
export function sugerirApelidos(nome: string, sobrenome: string): string[] {
  const limpar = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '') // tira acento
      .replace(/[^a-z0-9]/g, '');

  const n = limpar(nome);
  const s = limpar(sobrenome);
  if (!n) return [];

  const brutas = [
    `${n}_${s}`,
    `${n}${s}`,
    s ? `${n}_${s.charAt(0)}` : '',
    `${n}${Math.floor(Math.random() * 90 + 10)}`,
  ];

  return brutas
    .filter(Boolean)
    .map((a) => a.slice(0, APELIDO_MAX))
    .filter((a) => validarApelido(a) === null)
    .filter((a, i, todas) => todas.indexOf(a) === i)
    .slice(0, 3);
}
