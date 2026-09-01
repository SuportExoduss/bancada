# BANCADA — Roadmap

> **Arquivo único.** Substitui os dois roadmaps que existiam separados: este
> documento e os oito arquivos de `prompts/`. Consolidado em 30/08/2026.
>
> O roadmap antigo dizia **o que** fazer. Os prompts diziam **o que não fazer**
> e **como saber que terminou** — e essa metade estava sendo esquecida. As duas
> agora vivem juntas, fase por fase.
>
> Legenda: ✅ pronto · 🔄 em andamento · ⬜ não começou.

---

## Onde estamos: **16,5% do caminho até a publicação**

Ponderado por **esforço**, não por contagem de fases. E **contado contra os
entregáveis de cada fase**, não estimado no olho.

> **01/09/2026 — a soma dos pesos passou de 100 para 104.** A Fase 2.5 (casca
> de navegação) não existia quando os pesos foram distribuídos, e ela é
> trabalho real. Diluir os outros pesos para forçar o total em 100 faria as
> fases prontas parecerem menores do que são. 17,6 sobre 107 é **≈ 16,5%**.
>
> A Fase 3 caiu de 50% para 33% na tabela: era um número estimado, e a
> contagem item a item — agora com curtida, marcação, lembrete e hashtag
> listados — mostrou o tamanho real dela.
>
> A Fase 10 (Mídia) subiu de peso 5 para **8**. Ela era "fotos, vídeos,
> galerias"; passou a carregar também **Moment** e **Rolls**, e Rolls é vídeo
> — com limite de tamanho, transcodagem e custo por gigabyte servido. Isso não
> cabia no peso antigo.

| Fase | Peso | Feito | Contribui |
|---|---:|---:|---:|
| 0 · Especificação | 3 | 100% | 3,0 |
| 1 · Fundação | 5 | **75%** | 3,8 |
| 2 · Auth e Perfil | 7 | **65%** | 4,6 |
| 2.5 · Casca de navegação | 4 | **80%** | 3,2 |
| 3 · Social Core | 9 | 33% | 3,0 |
| 4 · Jogador | 5 | 0% | 0 |
| 5 · Time | 8 | 0% | 0 |
| 6 · Jogo | 9 | 0% | 0 |
| 7 · Motor esportivo | 9 | 0% | 0 |
| 8 · Campeonato | 9 | 0% | 0 |
| 9 · Campos e árbitros | 4 | 0% | 0 |
| 10 · Mídia | **8** | 0% | 0 |
| 11 · Live Simulator | 6 | 0% | 0 |
| 13 · Chat | 4 | 0% | 0 |
| 14 · Administração | 5 | 0% | 0 |
| 15 · Segurança e produção | 6 | 0% | 0 |
| 16 · Beta | 4 | 0% | 0 |
| 17 · Publicação | 2 | 0% | 0 |
| **Total** | **107** | | **≈ 17,6** |

Fase 12 (live real) está fora do MVP. Fases 18 e 19 são pós-publicação.

### O que a consolidação corrigiu

**A Fase 1 estava marcada como 90% e não está.** O prompt dela exige quatro
entregáveis que nunca foram feitos: **Storage Emulator, seed inicial,
configuração por ambiente e lint/format**. São 12 de 16 — 75%.

**A Fase 2 subiu de 50% para 65%**, contada item a item em vez de estimada.

Nos dois casos o erro veio do mesmo lugar: o roadmap listava tópicos soltos e
os critérios de pronto moravam noutro arquivo que ninguém relia.

### Estado hoje

37 commits · 52 arquivos de código · 18 documentos · 10 telas · **5 seções na
barra** · **70 testes automatizados** (55 de regras + 10 de conta + 5 de
seguir) · Firestore em `southamerica-east1`.

> O número de testes estava escrito como 54 e são **70**. Contado rodando
> `npm run testar` em 01/09/2026, não estimado.

```bash
npm run testar          # tudo (precisa de Java 11+)
export JAVA_HOME="/c/Program Files/Android/Android Studio/jbr"
```

---

## Regras que valem para toda fase

Vêm do prompt mestre e do `CLAUDE.md`. Não se repetem em cada fase abaixo.

