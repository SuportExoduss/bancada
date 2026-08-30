# BANCADA — Roadmap

> **Status atualizado em 30/08/2026.** Legenda: ✅ pronto · 🔄 em andamento ·
> ⬜ não começou. Uma fase só avança quando a `DEFINITION_OF_DONE` for
> satisfeita (`CLAUDE.md §3`).

## Onde estamos: **13% do caminho até a publicação**

Ponderado por **esforço**, não por contagem de fases.

| Fase | Peso | Feito | Contribui |
|---|---:|---:|---:|
| 0 · Especificação | 3 | 100% | 3,0 |
| 1 · Fundação | 5 | 90% | 4,5 |
| 2 · Auth e Perfil | 7 | 50% | 3,5 |
| 3 · Social Core | 9 | 22% | 2,0 |
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
| **Total** | **100** | | **≈ 13** |

Fase 12 (live real) está fora do MVP. Fases 18 e 19 são pós-publicação.

**Saltou para 13%** com o começo da Fase 3: publicar e ler o feed. A Fundação
está em 90% (falta separar ambiente de teste do de produção) e o Firebase
inteiro — banco em São Paulo, Rules testadas, contas de verdade — já está no
lugar.

A Fase 3 está em 22% porque post e feed são dois dos seis itens dela, e os
outros quatro (seguir, comentário, reação, notificações) não começaram.

**A Fase 2 está em 50%, não mais.** As oito telas funcionam de ponta a ponta e
foram verificadas em produção por duas pessoas reais. O que segura são coisas
que não existem: logout de outros aparelhos, avatar, tela de privacidade,
recuperação de senha confirmada, e a supervisão do responsável (D-025), que
hoje é promessa escrita e não função.

### Estado hoje

33 commits · 41 arquivos de código · ~6.000 linhas · 15 documentos · 9 telas ·
**54 testes automatizados** (44 de regras + 10 de conta) · Firestore em
`southamerica-east1` · 2 contas reais criadas por testadores.

### Testes

```bash
npm run testar          # tudo
npm run testar:regras   # só as Security Rules
npm run testar:conta    # só o fluxo de conta
```

Precisa de Java 11+ para o emulador. O PATH tem o 8; o JBR do Android Studio
tem o 21:

```bash
export JAVA_HOME="/c/Program Files/Android/Android Studio/jbr"
```

### O que a varredura de 29/08 mudou

- 🔄 **acambarcamento de apelido** — fechado para quem tem perfil, aberto para
  quem nunca completa o cadastro. As regras do Firestore não conseguem exprimir
  "um apelido por pessoa" (D-030). Mitigação: **App Check antes do beta**;
- ✅ código morto removido, nomes de coleção com fonte única.

### O que falta e **não** estava no roadmap

- ⬜ **denúncia de conteúdo** e **canal de atendimento** — exigência estrutural
  da tese do STF de 26/06/2025, independente de porte;
- ⬜ **App Check** — sobe da Fase 15 para antes do beta (D-030);
- 🔄 **verificação de idade** — a data é coletada e as faixas aplicadas, mas
  ainda é declarada. A Lei 15.211/2025 exige mecanismo confiável;
- 🔄 **supervisão do responsável** — o vínculo é gravado; ver contatos e
  bloquear ainda não existe (D-025);
- ⬜ **anuência dos dois times** para transmitir (Lei 14.597/2023, art. 160 §6º);
- ✅ **Termos e Política** legíveis dentro do app (CDC art. 46);
- ⬜ **caminho para exercer direitos LGPD**;
- ⬜ **CNPJ da Exoduss Tec** — sem parte identificada os termos não podem ser
  publicados (D-020).

### Revisão de 30/08/2026 contra a pesquisa de redes sociais

A pesquisa (`docs/13-pesquisa/REDES_SOCIAIS.md`) levantou quatro pontos que
mexem com a ordem do roadmap. Nenhum deles é urgente; todos são decisão do
proprietário.

**1. A rede atômica da BANCADA é um time, não uma cidade.**

O feed vazio é o maior risco do produto — o Google+ perdeu 90% das sessões em
menos de cinco segundos porque as pessoas chegavam numa sala vazia. O jeito
conhecido de resolver é construir a menor rede que funciona sozinha: onze a
vinte pessoas que já se conhecem.

