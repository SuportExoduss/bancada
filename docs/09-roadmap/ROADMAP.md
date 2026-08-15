# BANCADA — Roadmap

> **Status atualizado em 14/08/2026.** Legenda: ✅ pronto · 🔄 em andamento ·
> ⬜ não começou. Uma fase só avança quando a `DEFINITION_OF_DONE` for
> satisfeita (`CLAUDE.md §3`).

## Onde estamos: **7% do caminho até a publicação**

O número é ponderado por **esforço**, não por contagem de fases — a Fase 0 tem
19 fases depois dela, mas pesa muito menos que a Fase 6 sozinha.

| Fase | Peso | Feito | Contribui |
|---|---:|---:|---:|
| 0 · Especificação | 3 | 95% | 2,9 |
| 1 · Fundação | 5 | 50% | 2,5 |
| 2 · Auth e Perfil | 7 | 30% | 2,1 |
| 3 · Social Core | 9 | 0% | 0 |
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
| **Total** | **100** | | **≈ 7,5** |

Fase 12 (live real) está fora do MVP por decisão. Fases 18 e 19 são posteriores
à publicação e não entram na conta.

**Por que 7% e não mais, se existem quatro telas prontas?** Porque nenhuma
delas persiste nada. A parte visível do trabalho é a que engana: o fluxo de
primeiro acesso inteiro pesa 7 dos 100 pontos, e está em 30% deles. O motor
esportivo, o time, o jogo e o campeonato somam 35 pontos e não começaram.

### Estado hoje, em números

10 commits · 19 arquivos de código · ~2.100 linhas · 12 documentos · 4 telas ·
0 conexões com o Firebase.

### O que falta que **não** estava no roadmap

A pesquisa jurídica de 14/08/2026 (`docs/12-legal/TERMOS_PESQUISA.md`)
encontrou obrigações que o roadmap não previa e que precisam existir **antes da
publicação**, não na Fase 14:

- ⬜ **denúncia de conteúdo** e **canal de atendimento** — exigência estrutural
  da tese do STF de 26/06/2025, não depende de porte;
- ⬜ **verificação de idade** sem autodeclaração e **vinculação de conta de
  menor de 16 a responsável** — Lei 15.211/2025, em vigor desde 17/03/2026;
- ⬜ **anuência dos dois times** para transmitir jogo — Lei 14.597/2023,
  art. 160 §6º;
- ⬜ **telas de Termos e Política** legíveis dentro do app — CDC art. 46: termo
  que a pessoa não teve como conhecer não vincula;
- ⬜ **caminho para exercer direitos LGPD** (acesso, correção, eliminação,
  portabilidade).

Esses itens estão computados como parte das Fases 2, 6, 10 e 15 e já estão
refletidos no percentual acima.

## FASE 0 — Especificação ✅

- ✅ produto · personas · domínio · UX · arquitetura
- ✅ decisões D-001 a D-019 registradas
- ⬜ permissões detalhadas por papel — entram com as telas que as usam

## FASE 1 — Fundação 🔄

- ✅ criar projeto — Expo SDK 57, RN 0.86, React 19
- ✅ TypeScript `strict`
- ✅ estrutura de pastas — nasce conforme o uso (`CLAUDE.md §5`)
- ✅ tema — paleta da marca, escala, tipografia, alvo de toque 44pt
- ✅ navegação — React Navigation `native-stack`, tipada
- 🔄 repositories — a **porta** existe (`ApelidoRepository`); a implementação
  é em memória, temporária
- ⬜ **Firebase** — não conectado
- ⬜ **Emulator Suite** — não configurado
- ⬜ configuração de ambientes

## FASE 2 — Auth e Perfil 🔄

**As telas existem e validam; nenhuma persiste ainda** (ver D-018).

- 🔄 cadastro — tela pronta com validação completa; **não cria conta**
- 🔄 login — tela pronta, por e-mail (D-016); **não autentica**
- ⬜ logout
- ⬜ recuperação de senha — o link "Esqueci minha senha" existe na tela e está
  inerte: recuperação é `sendPasswordResetEmail` do Firebase Auth, que ainda
  não está conectado
- 🔄 perfil — onboarding com nome, sobrenome e apelido; **não salva**
- ⬜ avatar
- 🔄 apelido — regra de unicidade implementada e verificada, contra
  repositório em memória (D-014, D-017)
- ⬜ privacidade — padrão público decidido (D-015), não implementado

### Telas construídas

| Tela | Estado |
|---|---|
| Boas-vindas | ✅ aprovada pelo proprietário e **congelada** |
| Criar conta | 🔄 aguardando aprovação · sem persistência |
| Onboarding | 🔄 aguardando aprovação · sem persistência |
| Entrar | 🔄 aguardando aprovação · sem persistência |

O fluxo visual de primeiro acesso está **fechado**: as quatro telas existem e
se ligam entre si. Nenhuma fala com o Firebase ainda — é o próximo passo, e
pela D-018 ele tem que acontecer antes de o M1 fechar.

## FASE 3 — Social Core

- seguir
- post
- feed
- comentário
- reação
- notificações

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
