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

## 6. Navegação — ✅ construída (D-036)

**Redecidida em 01/09/2026 (D-036).** A barra da D-032 foi substituída.

### Barra de baixo — cinco seções, nesta ordem

**HOME · EXPLORAR · ROLLS · MENSAGENS · PERFIL**

Ícone com o rótulo embaixo. A ordem é parte da especificação: é o que a mão
decora, e trocar duas de lugar depois quebra esse aprendizado.

### Barra de cima

```text
[ + ]  BANCADA                        [ sino ]  [ ≡ ]
```

**Sem lupa no topo.** A descoberta é a aba Explorar; ter as duas faria a mesma
função morar em dois lugares. O ícone de Explorar é uma **bússola**, não uma
lupa — e isso saiu do próprio desenho entregue.

### Verde é ativo, cinza é inativo

Vale para os oito ícones, sempre por estado real da aplicação:

| Elemento | Cinza | Verde |
|---|---|---|
| aba comum | não selecionada | selecionada |
| Mensagens | não selecionada e sem nada por ler | selecionada **ou** com mensagem por ler (+ bolinha) |
| sino | nada por ver | tem notificação por ver (+ contador, "9+" acima de nove) |
| `+` | ainda não publicou hoje | já publicou hoje |

### Termos oficiais (D-034)

**MOMENT** (não "story") · **ROLLS** (não "reels") · HOME · EXPLORAR ·
MENSAGENS · PERFIL. Os rótulos vêm de `src/navigation/abas.ts`; nenhuma tela
escreve o nome da seção à mão.

### Assets

Oito ícones × quatro tamanhos (16/24/32/64) × duas cores, em `assets/icones/`,
gerados por `scripts/gerar-icones.mjs`. **Não redesenhar em código, não trocar
por emoji, não importar biblioteca de ícones.** O componente `Icone` escolhe o
arquivo pela densidade da tela: 26 pontos numa tela 3x precisa de 78 pixels, e
serve o de 64 reduzido em vez do de 32 ampliado.

### Espaçamento — mudou em 01/09/2026

A margem lateral caiu de 24 para **14 / 16 / 20 pontos**, por largura de
aparelho (`margemLateral`). Em celular de 360, 24 de cada lado consumia 13% da
tela. Menos margem por fora, mais respiro por dentro dos cartões.

### Estrutura implementada

```text
Tela (fundo · área segura · margem)
 └── CascaDoApp
      ├── BarraSuperior      + · marca · sino · ≡
      ├── conteúdo da aba    Home | Explorar | Rolls | Mensagens | Perfil
      ├── BarraDeAbas        fixa, com o recorte do aparelho por dentro
      └── MenuPrincipal      gaveta pela direita
```

**Trocar de aba não empilha rota.** A pilha continua para o que é um passo
adiante: perfil de outra pessoa, documento legal, notificações. Como rota,
cada toque na barra empilharia uma tela e o botão voltar do Android
desmontaria a barra em ordem inversa.

React Navigation (`native-stack`), tipada em
`src/navigation/RootNavigator.tsx`: rota inexistente vira erro de compilação
em vez de botão que não faz nada. Tema escuro aplicado no próprio navegador,
senão a transição pisca branco.

**A proposta antiga deste documento** (*Início · Explorar · Ao Vivo · Jogos ·
Perfil*) e a da D-032 (*Início · Explorar · [+] · Atividades · Mensagens*)
ficam registradas só como histórico.

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

Cada imagem recebe um véu escuro por cima. Os valores **são medidos** por
`scripts/medir-veu.mjs`, que procura o menor véu em que o texto secundário e o
link ainda alcançam os 4,5:1 que a WCAG exige. Ele roda de novo sempre que uma
arte mudar.

Ele mede a **faixa da imagem onde texto solto de fato cai**, não a imagem
inteira. Nas telas de entrada isso é o meio (35–78% da altura): título,
subtítulo e botões. No app é o topo e o rodapé — marca, rótulos dos Moments,
abas do feed, rótulos da barra de baixo; o resto do conteúdo mora dentro de
cartões opacos.

| Imagem | Véu | Critério |
|---|---:|---|
| Login dia | 0,66 | ver a ressalva abaixo |
| Login noite | 0,66 | ver a ressalva abaixo |
| App retrato | **0,30** | medido 0,29 |
| App paisagem | **0,18** | medido 0,00; o valor é de desenho, não de contraste |

**A arte GRAFIT mudou os números em 01/09/2026.** As artes novas são quase
pretas, com faíscas de um ou dois pixels. O véu antigo (0,46 e 0,67) tinha sido
medido contra as artes anteriores, mais claras; aplicado nestas, a paisagem
virava um retângulo preto — foi exatamente o que apareceu na primeira montagem
em tela larga.

Nelas o critério passou a ser o **percentil 99,95** do brilho, e não o pixel
mais claro. Contra o pixel mais claro, o retrato pediria 0,81 e a arte sumiria.
99,95% da área fica coberta; o que sobra são faíscas menores que uma letra.
É uma troca consciente entre um caso extremo de contraste e a arte existir.

A paisagem fica em 0,18 mesmo sem precisar: a especificação pede que o fundo
"não compita com os posts", e sem véu nenhum a diagonal clara passa por trás
do cartão e disputa a leitura.

> **⚠️ Pendência achada em 01/09/2026, nas telas de entrada.** Medindo com o
> mesmo script, a **foto de dia pede 0,89** de véu na faixa do texto, e a
> **foto de noite pede 0,82** — as duas estão em 0,66. Ou seja, o texto
> secundário sobre elas fica **abaixo** dos 4,5:1 exigidos.
>
> Não foram alteradas aqui de propósito: são telas já aprovadas em teste
> (D-018), e mexer nelas no meio da entrega da navegação misturaria dois
> assuntos. **Fica registrado como correção pendente da Fase 2** — as opções
> são subir o véu (a foto perde muito), escurecer só a faixa do texto com um
> degradê local, ou trocar a foto por uma com o miolo mais escuro.
>
> A tabela antiga afirmava 4,51 e 4,60 para essas duas linhas. O número estava
> errado, não a medição de hoje: ele tinha sido calculado contra a média da
> faixa e não contra o pior ponto dela.

### Duas cores nasceram daí

| Token | Valor | Para quê |
|---|---|---|
| `textOverPhoto` | `#D6D6D6` | Texto secundário **sobre imagem**. O `textMuted` (#9A9A9A) fica em 2,3:1 ali; para ele passar o véu teria que ir a 0,84 e a foto sumiria |
| `greenOverPhoto` | `#B8E9A6` | **Link** sobre imagem. O verde da marca fica em 2,9:1 como texto |

**Nenhuma delas substitui o par original.** Sobre `surface` opaco — dentro de
cartão, campo, caixa de destaque — continuam valendo `textMuted` e `green`, que
lá dão 5,7:1 e mantêm a hierarquia visual. A regra é: *texto sobre imagem usa o
par claro; texto sobre superfície usa o par normal.*
