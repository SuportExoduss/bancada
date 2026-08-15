/**
 * Converte os documentos de `docs/12-legal/*.md` para blocos que o app
 * consegue renderizar, gravando `src/content/documentosLegais.ts`.
 *
 * Por que gerar em vez de escrever direto em TypeScript: o Markdown continua
 * sendo a **única fonte de verdade**. Documento jurídico que existe em duas
 * cópias é documento que vai divergir — e a cópia errada é sempre a que o
 * usuário lê.
 *
 * Rode depois de editar qualquer documento de `docs/12-legal/`:
 *
 *     node scripts/gerar-documentos-legais.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const DOCUMENTOS = [
  { chave: 'termos', arquivo: 'docs/12-legal/TERMOS_DE_USO.md', titulo: 'Termos de Uso' },
  {
    chave: 'privacidade',
    arquivo: 'docs/12-legal/POLITICA_DE_PRIVACIDADE.md',
    titulo: 'Política de Privacidade',
  },
];

const SAIDA = 'src/content/documentosLegais.ts';

/**
 * Corta o cabeçalho interno (versão, pendências, avisos para a equipe) e
 * devolve só o que é para o usuário ler.
 *
 * O corte é no primeiro `---` de linha inteira: tudo acima dele é nota de
 * trabalho, tudo abaixo é o documento.
 */
function corpoDoDocumento(texto) {
  const linhas = texto.split('\n');
  const corte = linhas.findIndex((l) => l.trim() === '---');
  if (corte < 0) throw new Error('não achei o separador que fecha o cabeçalho interno');
  return linhas.slice(corte + 1);
}

function celulas(linha) {
  return linha
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());
}

const ehSeparadorDeTabela = (l) => /^\|[\s:|-]+\|$/.test(l.trim());

function paraBlocos(linhas) {
  const blocos = [];
  let paragrafo = [];
  let citacao = null;

  const fecharParagrafo = () => {
    if (paragrafo.length) {
      blocos.push({ t: 'p', x: paragrafo.join(' ') });
      paragrafo = [];
    }
  };
  const fecharCitacao = () => {
    if (citacao) {
      blocos.push({ t: 'destaque', linhas: citacao });
      citacao = null;
    }
  };

  for (let i = 0; i < linhas.length; i++) {
    const linha = linhas[i];
    const cru = linha.trim();

    if (cru.startsWith('>')) {
      fecharParagrafo();
      const conteudo = cru.replace(/^>\s?/, '').trim();
      citacao = citacao ?? [];
      // Linha vazia dentro da citação vira separação de parágrafo.
      if (conteudo === '' && citacao.length && citacao[citacao.length - 1] === '') continue;
      citacao.push(conteudo.replace(/^#+\s*/, ''));
      continue;
    }
    fecharCitacao();

    if (cru === '') {
      fecharParagrafo();
      continue;
    }

    if (cru === '---') {
      fecharParagrafo();
      blocos.push({ t: 'hr' });
      continue;
    }

    const titulo = cru.match(/^(#{1,4})\s+(.*)$/);
    if (titulo) {
      fecharParagrafo();
      blocos.push({ t: 'h' + titulo[1].length, x: titulo[2] });
      continue;
    }

    const item = cru.match(/^[-*]\s+(.*)$/) ?? cru.match(/^\d+\.\s+(.*)$/);
    if (item) {
      fecharParagrafo();
      blocos.push({ t: 'li', x: item[1] });
      continue;
    }

    // Linha indentada logo depois de um item é continuação DELE, não um
    // parágrafo novo. Sem isto, "…campeonatos," e "jogadores e torcida…"
    // viram dois blocos com estilos diferentes e a lista quebra na tela.
    const anteriorEhItem = blocos.length && blocos[blocos.length - 1].t === 'li';
    if (anteriorEhItem && !paragrafo.length && /^\s{2,}/.test(linha)) {
      blocos[blocos.length - 1].x += ' ' + cru;
      continue;
    }

    if (cru.startsWith('|')) {
      fecharParagrafo();
      if (ehSeparadorDeTabela(cru)) continue;
      // A primeira linha da tabela é cabeçalho; as demais são dados.
      const anterior = blocos[blocos.length - 1];
      const ehCabecalho = !anterior || (anterior.t !== 'linha' && anterior.t !== 'cabecalho');
      blocos.push({ t: ehCabecalho ? 'cabecalho' : 'linha', c: celulas(cru) });
      continue;
    }

    paragrafo.push(cru);
  }

  fecharParagrafo();
  fecharCitacao();
  return blocos;
}

const partes = DOCUMENTOS.map(({ chave, arquivo, titulo }) => {
  const original = readFileSync(arquivo, 'utf8');
  const blocos = paraBlocos(corpoDoDocumento(original));
  // Enquanto houver lacuna, o app avisa. Documento com buraco exibido como se
  // fosse final é pior que documento ausente: a pessoa acha que leu algo.
  const rascunho = original.includes('[A DEFINIR]');
  console.log(`${arquivo} → ${blocos.length} blocos${rascunho ? ' (rascunho)' : ''}`);
  return `  ${chave}: {\n    titulo: ${JSON.stringify(titulo)},\n    origem: ${JSON.stringify(arquivo)},\n    rascunho: ${rascunho},\n    blocos: ${JSON.stringify(blocos, null, 6).replace(/\n/g, '\n    ')} as Bloco[],\n  },`;
});

const conteudo = `/**
 * GERADO AUTOMATICAMENTE — não edite este arquivo.
 *
 * Fonte: docs/12-legal/*.md
 * Para atualizar: node scripts/gerar-documentos-legais.mjs
 *
 * O Markdown em docs/ é a única fonte de verdade. Documento jurídico que
 * existe em duas cópias diverge, e a cópia errada é sempre a que o usuário lê.
 */

export type Bloco =
  | { t: 'h1' | 'h2' | 'h3' | 'h4'; x: string }
  | { t: 'p'; x: string }
  | { t: 'li'; x: string }
  | { t: 'hr' }
  | { t: 'destaque'; linhas: string[] }
  | { t: 'cabecalho' | 'linha'; c: string[] };

export interface DocumentoLegal {
  titulo: string;
  origem: string;
  /** true enquanto o texto ainda tiver lacunas por preencher */
  rascunho: boolean;
  blocos: Bloco[];
}

export const documentosLegais = {
${partes.join('\n')}
} satisfies Record<string, DocumentoLegal>;

export type ChaveDocumento = keyof typeof documentosLegais;
`;

mkdirSync(dirname(SAIDA), { recursive: true });
writeFileSync(SAIDA, conteudo);
console.log('gravado:', SAIDA);
