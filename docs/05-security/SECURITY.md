# BANCADA — Segurança

## 1. Princípio

Nunca confiar no cliente.

O cliente solicita.

As regras autorizam.

## 2. Identidade

Toda operação protegida deve validar usuário autenticado.

## 3. Autorização

Exemplos:

### Usuário
Pode editar o próprio perfil.

### Jogador
Pode editar o próprio perfil esportivo.

### Dono/Admin do time
Pode administrar o time conforme permissões.

### Treinador
Pode operar escalação quando autorizado.

### Organizador
Pode administrar o próprio campeonato.

### Administrador BANCADA
Pode moderar segundo privilégios administrativos.

## 4. Firestore Rules

Rules devem ser escritas por domínio e testadas.

Nunca liberar:

```text
allow read, write: if true;
```

em produção.

## 5. Storage Rules

Validar:

- usuário;
- proprietário;
- caminho;
- tipo MIME;
- tamanho;
- contexto.

## 6. App Check

Ativar após estabilização do fluxo básico.

## 7. Dados sensíveis

Minimizar coleta.

Dados pessoais não devem ser públicos por padrão.

## 8. Crianças e menores

O produto deve possuir política específica antes de permitir perfis de menores.

Não inventar requisitos legais. Consultar orientação jurídica quando necessário.

## 9. Auditoria

Operações administrativas e alterações críticas devem possuir trilha de auditoria.

## 10. Ações críticas

Mudança de resultado, exclusão de conteúdo, suspensão, alteração administrativa e eventos oficiais devem possuir proteção adicional quando necessário.

## 11. Abuso

Planejar:

- rate limiting quando necessário;
- bloqueio;
- denúncia;
- moderação;
- proteção contra spam;
- limites de upload.