- **Antes de mexer em código:** ler `CLAUDE.md`, `DECISIONS.md`,
  `ARCHITECTURE.md`, o documento da funcionalidade e `DEFINITION_OF_DONE.md`;
- **`UI → Caso de uso → Repositório → Firebase`.** Tela não fala com o Firebase;
- **Segurança nas Rules**, nunca só no cliente. Sem Cloud Functions (D-012)
  toda escrita vem do cliente, então elas são a única barreira que existe;
- **Sem listener global** de Firestore. Sem lista sem paginação. Sem documento
  gigante;
- **Não implementar o roadmap inteiro de uma vez.** Uma fase avança quando a
  `DEFINITION_OF_DONE` for satisfeita;
- **Decisão de produto não documentada: parar e perguntar** (`CLAUDE.md §12`);
- **Ciclo de conclusão (D-031):** ao terminar algo — perguntar se foi testado,
  marcar aqui, varrer contra regressão, e só então seguir;
- **Adaptação a tamanhos de tela é critério de aceite**, não polimento.

---

# FASE 0 — Especificação ✅

- ✅ produto · personas · domínio · UX · arquitetura
- ✅ decisões **D-001 a D-033** registradas
- ⬜ permissões detalhadas por papel — entram com as telas que as usam

---

# FASE 1 — Fundação 🔄 **75%**

**Objetivo:** projeto React Native + Expo + TypeScript com arquitetura modular
e Emulator Suite.

**Critério de sucesso (do prompt):** *o app inicia localmente, conecta ao
Emulator e tem estrutura pronta para a Fase 2.*

| Entregável | Estado |
|---|---|
| projeto inicial | ✅ Expo SDK 57, RN 0.86, React 19 |
| TypeScript | ✅ `strict` |
| estrutura de diretórios | ✅ nasce conforme o uso (`CLAUDE.md §5`) |
| navegação base | ✅ `native-stack`, tipada |
| tema | ✅ paleta, escala, tipografia, alvo de 44pt |
| componentes base | ✅ Button, Input, Checkbox, TopBar, Fundo, TextoRico |
| configuração Firebase | ✅ |
| Auth Emulator | ✅ |
| Firestore Emulator | ✅ |
| **Storage Emulator** | ⬜ **não configurado** |
| **seed inicial** | ⬜ **não existe** |
| **configuração por ambiente** | ⬜ `__DEV__` decide emulador ou produção; falta projeto de teste separado |
| repository base | ✅ porta + implementação Firestore |
| tratamento de erros base | ✅ `services/erros.ts`, com tradução |
| **lint/format** | ⬜ **ESLint não está instalado**; só `tsc` |
| testes básicos | ✅ 54, contra o emulador |

**Não implementar aqui:** feed completo, campeonato, live real, chat,
marketplace.

---

# FASE 2 — Auth e Perfil 🔄 **65%**

**As telas persistem de verdade desde 23/08.** A D-018 foi cumprida: o primeiro
acesso foi ligado ao Firebase antes de a Fase 3 começar.

| Entregável | Estado |
|---|---|
| cadastro | ✅ cria conta, verificado em produção |
| login | ✅ por e-mail (D-016) |
| logout | ✅ |
| **recuperação de senha** | 🔄 chama `sendPasswordResetEmail`; **ninguém confirmou que o e-mail chega** |
| sessão | ✅ sobrevive ao fechar o app |
| criação de perfil | ✅ nome, sobrenome, apelido, nascimento |
| **edição de perfil** | ⬜ **não existe** |
| **avatar** | ⬜ **não existe** — depende do Storage |
| apelido | ✅ único pelo ID do documento (D-014, D-017); limite na D-030 |
| **privacidade básica** | ⬜ padrão público decidido (D-015), tela não existe. **A D-035 definiu o conteúdo dela:** um interruptor para privar o perfil |
| **perfil privado + pedido de seguir** | ⬜ D-035; o vínculo ganha estado e as Rules passam a ler o perfil do alvo |
| Security Rules | ✅ escritas, testadas e publicadas |
| testes de segurança | ✅ 55 casos |
| **contraste do fundo nas telas de entrada** | ⬜ **achado em 01/09/2026**: o véu está em 0,66 e a medição pede 0,89 (dia) e 0,82 (noite). Detalhe no `DESIGN_SYSTEM` |
| conta de menor | 🔄 nasce ligada ao responsável; **a supervisão (D-025) não existe** |