Isso é **criar time e chamar o elenco**, que é a **Fase 5**. Hoje ela está
depois de Social Core e Jogador. Vale perguntar se não deveria vir antes: um
time com elenco traz onze pessoas de uma vez; um feed sem gente não traz
ninguém.

**2. O que os apps brasileiros de várzea resolvem não está no roadmap.**

Futebolize, FutBora, Partida, Fut7Pro e Meu Ranking giram todos em torno de
**confirmar presença · sortear times · controlar mensalidade**. Nenhum dos três
aparece em fase alguma daqui.

A BANCADA está posicionada como rede social; eles resolvem organização. São
dores diferentes: rede social responde "o que está acontecendo na várzea";
eles respondem "quem vai jogar domingo e quanto cada um deve" — que é dor
semanal e concreta.

**Não é argumento para virar app de pelada.** É aviso de que a dor que traz
gente para dentro pode não ser a mesma que a visão descreve.

**3. Falta responder o que o app faz por quem não conhece ninguém.**

Hoje: nada. Ele vê um feed vazio. Produtos que venceram a sala vazia tinham
utilidade para uma pessoa só — o Pinterest servia para você organizar suas
coisas antes de servir de rede.

Para a BANCADA, o candidato natural é **o próprio histórico e as estatísticas**
(Fases 4 e 7). Se elas viessem antes, quem entra sozinho já teria o que fazer.

**4. Algoritmo de feed não entra agora, e o gatilho é objetivo.**

Ranking existe para escolher o que mostrar quando há mais conteúdo do que cabe.
Com 2 usuários, ordenar é resolver problema que não existe.

**Gatilho para reavaliar:** quando alguém tiver mais posts novos do que
consegue ler numa sessão. Aí entra decaimento no estilo Hacker News — cinco
linhas, sem servidor — e depois peso de relacionamento. Aprendizado de máquina
não entra nesta década do projeto.

### O que a pesquisa confirmou que já estava certo

- **montar o feed na leitura** — é o que fazemos, e sem Cloud Functions é o
  único caminho que não exige abrir as Security Rules;
- **feed cronológico agora** — correto até haver volume;
- **página de 20 com cursor** — evita o custo de carregar tudo;
- **seguir como próximo item** — sem ele a aba SEGUINDO não existe.

### Um limite técnico medido, que vale registrar

O operador `in` do Firestore aceita **no máximo 30 valores** — medido contra o
emulador, porque a documentação de quotas não traz o número. A aba SEGUINDO
consulta "posts de quem eu sigo": até 30 seguidos cabe numa consulta; acima
disso é preciso dividir em blocos. Quem segue 100 gera 4 consultas por página.

Não é problema hoje. É o ponto onde reavaliar a arquitetura, e agora está
escrito.

## FASE 0 — Especificação ✅

- ✅ produto · personas · domínio · UX · arquitetura
- ✅ decisões D-001 a D-033 registradas
- ⬜ permissões detalhadas por papel — entram com as telas que as usam

## FASE 1 — Fundação 🔄

- ✅ criar projeto — Expo SDK 57, RN 0.86, React 19
- ✅ TypeScript `strict`
- ✅ estrutura de pastas — nasce conforme o uso (`CLAUDE.md §5`)
- ✅ tema — paleta da marca, escala, tipografia, alvo de toque 44pt
- ✅ navegação — React Navigation `native-stack`, tipada
- ✅ repositories — porta e implementação do Firestore
- ✅ **Firebase** — SDK, Auth e Firestore em `southamerica-east1`
- ✅ **Emulator Suite** — configurado, com 54 testes rodando contra ele
- ✅ **Security Rules** — escritas, testadas e publicadas
- ⬜ configuração de ambientes — hoje é `__DEV__` decidindo entre emulador e
  produção; falta separar projeto de teste do de produção

## FASE 2 — Auth e Perfil 🔄

**As telas persistem de verdade desde 23/08.** A D-018 foi cumprida: o fluxo
de primeiro acesso está ligado ao Firebase antes de a Fase 3 começar.

- ✅ cadastro — cria conta de verdade, verificado em produção
- ✅ login — por e-mail (D-016), com sessão que sobrevive ao fechar o app
- ✅ logout
- 🔄 recuperação de senha — o link chama `sendPasswordResetEmail` de verdade,
  mas **ninguém confirmou que o e-mail chega**. Até alguém receber, não conta
