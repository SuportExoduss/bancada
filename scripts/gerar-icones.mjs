/**
 * Prepara os assets oficiais da navegacao: icones, marca do topo e os fundos
 * GRAFIT.
 *
 * Os arquivos originais ficam em IMAGENS/ com nomes escritos a mao -- acento,
 * espaco, "px" no fim, e um "notficacao" sem o "i". `require()` do Metro exige
 * caminho estatico e literal, entao esses nomes iriam parar dentro do codigo.
 * Aqui eles viram uma so convencao: `{chave}-{tamanho}-{cor}.png`.
 *
 * Rodar: node scripts/gerar-icones.mjs
 */
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const ORIGEM = 'IMAGENS';
const ICONES_ORIGEM = `${ORIGEM}/icones`;
const DESTINO_ICONES = 'assets/icones';
const DESTINO_FUNDOS = 'assets/fundos';
const DESTINO_MARCA = 'assets/marca';

/**
 * Nome escrito a mao -> chave do codigo.
 *
 * A chave e o termo OFICIAL da interface (D-034), nao a traducao do desenho:
 * o arquivo se chama "botao video" e a aba se chama ROLLS.
 */
const CHAVES = [
  ['botao-de-inicio', 'inicio'],
  ['botão procurar', 'explorar'],
  ['botao video', 'rolls'],
  ['botão mensagen', 'mensagens'],
  ['botao perfil', 'perfil'],
  ['botao postar', 'postar'],
  ['botao notficacao', 'notificacao'],
  ['botao burger-menu', 'menu'],
];

const TAMANHOS = [16, 24, 32, 64];
const CORES = ['cinza', 'verde'];

mkdirSync(DESTINO_ICONES, { recursive: true });

const existentes = new Set(readdirSync(ICONES_ORIGEM));
const faltando = [];
const gerados = [];

for (const [prefixo, chave] of CHAVES) {
  for (const cor of CORES) {
    for (const tamanho of TAMANHOS) {
      const nome = `${prefixo} ${cor} ${tamanho} px.png`;
      if (!existentes.has(nome)) {
        faltando.push(nome);
        continue;
      }
      const saida = `${DESTINO_ICONES}/${chave}-${tamanho}-${cor}.png`;
      // `palette: true` porque icone e area chapada: paleta indexada corta o
      // arquivo pela metade sem tocar num pixel visivel.
      await sharp(`${ICONES_ORIGEM}/${nome}`)
        .png({ compressionLevel: 9, palette: true })
        .toFile(saida);
      gerados.push(saida);
    }
  }
}

console.log(`icones: ${gerados.length} gerados`);
if (faltando.length) {
  console.log(`FALTANDO (${faltando.length}):`);
  faltando.forEach((f) => console.log('  ' + f));
}

/* ---------------------------------------------------------------- fundos */

const FUNDOS = [
  ['fundo bancada todos os feeds GRAFIT.png', 'fundo-app-retrato.webp'],
  ['fundo bancada todos os feeds web GRAFIT.png', 'fundo-app-paisagem.webp'],
];

for (const [origem, destino] of FUNDOS) {
  const saida = `${DESTINO_FUNDOS}/${destino}`;
  const info = await sharp(`${ORIGEM}/${origem}`)
    // 82 e o ponto em que o degrade do grafite para de mostrar faixas. Abaixo
    // disso o fundo ganha bandas visiveis justamente por ser quase liso.
    .webp({ quality: 82 })
    .toFile(saida);
  console.log(`fundo: ${destino} ${info.width}x${info.height} ${(info.size / 1024) | 0}KB`);
}

/* ----------------------------------------------------------------- marca */

/**
 * A marca do topo veio SEM canal alfa -- fundo preto chapado (#0a0a09).
 * Colada assim sobre o grafite ela viraria um retangulo preto visivel.
 *
 * A recuperacao possivel: a arte e clara sobre preto, entao o quanto de tinta
 * existe em cada pixel e o proprio brilho dele. `alfa = max(r,g,b)`, e depois
 * a cor e dividida por esse alfa para virar alfa *reto* -- que e o que o
 * React Native espera. Sem essa divisao a borda das letras sai escurecida
 * duas vezes.
 *
 * O piso de 10 tira o preto de base antes da conta; sem ele a imagem inteira
 * ficaria com 4% de neblina cinza por cima do fundo.
 */
