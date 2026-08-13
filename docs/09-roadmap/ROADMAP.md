# BANCADA — Roadmap

> **Status atualizado em 12/08/2026.** Legenda: ✅ pronto · 🔄 em andamento ·
> ⬜ não começou. Uma fase só avança quando a `DEFINITION_OF_DONE` for
> satisfeita (`CLAUDE.md §3`).

## FASE 0 — Especificação ✅

- ✅ produto · personas · domínio · UX · arquitetura
- ✅ decisões D-001 a D-018 registradas
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
- ⬜ login — tela não existe
- ⬜ logout
- ⬜ recuperação de senha
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
| Entrar | ⬜ não existe |

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
