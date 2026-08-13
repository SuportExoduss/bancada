# BANCADA — Operação e Ambientes

## 1. Ambientes

### Local
Firebase Emulator Suite.

### Test
Projeto Firebase separado, quando necessário.

### Production
Projeto Firebase separado.

Nunca misturar dados reais com desenvolvimento.

## 2. Configuração

Nenhuma chave secreta deve ser commitada.

Configurações por ambiente.

## 3. Git

Branches sugeridas:

- main
- develop
- feature/*
- fix/*

A política pode ser adaptada ao fluxo real.

## 4. Commits

Preferir commits pequenos e explicativos.

## 5. Backup

Definir estratégia antes de produção.

## 6. Monitoramento

Usar:

- Crashlytics;
- Performance;
- Analytics;
- logs;
- métricas Firebase.

## 7. Custos

O projeto deve começar priorizando o nível gratuito e o Emulator.

Antes de ativar qualquer recurso potencialmente pago:

1. identificar o motivo;
2. identificar o custo potencial;
3. identificar alternativa;
4. obter decisão do proprietário.

## 8. Blaze

A ativação do Blaze não deve ser automática.

É uma decisão operacional consciente.

Cloud Functions e outros recursos podem exigir faturamento.

## 9. Upload

Impor limites.

Nunca aceitar mídia ilimitada.

## 10. Firestore

Monitorar:

- reads;
- writes;
- deletes;
- listeners;
- storage;
- egress.

## 11. Lançamento

Checklist obrigatório:

- segurança;
- regras;
- analytics;
- crash;
- performance;
- política;
- termos;
- exclusão de conta;
- suporte;
- ambiente production.