### Telas construídas

| Tela | Estado |
|---|---|
| Boas-vindas · Para quem · Primeiro a sua conta | ✅ verificadas em produção |
| Criar conta · Onboarding · Conta criada | ✅ criam conta de verdade |
| Entrar | ✅ autentica |
| Termos / Política | ✅ lendo do markdown, com aviso de rascunho |
| Início | 🔄 virou feed na Fase 3 |

**Aprovação (D-018):** o proprietário confirmou os testes do primeiro acesso e
do feed em 30/08/2026. As telas seguem sujeitas a mudança enquanto a fase não
fechar — o que congela é a aprovação de fase, não o teste isolado.

---

# FASE 2.5 — Casca de navegação ✅

Não existia no roadmap. Nasceu da especificação visual de **01/09/2026** e das
decisões **D-034**, **D-035** e **D-036**. Fica entre as Fases 2 e 3 porque é
o esqueleto onde as duas moram: sem ela, cada tela nova inventava o próprio
cabeçalho.

| Entregável | Estado |
|---|---|
| assets oficiais de ícone — 8 × 4 tamanhos × 2 cores | ✅ `assets/icones/`, gerados por script |
| marca do topo com transparência recuperada | ✅ o arquivo veio sem canal alfa |
| fundos GRAFIT novos | ✅ 1,3 MB → 31 KB e 19 KB em WebP |
| barra superior — `+` · marca · sino · hambúrguer | ✅ |
| barra de abas — 5 seções, ícone + rótulo | ✅ |
| estado verde/cinza por dado real | ✅ o `+` consulta `publiqueiHoje` |
| faixa de Moments | 🔄 desenhada e vazia — depende da Fase 10 |
| menu do hambúrguer | 🔄 abre; Campeonatos, Lives e Calendário estão apagados com o motivo |
| Explorar com filtros | 🔄 Perfis funciona; os outros quatro estão desenhados e desligados |
| moldura padrão de tela (`Tela`) | ✅ fundo, área segura e margem num lugar só |
| margem lateral por largura de aparelho | ✅ 14 / 16 / 20 pontos |

**A regra que a fase implementa:** a barra nasce com as cinco posições porque
a ordem dos ícones é o que a mão decora, e mudar de lugar depois quebra esse
aprendizado. O que **não** nasce inteiro é o conteúdo — Rolls e Mensagens
mostram uma tela dizendo o que vão ter e de que fase dependem.

**O que esta fase mexeu no que já existia:**

- `HomeScreen` e `PerfilScreen` deixaram de desenhar fundo, área segura e
  barra própria — quem faz isso agora é a casca. `PerfilScreen` passou a viver
  em dois lugares: aba (sem seta de voltar) e tela empilhada (com);
- `BuscarScreen` virou `ExplorarScreen`, com os filtros no topo;
- a caixa de escrever saiu do cabeçalho fixo do feed e passou a abrir pelo
  `+`. Ela empurrava o primeiro post para fora da tela em toda abertura, e a
  maior parte das aberturas é para ler;
- **Sair** saiu do topo do feed e foi para o menu. Ação rara e definitiva não
  fica a um toque das ações do dia a dia;
- a margem lateral caiu de 24 para 16 pontos em celular comum, a pedido: 24 de
  cada lado tirava 13% da largura de um aparelho de 360.

**Verificado em 01/09/2026, no navegador, com o emulador semeado:** as cinco
abas trocam e pintam o ícone certo; o menu abre e fecha; publicar pelo `+`
grava e **o `+` fica verde na volta**; o post aparece no feed e no perfil; os
filtros do Explorar mostram o cartão de "o que vai ter aqui"; o layout se
comporta em 375×812 e em 1280×760. `npx tsc --noEmit` limpo e **70/70 testes
passando** — sem regressão.

**Dois defeitos achados e corrigidos no caminho:**

