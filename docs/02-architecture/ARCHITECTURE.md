# BANCADA — Arquitetura

## 1. Objetivo

Construir uma aplicação modular usando Firebase como backend gerenciado, sem servidor próprio.

## 2. Arquitetura lógica

```text
React Native / Expo
        |
        v
Presentation
        |
        v
Application / Use Cases
        |
        v
Domain
        |
        v
Repositories / Services
        |
        v
Firebase
 |       |       |       |
Auth  Firestore Storage  FCM
```

Serviços auxiliares Firebase:

- App Check
- Analytics
- Crashlytics
- Performance
- Remote Config
- Functions quando necessário

## 3. Camadas

### Presentation
Telas, componentes, navegação e estado visual.

### Application
Casos de uso.

Exemplos:

- CreateTeam
- JoinTeam
- CreateMatch
- RecordGoal
- FinishMatch

### Domain
Regras e modelos independentes do Firebase.

### Infrastructure
Implementação dos repositórios Firebase.

## 4. Regra de dependência

UI não conhece detalhes de Firestore.

Domain não conhece Firestore.

Infrastructure conhece Firebase.

## 5. Eventos de domínio

Ações esportivas importantes devem ser tratadas como eventos.

Exemplos:

- MATCH_CREATED
- MATCH_STARTED
- GOAL_SCORED
- CARD_ISSUED
- SUBSTITUTION_MADE
- MATCH_FINISHED

No começo, não criar um event bus complexo. Modelar os eventos corretamente e usar Functions somente quando a automação realmente exigir backend.

## 6. Fonte de verdade

Cada entidade deve possuir uma fonte oficial.

Exemplo:

`teams/{teamId}` é fonte oficial dos dados do time.

Documentos de partidas podem manter snapshots para leitura, mas não substituem a entidade oficial.

## 7. Idempotência

Operações críticas devem poder ser protegidas contra duplicação.

Exemplo:

Registrar o mesmo gol duas vezes não pode gerar duas estatísticas por acidente.

## 8. Offline

O aplicativo deve aproveitar o suporte offline do Firestore quando apropriado, mas ações críticas não devem ser consideradas oficiais apenas porque foram gravadas localmente.

## 9. Performance

Prioridades:

- paginação;
- consultas específicas;
- listeners somente onde necessários;
- documentos pequenos;
- imagens otimizadas;
- agregações controladas;
- evitar fan-out desnecessário.

## 10. Live

Firebase pode armazenar:

- estado da partida;
- eventos;
- espectadores;
- chat;
- metadados;
- sinalização se futuramente for usada WebRTC.

Firebase não deve ser tratado como servidor de distribuição de vídeo em massa.

O primeiro Live será um simulador.

Vídeo real será uma decisão futura.
