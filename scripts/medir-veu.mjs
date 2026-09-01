/**
 * Mede o véu mínimo de cada fundo, para o texto continuar legível por cima.
 *
 * Roda de novo sempre que uma arte de fundo mudar. Os números que ele imprime
 * vão para o `VEU` de `src/components/Fundo.tsx` — e o comentário de lá
 * explica por que o critério do app é o percentil 99,95 e o das fotos de
 * entrada é o pixel mais claro.
 *
 * Rodar: node scripts/medir-veu.mjs
 */
import sharp from 'sharp';

/** Componente linearizado, como a fórmula de luminância relativa da WCAG pede. */
function linear(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminancia(r, g, b) {
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function contraste(a, b) {
  const [claro, escuro] = a > b ? [a, b] : [b, a];
  return (claro + 0.05) / (escuro + 0.05);
}

/** As duas cores que caem sobre imagem: texto secundário e link. */
const TEXTO = luminancia(0xd6, 0xd6, 0xd6);
const LINK = luminancia(0xb8, 0xe9, 0xa6);
/** O véu é este preto esverdeado, variando só a opacidade. */
const VEU = luminancia(10, 12, 10);
/** O piso da WCAG para texto corrido. */
const MINIMO = 4.5;

/**
 * Cada fundo e a **faixa vertical onde texto solto realmente cai** nele.
 *
 * Medir a imagem inteira e o erro fácil de cometer: nas fotos de entrada, o
 * pedaço mais claro e o céu do terço de cima, onde não passa uma letra. Exigir
 * véu para o céu apagaria a foto inteira sem melhorar a leitura de nada.
 *
 * Nas telas de entrada o texto vive entre 35% e 78% da altura: título,
 * subtítulo e botões. No app, o texto solto e o que fica fora dos cartões —
 * marca do topo, rótulos dos Moments, abas do feed, rótulos da barra de baixo
 * — e isso cai no topo e no rodapé.
 */
const FUNDOS = [
  { arquivo: 'assets/fundos/fundo-login-dia.webp', faixas: [[0.35, 0.78]] },
  { arquivo: 'assets/fundos/fundo-login-noite.webp', faixas: [[0.35, 0.78]] },
  { arquivo: 'assets/fundos/fundo-app-retrato.webp', faixas: [[0, 0.3], [0.88, 1]] },
  { arquivo: 'assets/fundos/fundo-app-paisagem.webp', faixas: [[0, 0.3], [0.88, 1]] },
];

/**
 * O percentil, e nao o pixel mais claro.
 *
 * A arte GRAFIT e quase preta com faisca de um ou dois pixels. Contra o pixel
 * mais claro ela pediria 0,81 de veu e sumiria. 99,95% da area coberta, e o
 * que sobra e menor que uma letra.
 */
const PERCENTIL = 0.9995;

for (const { arquivo, faixas } of FUNDOS) {
  // Reduzido para 600 de largura: a medição não muda de forma útil na
  // resolução cheia, e a cheia leva minutos.
  const { data, info } = await sharp(arquivo)
    .resize(600, null, { fit: 'inside' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const brilhos = [];
  for (const [de, ate] of faixas) {
    for (let y = Math.floor(height * de); y < Math.floor(height * ate); y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * channels;
        brilhos.push(luminancia(data[i], data[i + 1], data[i + 2]));
      }
    }
  }
  brilhos.sort((a, b) => a - b);

  const alvo = brilhos[Math.floor(brilhos.length * PERCENTIL)];

  let veu = 1;
  for (let passo = 0; passo <= 100; passo++) {
    const opacidade = passo / 100;
    const resultante = VEU * opacidade + alvo * (1 - opacidade);
    if (contraste(TEXTO, resultante) >= MINIMO && contraste(LINK, resultante) >= MINIMO) {
      veu = opacidade;
      break;
    }
  }

  console.log(
    arquivo.split('/').pop().padEnd(28),
    'faixas ' + faixas.map(([a, b]) => `${a * 100}-${b * 100}%`).join(' e '),
    ' alvo=' + alvo.toFixed(4),
    '-> veu minimo ' + veu.toFixed(2),
  );
}