1. o `animationType="slide"` do `Modal` deixava o menu inteiro travado em
   `translateY(100%)` no react-native-web — ele abria 812 pontos abaixo do
   topo, fora da tela. Virou `fade`, que além disso é o certo para uma gaveta
   que entra pela lateral;
2. as pílulas de filtro do Explorar esticavam até o fim da coluna e viravam
   cinco faixas de tela inteira — faltava `flexGrow: 0` no `ScrollView`.

**Falta nesta fase:** teste do proprietário no aparelho.

---

# FASE 3 — Social Core 🔄 **33%**

**Do prompt:** *feed simples no início, preferencialmente cronológico. **Não
implementar algoritmo de recomendação complexo.*** A pesquisa de 30/08
(`docs/13-pesquisa/REDES_SOCIAIS.md`) chegou à mesma conclusão por outro
caminho — ranking sem volume produz resultado pior que ordem cronológica.

| Entregável | Estado |
|---|---|
| **post** | ✅ texto até 500, sem edição, só o autor apaga · **testado pelo proprietário em 30/08** |
| **feed** | ✅ cronológico, página de 20 com cursor, puxar para atualizar · **testado pelo proprietário em 30/08** |
| **seguir** | ✅ vínculo pelo ID do documento, abas Tudo/Seguindo, perfil público · **aguardando teste do proprietário** |
| comentário | ⬜ |
| reação | ⬜ |
| notificações básicas | ⬜ **a casca já tem o sino e o contador** (D-036); falta o que contar |
| curtida | ⬜ pré-requisito da notificação "curtiu seu post" |
| marcação de pessoa | ⬜ pedida na especificação da central de notificações |
| lembrete de quem eu sigo | ⬜ live, jogo marcado, publicação — opt-in ao seguir |
| hashtag e busca por assunto | ⬜ é o que liga o filtro **Posts** do Explorar |
| paginação | ✅ |
| sem listener global | ✅ |
| regras de leitura/escrita | ✅ 11 testes |

**Fora desta fase, de propósito:** mídia no post (Fase 10) e time como autor
(Fase 5).

**Busca de pessoas** ✅ — não estava em fase nenhuma e virou pré-requisito
quando "seguir" chegou: até então só dava para achar alguém pelo post dela no
feed, e quem não publicava era invisível. Busca **por prefixo** do apelido;
`rob` acha `roberth`, `berth` não acha. Busca tolerante a erro exigiria serviço
à parte, que o `CLAUDE.md §7` proíbe sem decisão do proprietário.

**Aberto:** a pendência 7 foi reformulada pela D-032 — são abas
(FEED / SEGUINDO), não um algoritmo só.

---

# FASE 4 — Jogador ⬜

**Do prompt (junto com a Fase 5):** perfil esportivo · histórico · estatísticas
· solicitação para time · convite · histórico de vínculo.

**Regra:** permissões verificadas pelas **Security Rules**, não só na tela.

> **A pesquisa sugere antecipar esta fase.** É o candidato natural a "utilidade
> para uma pessoa só" — quem entra sem conhecer ninguém teria o próprio
> histórico para olhar, em vez de um feed vazio.

---

# FASE 5 — Time ⬜

criação · página · dono · administradores · permissões · elenco · conteúdo ·
convite · solicitação · aceitar/recusar.

**Não implementar campeonato aqui.**

**Liga o filtro TIMES do Explorar** — a pílula já está desenhada e desligada.

> **A pesquisa sugere antecipar esta fase, e é o argumento mais forte dela.**
> A rede atômica da várzea é **um time**, não uma cidade. Um time com elenco
> traz onze pessoas de uma vez; um feed sem gente não traz ninguém. O Google+
> perdeu 90% das sessões em menos de cinco segundos por causa da sala vazia.

---

# FASE 6 — Jogo ⬜

criação · agenda · adversário · local · escalação · titulares · reservas ·
capitão · início · eventos · gol · cartões · substituição · placar ·
encerramento.

**Liga duas coisas da casca:** o **Calendário** do menu do hambúrguer — os
eventos do dia de quem a pessoa segue — e o lembrete de "fulano marcou um
jogo" da Fase 3.

