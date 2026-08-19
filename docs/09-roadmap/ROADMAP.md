# BANCADA — Roadmap

> **Status atualizado em 19/08/2026.** Legenda: ✅ pronto · 🔄 em andamento ·
> ⬜ não começou. Uma fase só avança quando a `DEFINITION_OF_DONE` for
> satisfeita (`CLAUDE.md §3`).

## Onde estamos: **8,5% do caminho até a publicação**

O número é ponderado por **esforço**, não por contagem de fases — a Fase 0 tem
19 fases depois dela, mas pesa muito menos que a Fase 6 sozinha.

| Fase | Peso | Feito | Contribui |
|---|---:|---:|---:|
| 0 · Especificação | 3 | 98% | 2,9 |
| 1 · Fundação | 5 | 50% | 2,5 |
| 2 · Auth e Perfil | 7 | 45% | 3,1 |
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
| **Total** | **100** | | **≈ 8,5** |

Fase 12 (live real) está fora do MVP por decisão. Fases 18 e 19 são posteriores
à publicação e não entram na conta.

**Andou 1,5 ponto desde 14/08** — quatro telas viraram oito, os documentos
legais existem e são legíveis dentro do app, as regras de idade estão
implementadas e as telas ganharam fundo. Nada disso persiste.

**Por que ainda é pouco:** o motor esportivo, o time, o jogo e o campeonato
somam 35 dos 100 pontos e não começaram. E a Fase 2, apesar de oito telas,
está em 45% porque a metade que falta é a que guarda os dados.

### Estado hoje, em números

19 commits · 30 arquivos de código · ~4.500 linhas · 14 documentos · 8 telas ·
build de 1,6 MB · **0 conexões com o Firebase**.

### O que falta que **não** estava no roadmap

A pesquisa jurídica de 14/08/2026 (`docs/12-legal/TERMOS_PESQUISA.md`)
encontrou obrigações que o roadmap não previa e que precisam existir **antes da
publicação**, não na Fase 14:

- ⬜ **denúncia de conteúdo** e **canal de atendimento** — exigência estrutural
  da tese do STF de 26/06/2025, não depende de porte;
- 🔄 **verificação de idade** — a data de nascimento é coletada e as faixas são
  aplicadas, mas ainda é declarada. A Lei 15.211/2025 exige mecanismo
  confiável; falta a parte que confirma;
- 🔄 **vinculação de conta de menor a responsável** — o fluxo existe e funciona
  na tela; falta o vínculo persistido e a supervisão de contatos (D-025);
- ⬜ **anuência dos dois times** para transmitir jogo — Lei 14.597/2023,
  art. 160 §6º;
- ✅ **telas de Termos e Política** legíveis dentro do app — CDC art. 46;
- ⬜ **caminho para exercer direitos LGPD** (acesso, correção, eliminação,
  portabilidade);
- ⬜ **CNPJ da Exoduss Tec** — sem parte identificada os termos não podem ser
  publicados (D-020).

## FASE 0 — Especificação ✅

- ✅ produto · personas · domínio · UX · arquitetura
- ✅ decisões D-001 a D-027 registradas
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
| Boas-vindas | 🔄 congelada em 12/08, mas alterada depois: SafeAreaView correta e fundo |
| Entrar | 🔄 aguardando aprovação · sem persistência |
| Para quem é a conta | 🔄 aguardando aprovação |
| Primeiro, a sua conta | 🔄 aguardando aprovação |
| Criar conta | 🔄 aguardando aprovação · sem persistência |
| Onboarding | 🔄 aguardando aprovação · sem persistência |
| Conta criada | 🔄 aguardando aprovação · nada foi criado de verdade |
| Termos / Política | ✅ funcionando, lendo do markdown |

O fluxo visual de primeiro acesso está **fechado**: as oito telas existem, se
ligam entre si e cobrem os dois caminhos — conta própria e conta de menor
criada pelo responsável.

**Nenhuma fala com o Firebase.** É o próximo passo, e pela D-018 ele tem que
acontecer antes de o M1 fechar. Avançar para a Fase 3 com a Fase 2 sem backend
não é aceitável.

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
