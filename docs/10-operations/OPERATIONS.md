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

**Desde 14/08/2026** as telas ficam acessíveis em
**https://bancada-2ce451.web.app** — para o proprietário testar de qualquer
lugar, sem depender de IP e porta na rede local.

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
