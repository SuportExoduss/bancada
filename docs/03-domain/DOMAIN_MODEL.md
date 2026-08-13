# BANCADA — Modelo de Domínio

## 1. Entidades principais

```text
User
Profile
PlayerProfile

Team
TeamMembership
TeamInvitation
TeamJoinRequest

Championship
ChampionshipCategory
ChampionshipTeam
Group
Round
Standing

Match
Lineup
MatchPlayer
MatchEvent

Venue
Referee
RefereeAssignment

Post
Comment
Reaction
Follow
Media

Live
LiveViewer

Notification

Conversation
ConversationMember
Message

Report
Block
ModerationAction
AuditLog
```

## 2. User

Identidade técnica.

Campos conceituais:

- id
- email/phone/provider identifiers conforme autenticação
- createdAt
- status

Não armazenar senha própria.

## 3. Profile

Identidade social.

- userId
- **firstName** — nome
- **lastName** — sobrenome
- username — **o apelido; obrigatório e único (D-017)**
- avatar
- cover
- bio
- city
- state
- privacy
- createdAt
- updatedAt

> **Nome e sobrenome são separados** por decisão do proprietário (D-017). A
> versão anterior deste documento previa um `displayName` único.

### Unicidade do apelido

O Firestore não impõe unicidade em campo — só o **ID do documento** é único.
Por isso existe a coleção espelho:

```text
apelidos/{apelido}  →  { uid, criadoEm }
```

O apelido **é** o ID. Verificar disponibilidade é **uma leitura por ID**, e não
varredura da coleção: varrer custaria uma leitura por usuário cadastrado, e
ficaria mais caro a cada conta nova.

A garantia real está na **escrita**: a Security Rule só autoriza criar
`apelidos/{apelido}` se o documento ainda não existir. A checagem enquanto a
pessoa digita é apenas uma dica — entre ver "disponível" e salvar, outra
pessoa pode pegar.

Guardado sempre em **minúsculas**, sem espaços nas pontas.

## 4. PlayerProfile

Extensão esportiva.

- userId
- position
- preferredFoot
- jerseyNumber
- category
- height opcional
- weight opcional
- birthDate com política de privacidade
- active
- createdAt
- updatedAt

## 5. Team

- teamId
- name
- username
- badge
- cover
- description
- city
- state
- neighborhood opcional
- status
- ownerId
- createdAt
- updatedAt

## 6. TeamMembership

Relação entre jogador/usuário e time.

- teamId
- userId
- role
- status
- joinedAt
- leftAt
- permissions

## 7. Match

- matchId
- homeTeamId
- awayTeamId
- championshipId opcional
- categoryId opcional
- venueId opcional
- scheduledAt
- status
- homeScore
- awayScore
- currentPeriod
- createdBy
- createdAt
- updatedAt

## 8. MatchEvent

Evento oficial ou pendente.

- eventId
- matchId
- type
- teamId opcional
- playerId opcional
- relatedPlayerId opcional
- minute
- period
- occurredAt
- source
- validationStatus
- createdBy
- createdAt

## 9. Lineup

- matchId
- teamId
- starters
- substitutes
- captainId
- formation opcional
- confirmedAt

## 10. Championship

- championshipId
- name
- organizerId
- logo
- description
- rules
- startDate
- endDate
- status

## 11. Standing

Representação de classificação.

- championshipId
- categoryId
- groupId opcional
- teamId
- played
- wins
- draws
- losses
- goalsFor
- goalsAgainst
- goalDifference
- points
- position

## 12. Social

Post:

- postId
- authorId
- authorType
- text
- media
- visibility
- createdAt
- updatedAt

Comment:

- commentId
- postId
- authorId
- text
- createdAt

Follow:

- followerId
- targetId
- targetType
- createdAt

## 13. Notification

- notificationId
- recipientId
- type
- actorId opcional
- entityType
- entityId
- payload mínimo
- readAt
- createdAt

## 14. Status

Estados devem ser enums controlados e documentados.

Não espalhar strings arbitrárias pelo código.
