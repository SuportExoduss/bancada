# Definition of Done

Uma funcionalidade só está PRONTA quando:

## Produto
- requisito compreendido;
- comportamento definido;
- casos de erro definidos.

## UI
- tela implementada;
- loading;
- vazio;
- erro;
- sucesso;
- **adaptação a tamanhos de tela — ver abaixo**;
- acessibilidade básica.

### Adaptação a tamanhos de tela

Critério de aceite de **toda** tela, não polimento opcional. Verificar nestes seis tamanhos:

| Tamanho | Representa |
|---|---|
| 320×568 | celular pequeno (iPhone SE) — o caso mais apertado |
| 375×812 | celular padrão |
| 430×932 | celular grande |
| 768×1024 | tablet retrato |
| 812×375 | **celular em paisagem** — onde quase tudo quebra |
| 1024×600 | tablet paisagem |

Em todos eles:

- [ ] nada é cortado nas bordas (elemento com posição negativa é falha);
- [ ] **as ações principais ficam alcançáveis** — visíveis sem rolar, ou com rolagem que funcione;
- [ ] não existe rolagem horizontal;
- [ ] o conteúdo não estica: acima de ~440px de largura ele é limitado e centralizado, senão o app parece um site esticado;
- [ ] alvo de toque de no mínimo 44pt em qualquer tamanho;
- [ ] texto não fica ilegível nem quebra em lugar errado.

Ferramentas: o hook `useLayout` (`src/hooks/useLayout.ts`) entrega `isLandscape`, `isCompactWidth`, `isShortHeight`, `isWide` e o teto de largura. Usar `useWindowDimensions`, **nunca** `Dimensions.get()` — este lê uma vez e congela, e girar o aparelho deixa o layout com as medidas antigas.

Em paisagem, quando a altura apertar, o que sai primeiro é o elemento decorativo. **Botão de ação nunca sai.**

## Dados
- modelo definido;
- persistência implementada;
- índices/consultas necessários avaliados.

## Firebase
- repository/service implementado;
- emulator testado;
- regras implementadas.

## Segurança
- autenticação;
- autorização;
- validação;
- regras de Storage quando houver mídia.

## Testes
- unit quando houver regra;
- integration quando houver Firebase;
- E2E para fluxo crítico.

## Qualidade
- sem logs de debug indevidos;
- sem segredos no código;
- sem código morto relevante;
- tratamento de erros.

## Observabilidade
- analytics quando fizer sentido;
- crash/performance considerados.

## Documentação
- documentação do módulo atualizada;
- decisão registrada se houver mudança.

## Entrega
A IA deve informar:
- arquivos alterados;
- o que foi feito;
- testes executados;
- resultado;
- pendências.
