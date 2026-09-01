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

Baseline atual — **versões instaladas em 12/08/2026**:

| | Versão | Observação |
|---|---|---|
| Expo | **57.0.12** | SDK 57 |
| React Native | **0.86.2** | |
| React | **19.2.3** | |
| TypeScript | **6.0.3** | `strict` ligado |
| React Navigation | **7.3.16** | `native-stack` 7.18.8 |

Resto do baseline:

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

**Pasta nasce quando é usada, não antes.** Diretório vazio é ruído: quem abre
o projeto não sabe se está vazio porque não é usado ou porque alguém esqueceu.

Existem hoje: `assets/` · `components/` · `content/` · `domain/` · `hooks/` ·
`infrastructure/firebase/` · `navigation/` · `repositories/` · `screens/` ·
`services/` · `state/` · `theme/`.

Faltam, e entram quando o primeiro caso de uso pedir: `app/` ·
`application/` · `utils/`.

Duas nasceram fora da lista de exemplo, e o motivo fica registrado:
`content/` guarda os documentos legais gerados a partir do markdown, e
`assets/` guarda as tabelas de `require` dos arquivos de imagem — o Metro só
resolve caminho literal, então a tabela tem que ser código.

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

## 8.1 Ciclo de conclusão (D-031)

Concluir um item **não** é o fim dele. Ao terminar qualquer coisa:

1. **perguntar ao proprietário se está testado** — verificação da IA não
   substitui teste no aparelho dele;
2. **marcar no roadmap** com o estado real;
3. **varrer o projeto contra regressão**: `npx tsc --noEmit`, `npm run testar`,
   e conferir se a documentação continua verdadeira sobre o código;
4. **só então seguir**.

O passo 3 é o que escapa: os testes passam com a documentação mentindo. Já
aconteceu de o roadmap afirmar "nenhuma tela fala com o Firebase" seis dias
depois de todas falarem.

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
