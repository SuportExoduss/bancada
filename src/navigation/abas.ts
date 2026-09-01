import type { NomeDoIcone } from '../components/Icone';

/**
 * As cinco seções da barra de baixo, **nesta ordem**.
 *
 * A ordem é parte da especificação, não uma preferência: quem usa o app
 * decora a posição do dedo antes de decorar o desenho do ícone, e trocar
 * duas abas de lugar depois quebra esse aprendizado.
 *
 * `MOMENT` e `ROLLS` são os nomes oficiais da BANCADA (D-034). Não é enfeite:
 * "story" e "reels" são marcas da Meta, e o app não é um clone.
 */
export type ChaveDeAba = 'home' | 'explorar' | 'rolls' | 'mensagens' | 'perfil';

export interface DefinicaoDeAba {
  chave: ChaveDeAba;
  rotulo: string;
  icone: NomeDoIcone;
}

export const ABAS: readonly DefinicaoDeAba[] = [
  { chave: 'home', rotulo: 'Home', icone: 'inicio' },
  { chave: 'explorar', rotulo: 'Explorar', icone: 'explorar' },
  { chave: 'rolls', rotulo: 'Rolls', icone: 'rolls' },
  { chave: 'mensagens', rotulo: 'Mensagens', icone: 'mensagens' },
  { chave: 'perfil', rotulo: 'Perfil', icone: 'perfil' },
] as const;

/**
 * Abas cuja função ainda não existe.
 *
 * Estão na barra porque a especificação define as cinco posições de uma vez —
 * mas quem tocar recebe uma tela honesta dizendo o que falta, e não uma
 * imitação da função. É a regra "nasce com o que existe e cresce" aplicada:
 * a casca nasce inteira, o conteúdo entra na fase dele.
 *
 * Tirar uma chave daqui é o que "liga" a aba. A lista some sozinha quando a
 * última entrar.
 */
export const ABAS_SEM_CONTEUDO: readonly ChaveDeAba[] = ['rolls', 'mensagens'] as const;

export function abaEstaPronta(chave: ChaveDeAba): boolean {
  return !ABAS_SEM_CONTEUDO.includes(chave);
}