- ✅ perfil — nome, sobrenome, apelido e nascimento gravados no Firestore
- ⬜ avatar
- ✅ apelido — unicidade garantida pelo banco: o ID do documento é o apelido
  (D-014, D-017). Ver D-030 para o limite conhecido
- 🔄 conta de menor — nasce ligada ao responsável; a supervisão em si (D-025)
  ainda não existe
- ⬜ privacidade — padrão público decidido (D-015), não implementado

### Telas construídas

| Tela | Estado |
|---|---|
| Boas-vindas | ✅ verificada em produção |
| Para quem é a conta | ✅ verificada em produção |
| Primeiro, a sua conta | ✅ verificada em produção |
| Criar conta | ✅ **cria conta de verdade** |
| Onboarding | ✅ **grava perfil e reserva apelido**, em lote atômico |
| Conta criada | ✅ verificada nos dois caminhos |
| Entrar | ✅ **autentica**, com sessão que sobrevive ao fechar o app |
| Termos / Política | ✅ lendo do markdown, com aviso de rascunho |
| Início | 🔄 **provisória** — é o lugar do Feed (Fase 3) |

As nove telas se ligam entre si e cobrem os dois caminhos: conta própria e
conta de menor criada pelo responsável.

**A D-018 foi cumprida.** As telas foram ligadas ao Firebase antes de a Fase 3
começar, que era o prazo. O fluxo inteiro foi verificado em produção — inclusive
o caminho do responsável, onde a sessão do pai não cai ao criar a do filho, e a
retomada de conta órfã da D-024.

Nenhuma tela foi formalmente **aprovada** pelo proprietário no sentido da D-018
(aprovada congela). Duas pessoas testaram e não relataram problema, mas o
caminho do responsável e o ciclo sair/entrar não foram exercitados por elas.

## FASE 3 — Social Core 🔄

- ⬜ seguir
- ✅ **post** — texto até 500 caracteres, sem edição (a regra nega `update`);
  só o autor apaga
- ✅ **feed** — cronológico, página de 20 com cursor, puxar para atualizar
- ⬜ comentário
- ⬜ reação
- ⬜ notificações

**Fora desta fatia, de propósito:** mídia no post (Fase 10) e time como autor
(Fase 5). O `DOMAIN_MODEL` prevê `media` e `authorType`; os dois entram quando
existirem de verdade.

**Aberto:** a pendência 7 (feed cronológico ou híbrido) continua. Cronológico
é o único implementável hoje — híbrido precisa de seguidores, reações e
histórico de leitura, que não existem.

## FASE 4 — Jogador

- perfil esportivo
- histórico
- estatísticas
- solicitação para time
- convite

## FASE 5 — Time

- criação
- página
- dono
- administradores
- permissões
- elenco
- conteúdo

## FASE 6 — Jogo

- criação
- agenda
- adversário
- local
- escalação
- início
- eventos
- placar
- encerramento

## FASE 7 — Motor esportivo

- gols
- cartões
- substituições
- estatísticas
- histórico
- feed esportivo

## FASE 8 — Campeonato

- criação
- categorias
- inscrições
- grupos
- rodadas
- classificação
- mata-mata
- artilharia

## FASE 9 — Campos e árbitros

- venues
- árbitros
- designações
- histórico

## FASE 10 — Mídia

- fotos
- vídeos
- galerias

## FASE 11 — Live Simulator

- live
- cronômetro
- eventos
- placar
- espectador
- chat simulado

## FASE 12 — Live real

Somente após decisão específica.

Firebase continuará sendo usado para metadados e estado. O mecanismo de vídeo real exigirá avaliação técnica própria.

## FASE 13 — Chat

- DM
- grupos
- time
- partida

## FASE 14 — Administração

- dashboard
- moderação
- denúncias
- auditoria

## FASE 15 — Segurança e preparação de produção

- App Check
- Rules finais
- Crashlytics
- Performance
- Analytics
- backups/exportações conforme estratégia
- LGPD
- políticas

## FASE 16 — Beta

- poucos usuários
- poucos times
- primeiros jogos
- feedback
- correções

## FASE 17 — Produção

- publicação
- monitoramento
- suporte

## FASE 18 — Crescimento

- patrocinadores
- premium
- marketplace
- anúncios

## FASE 19 — IA

Somente quando houver dados e caso de uso comprovado.
