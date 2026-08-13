# BANCADA — Registro de Decisões

## D-001 — Backend

**Decisão:** Firebase é o backend inicial e deve concentrar os serviços.

**Motivo:** reduzir complexidade operacional e custo inicial.

**Status:** aprovado.

---

## D-002 — Servidor próprio

**Decisão:** não haverá servidor próprio.

**Status:** aprovado.

---

## D-003 — Custo

**Decisão:** priorizar o máximo possível o nível gratuito.

**Status:** aprovado.

---

## D-004 — Desenvolvimento

**Decisão:** construir e testar localmente antes de produção.

**Status:** aprovado.

---

## D-005 — Emulator

**Decisão:** Firebase Emulator Suite será o ambiente padrão de desenvolvimento.

**Status:** aprovado.

---

## D-006 — Live

**Decisão:** Live Simulator antes de qualquer infraestrutura real de vídeo.

**Status:** aprovado.

---

## D-007 — Backend externo

**Decisão:** nenhum backend externo será introduzido sem autorização explícita.

**Status:** aprovado.

---

## D-008 — Usuário e papéis

**Decisão:** um usuário pode exercer múltiplos papéis.

**Status:** aprovado.

---

## D-009 — Time

**Decisão:** time é entidade independente do usuário.

**Status:** aprovado.

---

## D-010 — Segurança

**Decisão:** autorização deve ser aplicada no backend/rules, não somente no frontend.

**Status:** aprovado.

---

## D-011 — Arquitetura

**Decisão:** frontend não deve espalhar chamadas Firebase; usar repositories/services.

**Status:** aprovado.

---

## D-012 — Sem Cloud Functions no MVP

**Decisão:** o projeto permanece no plano **Spark (gratuito)**. Cloud Functions não serão usadas.

**Motivo:** Functions exigem o plano Blaze com cartão cadastrado, mesmo com uso zero. A prioridade de custo mínimo (D-003) prevalece.

**Consequências aceitas, registradas para não virarem surpresa:**

1. **Push notification para outro usuário não existe no MVP.** Enviar FCM para terceiro exige servidor. Notificação **dentro do app** funciona: é um documento que o destinatário lê.
2. **Derivação na leitura, não em contador.** Placar é a contagem dos eventos de gol confirmados da partida — 10 a 20 documentos, barato e sem risco de dessincronizar. Nada de campo `homeScore` que alguém atualiza à mão.
3. **Classificação de campeonato fica em aberto.** Agregar dezenas de jogos na leitura é caro. A estratégia será decidida na Fase 8, com dados reais para medir.
4. **Toda escrita vem do cliente**, autorizada pelas Security Rules. Isso torna as Rules a única barreira real — e por isso cada regra precisa de teste (TEST_STRATEGY §3).

**Revisar quando:** a classificação de campeonato ficar cara, ou push virar requisito de produto.

**Status:** aprovado — 12/08/2026.

---

## D-013 — Projeto Firebase reaproveitado

**Decisão:** usar o projeto existente **`bancada-2ce451`**.

**Estado verificado:** zero contas no Auth, Firestore nunca criado, plano Spark. E-mail/senha e Google ativados; SMS desligado; Identity Platform **não** ativado — ativá-lo derrubaria o limite de 50.000 usuários/mês para 3.000/dia.

**Status:** aprovado — 12/08/2026.

---

## D-014 — Apelido é a identidade pública

**Decisão:** o apelido é **obrigatório e único**, e é o rastreio do perfil: busca, exibição e URL pública (`/@apelido`).

**Motivo:** resolve a pendência de username. Os mockups já tratam `@lucasrocha10` e `@resenhafc` como identidade central.

**Consequência:** o cadastro ganha uma etapa de escolha de apelido, com verificação de disponibilidade e lista de nomes reservados (os que colidem com rotas do app).

**Status:** aprovado — 12/08/2026.

---

## D-015 — Perfil público por padrão

**Decisão:** perfil nasce **público**.

**Consequência:** as Security Rules de leitura de perfil liberam qualquer um; restrição é opção do usuário, não o padrão.

**Status:** aprovado — 12/08/2026.

---

# DECISÕES PENDENTES

Estas decisões devem ser confirmadas pelo proprietário antes das partes afetadas:

1. plataformas da primeira publicação: Android apenas ou Android+iOS;
2. **login por apelido ou por e-mail** — o Firebase Auth entra por e-mail; para entrar por apelido o app precisa resolver apelido→e-mail **antes do login**, e sem Functions esse mapa seria público, expondo o e-mail de todos. Opções: (A) apelido para busca/perfil e login por e-mail; (B) login por apelido aceitando os e-mails expostos; (C) login por apelido via Function, exigindo Blaze;
3. ~~username obrigatório ou opcional~~ → **decidido em D-014**;
4. idade mínima e política de menores;
5. ~~perfil público por padrão~~ → **decidido em D-015**;
6. sistema de amizade além de seguir;
7. feed cronológico ou híbrido;
8. regras exatas de campeonato;
9. categorias esportivas;
10. campos obrigatórios do jogador;
11. possibilidade de um jogador estar em vários times simultaneamente;
12. transferência entre times;
13. formato de live real;
14. chat da live;
15. sistema de denúncia;
16. monetização;
17. região inicial do lançamento.

Quando uma pendência for decidida, registrar aqui com data e motivo.
