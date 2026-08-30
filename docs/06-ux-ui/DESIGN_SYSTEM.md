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

## 6. Navegação inicial — ✅ resolvida (D-032)

**Resolvido em 30/08/2026 (D-032).** O conflito entre este documento e os
mockups acabou: vale a dos mockups.

**Início · Explorar · [+] · Atividades · Mensagens**

O `[+]` central é publicar, em destaque verde. A proposta antiga deste
documento (*Início · Explorar · Ao Vivo · Jogos · Perfil*) fica registrada só
como histórico.

**A barra nasce com o que existe e cresce.** Mensagens é Fase 13; Atividades
depende de notificações. Item que não leva a lugar nenhum é pior que item
ausente.

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

---

## Fundos de tela

**Decidido em 18/08/2026.** As telas não têm mais fundo de cor sólida.

| Onde | Imagem |
|---|---|
| Entrar, cadastro e todo o primeiro acesso | Foto da quadra — **troca com a hora**: dia das 6h às 17h59, noite das 18h às 5h59 |
| Todo o resto — feed, perfil, jogo, documentos | Arte da marca, em duas proporções: retrato no celular em pé, paisagem deitado |

O componente é `src/components/Fundo.tsx`, com `variante="auth"` ou `"app"`.

> **Tela nova nasce com `variante="app"`.** A foto é exceção, reservada ao
> primeiro acesso. Feed, perfil, time, jogo, campeonato, mensagens e
> configurações usam a arte (D-027).
A orientação é medida pela **própria caixa** (`onLayout`), não pela janela: num
tablet em tela dividida as duas não coincidem.

### O véu, e por que estes números

Cada imagem recebe um véu escuro por cima. Os valores **foram medidos**, não
escolhidos a olho — amostrando os pixels de cada imagem e procurando o menor
véu em que o texto secundário ainda alcança os 4,5:1 que a WCAG exige, contra
o **pixel mais claro** da imagem.

| Imagem | Véu | Branco | Secundário | Link verde |
|---|---:|---:|---:|---:|
| Login dia | 0,66 | 6,56 | 4,51 | 4,76 |
| Login noite | 0,66 | 6,69 | 4,60 | 4,86 |
| App retrato | 0,46 | 6,97 | 4,79 | 5,06 |
| App paisagem | 0,67 | 6,75 | 4,64 | 4,90 |

Duas descobertas que a medição trouxe e que a intuição erraria:

**A foto da noite precisa do mesmo véu da foto de dia.** Ela parece escura,
mas os refletores da quadra são quase brancos, e é sobre eles que uma frase
pode cair. Com véu leve o texto ficava em 2,99:1 — ilegível justamente em cima
da luz.

**A arte de paisagem precisa de bem mais véu que a de retrato** (0,67 contra
0,46), pelo mesmo motivo: ela tem o estouro do refletor no canto superior.

### Duas cores nasceram daí

| Token | Valor | Para quê |
|---|---|---|
| `textOverPhoto` | `#D6D6D6` | Texto secundário **sobre imagem**. O `textMuted` (#9A9A9A) fica em 2,3:1 ali; para ele passar o véu teria que ir a 0,84 e a foto sumiria |
| `greenOverPhoto` | `#B8E9A6` | **Link** sobre imagem. O verde da marca fica em 2,9:1 como texto |

**Nenhuma delas substitui o par original.** Sobre `surface` opaco — dentro de
cartão, campo, caixa de destaque — continuam valendo `textMuted` e `green`, que
lá dão 5,7:1 e mantêm a hierarquia visual. A regra é: *texto sobre imagem usa o
par claro; texto sobre superfície usa o par normal.*
