# BANCADA — INSTRUÇÕES MESTRAS PARA A CLAUDE

## 1. PAPEL DESTE DOCUMENTO

Este é o documento de maior autoridade do projeto BANCADA para desenvolvimento assistido por IA.

Antes de alterar código, a IA deve ler:

1. `CLAUDE.md`
2. `docs/11-decisions/DECISIONS.md`
3. `docs/02-architecture/ARCHITECTURE.md`
4. o documento específico do módulo que será implementado
5. `docs/07-development/DEFINITION_OF_DONE.md`

Se houver conflito entre documentos, a ordem de autoridade é:

1. decisão explícita do usuário na conversa atual;
2. `DECISIONS.md`;
3. `CLAUDE.md`;
4. especificação do módulo;
5. demais documentos;
6. opinião da IA.

Nunca inventar uma decisão importante quando houver conflito. Parar e perguntar.

---

# 2. VISÃO

BANCADA é uma plataforma digital para conectar a várzea:

- torcedores;
- jogadores;
- times;
- campeonatos;
- jogos;
- campos;
- árbitros;
- conteúdo;
- transmissões;
- estatísticas;
- comunidades.

O objetivo não é criar apenas um aplicativo de futebol.

O objetivo é criar um ecossistema em que os acontecimentos esportivos alimentem automaticamente perfis, histórico, estatísticas, feed, notificações e campeonatos.

---

# 3. DECISÕES JÁ TOMADAS

Estas decisões são consideradas aprovadas:

- Backend: Firebase.
- Não haverá servidor próprio.
- Prioridade: custo mínimo.
- Desenvolvimento local antes de produção.
- Firebase Emulator Suite deve ser usado sempre que possível.
- Não construir infraestrutura própria de backend.
- Não introduzir Supabase, PostgreSQL, AWS, Azure ou outro backend sem decisão explícita do proprietário.
- O projeto deve ser modular.
- O frontend não deve espalhar chamadas diretas ao Firebase.
- Segurança deve ser aplicada no servidor/regras, nunca somente no cliente.
- Live de vídeo real não será tratada como requisito do primeiro MVP.
- Primeiro será criado um Live Simulator.
- Não implementar funcionalidades futuras apenas porque estão descritas no roadmap.
- Uma fase só avança quando a definição de pronto for satisfeita.

---

# 4. STACK BASE

Baseline atual:

- React Native
- Expo
- TypeScript
- Firebase
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Cloud Messaging
- Firebase App Check
- Firebase Analytics
- Firebase Crashlytics
- Firebase Performance Monitoring
- Firebase Remote Config
- Cloud Functions somente quando realmente necessárias
- Firebase Emulator Suite durante desenvolvimento

Painel administrativo web poderá ser criado posteriormente.

Não criar uma segunda infraestrutura de backend.

---

# 5. PRINCÍPIO DE IMPLEMENTAÇÃO

Sempre preferir:

`UI -> Use Case/Service -> Repository -> Firebase`

Em vez de:

`UI -> Firebase diretamente`

O código de infraestrutura deve ficar isolado.

Exemplo:

```text
src/
  app/
  components/
  screens/
  navigation/
  domain/
  application/
  infrastructure/
    firebase/
  repositories/
  services/
  hooks/
  state/
  theme/
  utils/
```

---

# 6. REGRA DE OURO

Não desenvolver uma tela isolada.

Toda funcionalidade precisa considerar:

- dados;
- regras;
- permissões;
- loading;
- estado vazio;
- erro;
- validação;
- persistência;
- segurança;
- analytics quando relevante;
- testes.

---

# 7. NÃO FAZER

Não:

- criar servidor próprio;
- criar microserviços sem necessidade;
- criar infraestrutura complexa;
- introduzir banco externo;
- criar duplicações sem fonte de verdade;
- confiar no frontend para autorização;
- criar listeners globais de Firestore sem necessidade;
- carregar listas enormes;
- colocar documentos gigantes no Firestore;
- implementar live de vídeo real no MVP;
- criar IA antes de existir necessidade;
- implementar o roadmap inteiro de uma vez.

---

# 8. FORMA DE TRABALHO

A IA deve trabalhar em pequenos incrementos.

Para cada tarefa:

1. entender o objetivo;
2. localizar documentos relevantes;
3. inspecionar código existente;
4. verificar decisões;
5. propor plano curto;
6. implementar;
7. testar;
8. corrigir;
9. atualizar documentação se necessário;
10. informar arquivos alterados;
11. informar testes executados;
12. informar pendências.

Não reescrever módulos estáveis sem motivo.

---

# 9. NÃO ASSUMIR

Não assumir:

- regras de campeonato;
- permissões;
- critérios de desempate;
- dados obrigatórios;
- comportamento de privacidade;
- monetização;
- provedores externos;
- requisitos legais específicos;
- comportamento de live real.

Se a decisão for importante e não estiver documentada, perguntar.

---

# 10. OBJETIVO DO PRIMEIRO MARCO

O primeiro marco funcional é:

```text
Usuário
 -> Perfil
 -> Jogador
 -> Time
 -> Elenco
 -> Jogo
 -> Escalação
 -> Evento de gol
 -> Placar
 -> Finalização
 -> Estatísticas básicas
 -> Resultado
 -> Feed
 -> Notificação
```

Isso é mais importante que quantidade de telas.

---

# 11. DOCUMENTAÇÃO VIVA

A documentação não é decoração.

Quando uma decisão arquitetural mudar:

- atualizar `DECISIONS.md`;
- atualizar o documento afetado;
- registrar o motivo.

Quando uma funcionalidade for concluída:

- atualizar o status do roadmap;
- registrar testes;
- registrar limitações conhecidas.

---

# 12. CRITÉRIO DE PARADA

Se a implementação exigir uma decisão de produto que não esteja documentada:

**PARAR E PERGUNTAR.**

Não escolher silenciosamente.
