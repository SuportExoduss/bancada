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

## Onde estamos: **14% do caminho até a publicação**

Ponderado por **esforço**, não por contagem de fases. E agora **contado contra
os entregáveis de cada fase**, não estimado no olho — foi o que mudou o número.

| Fase | Peso | Feito | Contribui |
|---|---:|---:|---:|
| 0 · Especificação | 3 | 100% | 3,0 |
| 1 · Fundação | 5 | **75%** | 3,8 |
| 2 · Auth e Perfil | 7 | **65%** | 4,6 |
| 3 · Social Core | 9 | 33% | 3,0 |
| 4 · Jogador | 5 | 0% | 0 |
| 5 · Time | 8 | 0% | 0 |
| 6 · Jogo | 9 | 0% | 0 |
| 7 · Motor esportivo | 9 | 0% | 0 |
| 8 · Campeonato | 9 | 0% | 0 |
| 9 · Campos e árbitros | 4 | 0% | 0 |
| 10 · Mídia | 5 | 0% | 0 |
| 11 · Live Simulator | 6 | 0% | 0 |
| 13 · Chat | 4 | 0% | 0 |
| 14 · Administração | 5 | 0% | 0 |
| 15 · Segurança e produção | 6 | 0% | 0 |
| 16 · Beta | 4 | 0% | 0 |
| 17 · Publicação | 2 | 0% | 0 |
| **Total** | **100** | | **≈ 14** |

Fase 12 (live real) está fora do MVP. Fases 18 e 19 são pós-publicação.

### O que a consolidação corrigiu

**A Fase 1 estava marcada como 90% e não está.** O prompt dela exige quatro
entregáveis que nunca foram feitos: **Storage Emulator, seed inicial,
configuração por ambiente e lint/format**. São 12 de 16 — 75%.

**A Fase 2 subiu de 50% para 65%**, contada item a item em vez de estimada.

Nos dois casos o erro veio do mesmo lugar: o roadmap listava tópicos soltos e
os critérios de pronto moravam noutro arquivo que ninguém relia.

### Estado hoje

35 commits · 41 arquivos de código · ~6.000 linhas · 18 documentos · 9 telas ·
**54 testes automatizados** · Firestore em `southamerica-east1` · 2 contas
reais.

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
| **privacidade básica** | ⬜ padrão público decidido (D-015), tela não existe |
| Security Rules | ✅ escritas, testadas e publicadas |
| testes de segurança | ✅ 44 casos |
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

# FASE 3 — Social Core 🔄 **33%**

**Do prompt:** *feed simples no início, preferencialmente cronológico. **Não
implementar algoritmo de recomendação complexo.*** A pesquisa de 30/08
(`docs/13-pesquisa/REDES_SOCIAIS.md`) chegou à mesma conclusão por outro
caminho — ranking sem volume produz resultado pior que ordem cronológica.

| Entregável | Estado |
|---|---|
| **post** | ✅ texto até 500, sem edição, só o autor apaga · **testado pelo proprietário em 30/08** |
| **feed** | ✅ cronológico, página de 20 com cursor, puxar para atualizar · **testado pelo proprietário em 30/08** |
| seguir | ⬜ **próximo item** — sem ele a aba SEGUINDO não existe |
| comentário | ⬜ |
| reação | ⬜ |
| notificações básicas | ⬜ |
| paginação | ✅ |
| sem listener global | ✅ |
| regras de leitura/escrita | ✅ 11 testes |

**Fora desta fase, de propósito:** mídia no post (Fase 10) e time como autor
(Fase 5).

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

> **A pesquisa sugere antecipar esta fase, e é o argumento mais forte dela.**
> A rede atômica da várzea é **um time**, não uma cidade. Um time com elenco
> traz onze pessoas de uma vez; um feed sem gente não traz ninguém. O Google+
> perdeu 90% das sessões em menos de cinco segundos por causa da sala vazia.

---

# FASE 6 — Jogo ⬜

criação · agenda · adversário · local · escalação · titulares · reservas ·
capitão · início · eventos · gol · cartões · substituição · placar ·
encerramento.

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

---

# FASE 9 — Campos e árbitros ⬜

venues · árbitros · designações · histórico. *(Sem prompt próprio.)*

---

# FASE 10 — Mídia ⬜

fotos · vídeos · galerias. *(Sem prompt próprio.)*

Depende do **Storage**, que a Fase 1 já pedia e não foi feito. O **avatar** da
Fase 2 também depende daqui.

---

# FASE 11 — Live Simulator ⬜

partida · cronômetro · placar · eventos · gols · cartões · substituições ·
**espectadores simulados** · timeline · estado ao vivo · encerramento.

**Objetivo:** validar a experiência de live e o motor de partida **antes** de
qualquer infraestrutura de vídeo. **Não adicionar provedor externo.**

---

# FASE 12 — Live real ⬜ *(fora do MVP)*

Somente após decisão específica. O Firebase segue para metadados e estado; o
mecanismo de vídeo exige avaliação própria.

**Lembrete legal:** transmitir jogo exige anuência dos **dois times** quando não
há mando definido (Lei 14.597/2023, art. 160 §6º) — decidido na D-023.

---

# FASE 13 — Chat ⬜

DM · grupos · time · partida. *(Sem prompt próprio.)*

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

E a **barra de navegação** foi decidida na D-032 —
*Início · Explorar · [+] · Atividades · Mensagens* — com a ressalva de que
**nasce com o que existe e cresce**.

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