**Restrições do prompt, e elas são duras:**

- criar o **motor de transição de status**;
- **não permitir alteração arbitrária do placar pelo cliente** — e sem Cloud
  Functions isso tem que sair das Rules;
- **idempotência** e validações — o mesmo gol registrado duas vezes não pode
  virar dois;
- executar o **teste vertical completo**.

---

# FASE 7 — Motor esportivo ⬜

gols · cartões · substituições · estatísticas · histórico · feed esportivo.

Pela D-012, sem Cloud Functions: **derivar na leitura em vez de manter
contador**. O placar é a contagem dos gols confirmados, não um número guardado
que pode divergir.

---

# FASE 8 — Campeonato ⬜

criação · categorias · inscrições · grupos · rodadas · classificação ·
mata-mata · artilharia.

**Restrições do prompt:**

- **regras de classificação configuráveis**;
- **não assumir um regulamento único** — cada campeonato de várzea tem o seu;
- **criar testes para critérios de desempate.**

**Liga o filtro CAMPEONATOS do Explorar e o item Campeonatos do menu.**

---

# FASE 9 — Campos e árbitros ⬜

venues · árbitros · designações · histórico. *(Sem prompt próprio.)*

---

# FASE 10 — Mídia ⬜

fotos · vídeos · galerias. *(Sem prompt próprio.)*

Depende do **Storage**, que a Fase 1 já pedia e não foi feito. O **avatar** da
Fase 2 também depende daqui.

**Esta fase virou a mais bloqueante do desenho.** A casca de navegação
(Fase 2.5) tem três lugares esperando por ela:

| O que espera | Onde está desenhado | O que falta |
|---|---|---|
| **MOMENT** (D-034) | a faixa de círculos no topo da Home | publicar foto/vídeo que expira, marcar como visto, contar quem viu |
| **ROLLS** (D-034) | a terceira aba, e o filtro Rolls do Explorar | vídeo curto vertical, feed em tela cheia |
| mídia no post | o cartão do feed | foto e vídeo dentro da publicação |

**Ordem sugerida dentro da fase:** Storage e foto no post primeiro — é o que
o avatar da Fase 2 também destrava —, depois Moment, depois Rolls. Rolls é o
mais caro dos três: exige vídeo, e vídeo exige limite de tamanho, transcodagem
e uma política de custo que ainda não existe.

---

# FASE 11 — Live Simulator ⬜

partida · cronômetro · placar · eventos · gols · cartões · substituições ·
**espectadores simulados** · timeline · estado ao vivo · encerramento.

**Objetivo:** validar a experiência de live e o motor de partida **antes** de
qualquer infraestrutura de vídeo. **Não adicionar provedor externo.**

**Liga o item Lives do menu do hambúrguer** e o lembrete de "fulano entrou ao
vivo" da Fase 3.

---

# FASE 12 — Live real ⬜ *(fora do MVP)*

Somente após decisão específica. O Firebase segue para metadados e estado; o
mecanismo de vídeo exige avaliação própria.

**Lembrete legal:** transmitir jogo exige anuência dos **dois times** quando não
há mando definido (Lei 14.597/2023, art. 160 §6º) — decidido na D-023.

---

# FASE 13 — Chat ⬜

DM · grupos · time · partida. *(Sem prompt próprio.)*

**Liga a aba MENSAGENS**, que já existe na barra com a tela de "o que vai ter
aqui". A barra também já sabe desenhar a exceção de estado: com mensagem por
ler o ícone fica verde e ganha bolinha mesmo sem a aba estar selecionada
(D-036).

**Duas restrições que já existem:**

- mensagem privada mantém a proteção do art. 19 do Marco Civil — **exige ordem
  judicial**, ao contrário de conteúdo público;
- a supervisão do menor (D-025) é **por contato, não por conteúdo**: o
  responsável vê com quem o filho fala e bloqueia, mas não lê. E o menor sabe.

---

# FASE 14 — Administração ⬜

dashboard · moderação · denúncias · auditoria. *(Sem prompt próprio.)*

**Parte disto subiu de fase** — ver "obrigações fora do roadmap" abaixo.

---

