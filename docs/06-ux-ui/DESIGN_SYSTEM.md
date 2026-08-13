# BANCADA — Design System

## 1. Direção visual

Identidade:

- esportiva;
- urbana;
- forte;
- moderna;
- brasileira;
- ligada à cultura da várzea.

Evitar aparência genérica de aplicativo corporativo.

## 2. Cores — **DEFINIDA**

Fechada pelo kit de marca. Implementada em `src/theme/colors.ts`, que é a
fonte de verdade — este documento é o espelho.

| Token | Valor | Uso |
|---|---|---|
| `green` | `#6CC04A` | ação, destaque, ao vivo |
| `greenPressed` | `#5CA83F` | botão pressionado |
| `greenSoft` | verde a 12% | fundo de chip e realce sutil |
| `black` | `#111111` | fundo da aplicação |
| `surface` | `#1A1A1A` | cartões e superfícies elevadas |
| `surfaceHigh` | `#222222` | superfície sobre superfície |
| `border` | `#2A2A2A` | bordas e divisores |
| `text` | `#FFFFFF` | texto principal |
| `textMuted` | `#9A9A9A` | texto de apoio |
| `textOnGreen` | `#111111` | texto sobre o verde |
| `danger` | `#E5484D` | erro e ao vivo |
| `warning` | `#F5A524` | alerta |

**Regra de uso do verde:** ação e destaque. **Nunca fundo de área grande** —
em tela cheia ele cansa a vista e rouba o destaque de quem deveria ter.

Tema **escuro é o único** no v1.

### Escala e tipografia

`src/theme/spacing.ts` — espaçamento em múltiplos de 4 (`xs` 4 … `xxxl` 48),
raios (`lg` 16 é o padrão de botão e cartão) e **`MIN_TOUCH = 44`**.

O alvo de toque de 44pt não é enfeite de acessibilidade: o app vai ser usado
em pé, na beira do campo, com a mão suja e sol na tela.

`src/theme/typography.ts` — fonte do sistema por enquanto. Fonte própria só
quando houver motivo de marca: fonte custa download e atrasa o primeiro
desenho.

## 3. Tipografia

Priorizar legibilidade em celular.

## 4. Componentes base

Nome do componente em **inglês**, texto para o usuário em **português** — é o
padrão que este documento já usava e que o `DOMAIN_MODEL.md` segue.

**Construídos** (`src/components/`):

| | |
|---|---|
| `Button` | variantes `primary`/`secondary`/`ghost`, estado de carregando que **desabilita o toque** — sem isso o toque duplo envia duas vezes, e no motor esportivo isso vira dois gols |
| `Input` | rótulo, revelar senha, erro e dica; o erro tem prioridade sobre a dica |
| `Checkbox` | aceita conteúdo com links no rótulo; expõe `aria-checked` |

**Ainda não construídos** — nascem no módulo que os usar, não antes:

IconButton · Avatar · TeamBadge · Card · MatchCard · TeamCard · PlayerCard ·
ChampionshipCard · PostCard · LiveBadge · Scoreboard · EventTimeline ·
BottomNavigation · Header · Modal · BottomSheet · Toast · Skeleton ·
EmptyState · ErrorState

## 5. Estados obrigatórios

Toda tela que carrega dados deve considerar:

- loading;
- sucesso;
- vazio;
- erro;
- offline quando aplicável.

## 6. Navegação inicial — ⚠️ **CONFLITO ABERTO**

Este documento propõe:

```text
Início · Explorar · Ao Vivo · Jogos · Perfil
```

Os **mockups do proprietário** mostram outra coisa:

```text
Início · Explorar · [ + ] · Atividades · Mensagens
```

São incompatíveis, e a diferença não é cosmética: a barra dos mockups tem um
botão central de **criar**, não tem **Ao Vivo** nem **Jogos**, e tem
**Mensagens** — que o `ROADMAP.md` só entrega na **FASE 13**.

Se a barra nascer como nos mockups, ela nasce com dois botões que não levam a
lugar nenhum por meses. **Decisão pendente do proprietário**; até lá, a
navegação vai crescendo com as telas que existem de verdade.

### Navegação implementada hoje

Pilha de primeiro acesso, sem barra inferior ainda:

```text
BoasVindas → Cadastro → Onboarding
```

React Navigation (`native-stack`), tipada em
`src/navigation/RootNavigator.tsx`: rota inexistente vira erro de compilação
em vez de botão que não faz nada. Tema escuro aplicado no próprio navegador,
senão a transição pisca branco.

## 7. Acessibilidade

Considerar:

- tamanho de toque;
- contraste;
- labels;
- leitores de tela;
- feedback não apenas visual;
- tamanho de fonte.

## 8. Regra

Não criar estilos isolados sem necessidade.

Componentes reutilizáveis devem formar o sistema visual.
