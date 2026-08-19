/**
 * Converte as imagens originais de `IMAGENS/` para WebP em `assets/`.
 *
 * Por que existe: os originais somam quase 9 MB. Num app que vai ser aberto
 * na beira do campo, com 4G ruim, isso é a diferença entre a tela pintar e a
 * pessoa achar que travou. WebP entrega a mesma imagem por ~5% do peso.
 *
 * Por que os nomes mudam: os originais têm espaço e ponto duplo no nome
 * ("fundo bancada todos os feeds ..png"). Empacotador de app trata caminho
 * com espaço de forma imprevisível, e nome com dois pontos confunde a
 * detecção de extensão. Aqui eles viram kebab-case.
 *
 * Rode depois de trocar qualquer imagem em IMAGENS/:
 *
 *     node scripts/gerar-imagens.mjs
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';

const TRABALHOS = [
  {
    de: 'IMAGENS/fundo bancada log de dia.png',
    para: 'assets/fundos/fundo-login-dia.webp',
    qualidade: 80,
  },
  {
    de: 'IMAGENS/fundo bancada log de noite.png',
    para: 'assets/fundos/fundo-login-noite.webp',
    // A imagem da noite é quase toda preta. Qualidade mais alta porque
    // gradiente escuro é onde a compressão mais aparece: sobra faixa visível
    // em vez de degradê liso.
    qualidade: 88,
  },
  {
    de: 'IMAGENS/fundo bancada todos os feeds ..png',
    para: 'assets/fundos/fundo-app-retrato.webp',
    qualidade: 86,
  },
  {
    de: 'IMAGENS/fundo bancada todos os feeds web.png',
    para: 'assets/fundos/fundo-app-paisagem.webp',
    qualidade: 86,
  },
  {
    de: 'IMAGENS/logo bancada sem fundo.png',
    para: 'assets/marca/logo-bancada.webp',
    // A logo nunca aparece maior que ~200pt de altura. 1536px de largura era
    // 7x mais pixel do que a tela usa -- peso puro, sem ganho visível.
    largura: 900,
    qualidade: 90,
    alfa: true,
  },
];

mkdirSync('assets/fundos', { recursive: true });

const kb = (caminho) => Math.round(statSync(caminho).size / 1024);

let antes = 0;
let depois = 0;

for (const { de, para, qualidade, largura, alfa } of TRABALHOS) {
  let img = sharp(de);
  if (largura) img = img.resize({ width: largura, withoutEnlargement: true });

  await img.webp({ quality: qualidade, alphaQuality: alfa ? 100 : 80, effort: 6 }).toFile(para);

  antes += kb(de);
  depois += kb(para);
  const m = await sharp(para).metadata();
  const reducao = Math.round((1 - kb(para) / kb(de)) * 100);
  console.log(
    `${String(kb(de)).padStart(5)}KB → ${String(kb(para)).padStart(4)}KB  (-${reducao}%)  ` +
      `${m.width}x${m.height}  ${para}`,
  );
}

console.log(`\ntotal: ${antes}KB → ${depois}KB  (-${Math.round((1 - depois / antes) * 100)}%)`);
