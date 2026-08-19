# BANCADA — Operação e Ambientes

## 1. Ambientes

### Local
Firebase Emulator Suite.

### Test
Projeto Firebase separado, quando necessário.

### Production
Projeto Firebase separado.

Nunca misturar dados reais com desenvolvimento.

## 2. Configuração

Nenhuma chave secreta deve ser commitada.

Configurações por ambiente.

## 3. Git

Branches sugeridas:

- main
- develop
- feature/*
- fix/*

A política pode ser adaptada ao fluxo real.

## 4. Commits

Preferir commits pequenos e explicativos.

## 5. Backup

Definir estratégia antes de produção.

## 6. Monitoramento

Usar:

- Crashlytics;
- Performance;
- Analytics;
- logs;
- métricas Firebase.

## 7. Custos

O projeto deve começar priorizando o nível gratuito e o Emulator.

Antes de ativar qualquer recurso potencialmente pago:

1. identificar o motivo;
2. identificar o custo potencial;
3. identificar alternativa;
4. obter decisão do proprietário.

## 8. Blaze

A ativação do Blaze não deve ser automática.

É uma decisão operacional consciente.

Cloud Functions e outros recursos podem exigir faturamento.

## 9. Upload

Impor limites.

Nunca aceitar mídia ilimitada.

## 10. Firestore

Monitorar:

- reads;
- writes;
- deletes;
- listeners;
- storage;
- egress.

## 11. Lançamento

Checklist obrigatório:

- segurança;
- regras;
- analytics;
- crash;
- performance;
- política;
- termos;
- exclusão de conta;
- suporte;
- ambiente production.

---

## Publicação web para teste (Firebase Hosting)

**Desde 18/08/2026** o endereço é **https://bancada.web.app**.

O `bancada` estava livre no Firebase Hosting e foi registrado. O antigo
`bancada-2ce451.web.app` continua no ar servindo o mesmo build, para não
quebrar link já salvo — o `firebase.json` publica nos dois de uma vez.

Também responde em `bancada.firebaseapp.com`, que o Firebase cria junto.

```bash
npx expo export -p web && npx firebase deploy --only hosting
```

O primeiro comando gera `dist/`; o segundo publica. Ambos precisam rodar a
cada mudança — **é build estático, não recarrega sozinho**. Para desenvolver
continua valendo `npx expo start --web`, que tem recarga automática.

Configuração em `firebase.json` (`public: dist`, rewrite de SPA mandando tudo
para `index.html`, cache longo em assets com hash e `no-cache` no
`index.html`) e `.firebaserc` (projeto `bancada-2ce451`).

### O que está publicado é uma casca

As telas validam e navegam, mas **não persistem nada** (D-018). Quem abrir o
link vê um app que não cria conta e não faz login. Isso é esperado nesta fase.

### Custo

Hosting está no plano Spark (gratuito): 10 GB de armazenamento e 360 MB/dia de
transferência. O build inteiro tem ~2 MB. Não muda a decisão D-012 nem exige
Blaze.

### Para tirar do ar

```bash
npx firebase hosting:disable
```

### Pendência conhecida

A logo é um PNG de **1,3 MB** — mais da metade do peso do app. Na primeira
abertura por rede móvel ela demora a pintar e a tela de boas-vindas aparece
com um vazio no lugar dela por um instante. Comprovado na versão publicada.
Resolver com redimensionamento e compressão antes do beta.

---

## Documentos legais dentro do app

Os Termos de Uso e a Política de Privacidade são lidos **dentro** do aplicativo,
tocando nos links da tela de cadastro.

Isso não é conforto de interface: o **art. 46 do CDC** diz que o consumidor não
se vincula a contrato cujo conteúdo não teve oportunidade de conhecer. Termo
atrás de link que não abre é termo que não vale — e quem fica sem contrato é a
plataforma, não o usuário.

### Fonte única

O Markdown de `docs/12-legal/` é a **única fonte de verdade**. O app lê uma
versão gerada a partir dele:

```bash
node scripts/gerar-documentos-legais.mjs
```

**Rode isso sempre que editar um documento legal**, senão o app continua
mostrando a versão anterior. O arquivo gerado
(`src/content/documentosLegais.ts`) não deve ser editado à mão.

O gerador corta o cabeçalho interno — versão, pendências, avisos de equipe —
no primeiro `---`. Tudo acima dele é nota de trabalho e não vai para o app.

### Aviso de rascunho

Enquanto o texto contiver `[A DEFINIR]`, o gerador marca o documento como
rascunho e o app exibe um aviso no topo dizendo que o texto não está em vigor.
Documento com buraco exibido como se fosse final é pior que documento ausente:
a pessoa sai achando que leu o contrato inteiro.

O aviso some sozinho quando a última lacuna for preenchida.

---

## Imagens

Os originais ficam em `IMAGENS/` e **não vão para o app**. O que o app usa são
as versões WebP em `assets/`, geradas por:

```bash
node scripts/gerar-imagens.mjs
```

Rode depois de trocar qualquer original.

### Por que converter

Os cinco originais somavam **9,9 MB**. Em WebP somam **732 KB** — 93% a menos,
sem diferença visível. Num app aberto na beira do campo com 4G ruim, isso é a
diferença entre a tela pintar e a pessoa achar que travou.

| Arquivo | Antes | Depois |
|---|---:|---:|
| Fundo login dia | 2.892 KB | 286 KB |
| Fundo login noite | 2.245 KB | 240 KB |
| Fundo app retrato | 1.650 KB | 30 KB |
| Fundo app paisagem | 1.883 KB | 92 KB |
| Logo | 1.275 KB | 84 KB |

A logo caiu junto e isso fechou uma pendência antiga: ela era o item mais
pesado do app e aparecia com atraso na primeira abertura por rede móvel.

### Nomes

Os originais têm espaço e ponto duplo no nome (`fundo bancada todos os
feeds ..png`). O gerador renomeia para kebab-case: empacotador trata caminho
com espaço de forma imprevisível, e nome com dois pontos confunde a detecção de
extensão.

### O PNG da logo continua no repositório

`assets/marca/logo-bancada.png` não foi apagado de propósito: o `app.json` o usa
para gerar a tela de abertura, e essa geração acontece no build e espera PNG. O
app em si usa o `.webp`.

### Sobre um endereço ainda mais curto

`bancada.web.app` é o menor endereço possível **sem custo**. Encurtar mais
exigiria domínio próprio — `bancada.com.br` ou `bancada.app` — que é pago
(registro anual) e depende de o nome estar disponível.

Se um dia houver domínio, o Firebase Hosting aceita domínio próprio **sem
cobrar nada a mais**, com certificado HTTPS automático, inclusive no plano
Spark. O que se paga é o registro do domínio, não a hospedagem.
