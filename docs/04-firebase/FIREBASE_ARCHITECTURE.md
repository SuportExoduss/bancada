# BANCADA — Arquitetura Firebase

## 1. Serviços

### Authentication
Identidade.

### Firestore
Banco.

### Storage
Mídia.

### FCM
Push.

### App Check
Proteção.

### Analytics
Eventos.

### Crashlytics
Estabilidade.

### Performance
Desempenho.

### Remote Config
Configuração remota.

### Functions
Somente backend server-side necessário.

## 2. Coleções principais

```text
/users/{userId}
/profiles/{userId}
/playerProfiles/{userId}

/teams/{teamId}
/teamMemberships/{membershipId}
/teamInvitations/{invitationId}
/teamJoinRequests/{requestId}

/matches/{matchId}
/matches/{matchId}/events/{eventId}
/matches/{matchId}/lineups/{lineupId}

/championships/{championshipId}
/championships/{championshipId}/categories/{categoryId}
/championships/{championshipId}/teams/{teamId}
/championships/{championshipId}/groups/{groupId}
/championships/{championshipId}/rounds/{roundId}

/posts/{postId}
/posts/{postId}/comments/{commentId}

/follows/{followId}
/notifications/{notificationId}

/venues/{venueId}

/conversations/{conversationId}
/conversations/{conversationId}/messages/{messageId}

/reports/{reportId}
/blocks/{blockId}
/auditLogs/{logId}
```

A estrutura final pode ser ajustada quando consultas reais forem definidas.

## 3. Regras de modelagem

- Não usar arrays gigantes para relações.
- Não depender de joins inexistentes.
- Modelar para as consultas que realmente serão feitas.
- Usar IDs estáveis.
- Paginar feeds.
- Evitar documentos que crescem indefinidamente.
- Usar timestamps server-side quando a operação exigir autoridade.

## 4. Storage

Estrutura sugerida:

```text
users/{userId}/avatar/
users/{userId}/media/

teams/{teamId}/badge/
teams/{teamId}/media/

posts/{postId}/media/

matches/{matchId}/media/

championships/{championshipId}/media/
```

Arquivos devem possuir regras de tamanho e tipo.

## 5. Functions

Usar Functions para:

- operações que não podem ser confiadas ao cliente;
- automações;
- notificações;
- agregações;
- tarefas assíncronas;
- limpeza;
- processamento.

Não criar Functions para cada operação simples.

## 6. Custos

O sistema deve ser projetado para reduzir:

- leituras;
- gravações;
- listeners;
- downloads de mídia;
- processamento;
- funções.

Antes de adicionar uma consulta, perguntar:

1. quantos documentos ela lê?
2. com que frequência?
3. pode ser paginada?
4. pode ser agregada?
5. pode ser cacheada?

## 7. Emulator

Desenvolvimento padrão:

- Auth Emulator
- Firestore Emulator
- Storage Emulator
- Functions Emulator quando necessário

Dados de seed devem ser reproduzíveis.