const PISO = 10;

const origemMarca = sharp(`${ORIGEM}/nome+logo top hambuerguer.png`);
const { data, info } = await origemMarca
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const canais = info.channels;
for (let i = 0; i < data.length; i += canais) {
  const r = Math.max(0, data[i] - PISO);
  const g = Math.max(0, data[i + 1] - PISO);
  const b = Math.max(0, data[i + 2] - PISO);
  const a = Math.max(r, g, b);
  if (a === 0) {
    data[i] = data[i + 1] = data[i + 2] = 0;
    data[i + 3] = 0;
    continue;
  }
  data[i] = Math.min(255, Math.round((r * 255) / a));
  data[i + 1] = Math.min(255, Math.round((g * 255) / a));
  data[i + 2] = Math.min(255, Math.round((b * 255) / a));
  data[i + 3] = a;
}

const marca = await sharp(data, { raw: { width: info.width, height: info.height, channels: canais } })
  // `trim` corta a moldura vazia que sobrou. Sem isso a marca ocuparia a
  // largura toda do topo sendo que metade e transparente.
  .trim({ threshold: 2 })
  // 3x a altura de exibicao (28dp) cobre a tela mais densa sem carregar um
  // arquivo de 784px de altura para desenhar 28.
  .resize({ height: 84, fit: 'inside', withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toBuffer({ resolveWithObject: true });

writeFileSync(`${DESTINO_MARCA}/marca-topo.png`, marca.data);
console.log(
  `marca: marca-topo.png ${marca.info.width}x${marca.info.height} ${(marca.info.size / 1024) | 0}KB`,
);

/**
 * A proporcao da marca sai daqui, medida, em vez de ser lida em tempo de
 * execucao.
 *
 * `Image.resolveAssetSource` existe no React Native e NAO existe no
 * react-native-web -- no navegador o `require` de uma imagem devolve uma
 * string com a URL, sem largura nem altura. Descobrimos na tela em branco.
 * Medir aqui vale para as duas plataformas.
 */
mkdirSync('src/assets', { recursive: true });
writeFileSync(
  'src/assets/marca.ts',
  [
    `/* GERADO POR ${'scripts/gerar-icones.mjs'} -- nao editar a mao. */`,
    '',
    `export const MARCA_TOPO = require('../../assets/marca/marca-topo.png');`,
    '',
    '/** Largura dividida por altura do arquivo, medida na geracao. */',
    `export const PROPORCAO_DA_MARCA = ${(marca.info.width / marca.info.height).toFixed(4)};`,
    '',
  ].join('\n'),
);
console.log(`marca: src/assets/marca.ts proporcao ${(marca.info.width / marca.info.height).toFixed(4)}`);

/* -------------------------------------------------- tabela para o codigo */

/**
 * A tabela de `require` nasce aqui junto com os arquivos.
 *
 * Escrita a mao ela ficaria desatualizada no dia em que um icone mudasse de
 * nome -- e o erro so apareceria em runtime, na tela de quem estivesse usando.
 */
const linhas = [
  `/* GERADO POR ${'scripts/gerar-icones.mjs'} -- nao editar a mao. */`,
  '',
  '/**',
  ' * Tabela estatica dos assets oficiais de icone.',
  ' *',
  ' * Tem que ser literal: o Metro resolve `require` em tempo de empacotamento,',
  ' * e um caminho montado com variavel nao existe para ele. Por isso as 64',
  ' * linhas, e por isso elas sao geradas em vez de digitadas.',
  ' */',
  'export const ASSETS_DE_ICONE = {',
];

for (const [, chave] of CHAVES) {
  linhas.push(`  ${chave}: {`);
  for (const cor of CORES) {
    linhas.push(`    ${cor}: {`);
    for (const tamanho of TAMANHOS) {
      linhas.push(`      ${tamanho}: require('../../assets/icones/${chave}-${tamanho}-${cor}.png'),`);
    }
    linhas.push('    },');
  }
  linhas.push('  },');
}
linhas.push('} as const;', '');

mkdirSync('src/assets', { recursive: true });
writeFileSync('src/assets/icones.ts', linhas.join('\n'));
console.log(`tabela: src/assets/icones.ts com ${CHAVES.length * TAMANHOS.length * CORES.length} entradas`);