# FASE 15 — Segurança e preparação para produção ⬜

**Do prompt:** *não publicar automaticamente. Apresentar relatório antes de
qualquer ativação definitiva.*

Auditar: projetos Firebase · regras · Authentication · Storage · **App Check** ·
Analytics · Crashlytics · Performance · notificações · segurança · LGPD ·
**exclusão de conta** · custos · backups · logs · política de mídia · limites de
upload.

---

# FASE 16 — Beta ⬜

poucos usuários · poucos times · primeiros jogos · feedback · correções.

> **Da pesquisa:** o erro mais comum é tratar o lançamento como linha de
> chegada. O pico do dia do lançamento costuma ser a melhor chance de massa
> crítica — e se gasta numa sala vazia. Antes do beta, ter conteúdo dentro.

---

# FASE 17 — Publicação ⬜

publicação · monitoramento · suporte.

---

# FASE 18 — Crescimento ⬜ *(pós-publicação)*

patrocinadores · premium · marketplace · anúncios.

# FASE 19 — IA ⬜ *(pós-publicação)*

Somente quando houver dados e caso de uso comprovado.

---

# Obrigações que não estavam em fase nenhuma

Achadas na pesquisa jurídica de 14/08 e na varredura de 29/08. **Todas precisam
existir antes da publicação**, e várias subiram de fase.

| Item | Onde estava | Onde precisa estar |
|---|---|---|
| **Denúncia de conteúdo** e canal de atendimento | Fase 14 | **antes da publicação** — exigência estrutural da tese do STF de 26/06/2025, independente de porte |
| **App Check** | Fase 15 | **antes do beta** — mitigação do acambarcamento de apelido (D-030) |
| **Verificação de idade** sem autodeclaração | — | Lei 15.211/2025; hoje a data é só declarada |
| **Supervisão do responsável** | — | D-025; o vínculo é gravado, a supervisão não existe |
| **Anuência dos dois times** para transmitir | — | Lei 14.597/2023 (D-023) |
| **Caminho para exercer direitos LGPD** | — | acesso, correção, eliminação, portabilidade |
| **CNPJ da Exoduss Tec** | — | sem parte identificada os termos não podem ser publicados (D-020) |

---

# O que os mockups pedem e o roadmap não previa

Registrado na **D-033**. Nenhum destes tem fase:

**Stories · Níveis e XP · Comunidades · Selo de verificado · Enquete ·
Compartilhar · Trending · Ranking com pontos**

**Stories virou MOMENT e ganhou casa: Fase 10** (D-034). O mesmo vale para
**Rolls**. Sobram sem fase: **Níveis e XP · Comunidades · Selo de verificado ·
Enquete · Compartilhar · Trending · Ranking com pontos**.

A **barra de navegação** foi redecidida na **D-036** —
*HOME · EXPLORAR · ROLLS · MENSAGENS · PERFIL*, com `+` e sino no topo. A
D-032 propunha outra, e foi substituída. A ressalva mudou de forma: a barra
nasce com as **cinco posições**, porque a ordem é o que a mão decora; o que
não nasce inteiro é o **conteúdo**.

---

# O que a pesquisa de redes sociais sugere mudar

Detalhe em `docs/13-pesquisa/REDES_SOCIAIS.md`. Em resumo, quatro pontos —
**todos decisão do proprietário**:

1. **Antecipar a Fase 5 (Time).** A rede atômica é um time, não uma cidade;
2. **Antecipar a Fase 4 (Jogador).** É a resposta para "o que o app faz por
   quem não conhece ninguém";
3. **Confirmar presença · sortear times · mensalidade** não estão em fase
   nenhuma, e são o que todo app brasileiro de várzea resolve
   (Futebolize, FutBora, Partida, Fut7Pro, Meu Ranking);
4. **Algoritmo de feed não entra agora.** Gatilho objetivo para reavaliar:
   quando alguém tiver mais posts novos do que consegue ler numa sessão.

**Limite técnico medido:** o operador `in` do Firestore aceita **30 valores**.
A aba SEGUINDO consulta "posts de quem eu sigo" — até 30 seguidos numa
consulta, acima disso em blocos.
