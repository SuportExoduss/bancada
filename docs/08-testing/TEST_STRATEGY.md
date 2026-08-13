# BANCADA — Estratégia de Testes

## 1. Pirâmide

### Unit
Regras puras.

Exemplos:

- classificação;
- validação de gol;
- permissões;
- transições de status.

### Integration
Firebase Emulator.

Testar:

- Auth;
- Firestore;
- Storage;
- Functions.

### E2E
Jornada do usuário.

## 2. Fluxo crítico obrigatório

```text
signup
login
create profile
create player
create team
invite player
accept invitation
create match
create lineup
start match
record goal
verify score
finish match
verify statistics
verify result
verify feed item
verify notification
```

## 3. Segurança

Testar explicitamente:

- usuário A não edita perfil de B;
- jogador não administra time sem permissão;
- membro não altera dados administrativos sem permissão;
- usuário não lê dados privados de outro;
- upload indevido é bloqueado.

## 4. Dados

Testes devem ser reproduzíveis.

Usar seeds para cenários.

## 5. Regressão

Toda correção importante deve gerar teste para evitar retorno do bug.
