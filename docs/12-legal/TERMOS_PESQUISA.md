# BANCADA — Pesquisa: Termos de Uso e Política de Privacidade

> **Pesquisa feita em 14/08/2026.** Este documento é insumo técnico, **não é
> parecer jurídico**. Nada aqui substitui a revisão de um advogado antes de
> publicar. O que ele faz é reduzir a conta do advogado: chega nele com as
> decisões tomadas e as perguntas certas, em vez de uma folha em branco.

---

## PARTE 1 — A conclusão principal, antes de tudo

A pergunta era "quais termos precisam ser aceitos". A resposta curta é:

**Um só documento é aceito. O resto é informado ou consentido separadamente.**

| Documento | Como entra | Por quê |
|---|---|---|
| **Termos de Uso** | **Aceite ativo** (caixa desmarcada) | É contrato. Sem aceite não há vínculo. |
| **Política de Privacidade** | **Ciência**, não aceite | Ver Parte 2. Transformar em "aceite" **piora** a posição da BANCADA. |
| **Diretrizes da Comunidade** | Dentro dos Termos, por referência | É a regra de conduta que sustenta a moderação. |
| **Uso de imagem em divulgação** | **Consentimento separado, opcional** | Finalidade específica, prazo, revogável. Nunca embutido. |
| **Comunicações de marketing** | **Opt-in separado** | Não é necessário para o serviço funcionar. |
| **Autorização de transmissão de jogo** | **No momento do jogo**, pelos times | Direito de arena. Ver Parte 4. |
| **Termos de aposta** | Não existe, e não deve existir tão cedo | Ver Parte 6. |

O erro que quase todo app brasileiro comete é juntar tudo numa caixa só:
"li e aceito os Termos e a Política de Privacidade". Parece mais seguro. É
menos.

---

## PARTE 2 — Por que a Política de Privacidade **não** deve ser "aceita"

Este é o ponto menos óbvio da pesquisa e o de maior consequência prática.

A LGPD tem **dez** bases legais (art. 7º). O consentimento é **uma** delas, e a
ANPD é explícita em dizer que ele não é hierarquicamente superior às outras. Um
erro comum é pedir consentimento onde a base correta seria outra.

Para a BANCADA, quase tudo que o app faz com dado pessoal se apoia em
**execução de contrato** (art. 7º, V): guardar o perfil, mostrar o apelido,
registrar quem fez gol, montar o elenco do time. A pessoa pediu isso ao criar a
conta. Não é favor que ela concede — é o serviço que ela contratou.

**A diferença prática é brutal:**

- Se a base é **contrato**: a pessoa pode encerrar a conta, mas não pode exigir
  que a BANCADA pare de registrar o gol dela e mantenha o serviço funcionando.
- Se a base é **consentimento**: o consentimento é revogável **a qualquer
  momento, por procedimento gratuito e facilitado**. Alguém revoga e a
  plataforma tem que parar o tratamento — sem base para continuar.

Ou seja: pedir consentimento para o que já é execução de contrato dá ao
usuário um botão de desligar que a lei não obrigava a dar, e deixa a BANCADA
sem base legal quando ele for apertado.

**Conclusão firme:** a Política de Privacidade é um **aviso** — cumpre o direito
de informação do art. 9º. Deve ser fácil de achar e ler, e a tela de cadastro
deve dizer "ao criar a conta você concorda com os Termos de Uso e declara ter
lido a Política de Privacidade". O consentimento fica reservado para o que é
realmente opcional.

---

## PARTE 3 — Responsabilidade por conteúdo de terceiro (o que mais mudou)

Em **26/06/2025** o STF julgou os Temas 533 e 987 e declarou o **art. 19 do
Marco Civil parcialmente inconstitucional** (8×3). O regime anterior — a
plataforma só respondia depois de descumprir ordem judicial — acabou.

**O que passou a valer:**

| Situação | O que a BANCADA precisa fazer |
|---|---|
| Conteúdo grave (terrorismo, atos antidemocráticos, incitação a suicídio e automutilação, discurso de ódio, crime sexual contra vulnerável, tráfico de pessoas, pornografia infantil) | **Remover por dever de cuidado**, sem esperar denúncia. Omissão vira "falha sistêmica". |
| Conteúdo impulsionado ou pago | Mesma coisa — dever de cuidado reforçado. |
| Crime contra a honra (calúnia, injúria, difamação) | Continua exigindo ordem judicial para responsabilizar, mas **admite remoção por notificação extrajudicial**. |
| Réplica de conteúdo já declarado ilícito | Remover as cópias **sem nova decisão judicial**, a partir de notificação. |
| Mensagem privada / DM | Mantém a proteção original do art. 19 — **exige ordem judicial**. Isso importa para a Fase 13 (chat). |

A responsabilidade **não é objetiva**: é preciso demonstrar falha de conduta ou
omissão sistêmica. Modulação: vale para fatos futuros.

**Obrigações estruturais que a tese impõe** — e que não têm nada a ver com
tamanho da plataforma:

1. sistema de notificação e devido processo (quem foi moderado precisa poder
   recorrer);
2. **canal de atendimento acessível** a usuários e a terceiros;
3. relatório anual de transparência;
4. representação jurídica no Brasil com poderes plenos.

**Consequência para o produto:** o item 2 não é texto de contrato, é
**funcionalidade**. Denúncia de conteúdo e canal de contato precisam existir no
app. Hoje não existem, e não estão no roadmap antes da Fase 14. Isso é uma
lacuna real a resolver antes da publicação.

---

## PARTE 4 — Imagem: o maior risco específico da BANCADA

Nenhuma das plataformas pesquisadas tem este problema no grau que a BANCADA
tem. Facebook e Instagram hospedam foto que a pessoa mesma postou. A BANCADA
quer **transmitir jogo** e **gerar estatística de terceiros** — inclusive de
quem não instalou o app.

### 4.1 Direito de arena

A Lei Geral do Esporte (**Lei 14.597/2023**, arts. 159–160) dá o direito de
arena à **organização esportiva mandante** — o direito privativo de autorizar
ou proibir captação, transmissão e reprodução de imagens do evento.

E o art. 160, §6º resolve exatamente o caso da várzea: **quando não há mando de
jogo definido, a captação e a transmissão dependem da anuência das organizações
esportivas participantes** — ou seja, **dos dois times**.

**Conclusão:** transmitir um jogo na BANCADA exige o "sim" dos dois times, não
de um. Isso é regra de produto, não só cláusula: a tela de criar transmissão
precisa de um aceite do time adversário.

### 4.2 Direito de imagem individual

É direito **separado** do de arena e pertence à pessoa, não ao time. O time
autorizar a transmissão **não** autoriza usar o rosto do jogador num anúncio.

**Súmula 403 do STJ:** *"Independe de prova do prejuízo a indenização pela
publicação não autorizada de imagem de pessoa com fins econômicos ou
comerciais."* Dano moral presumido — não é preciso provar sofrimento. Basta o
uso comercial sem autorização.

Há uma mitigação relevante: uso **incidental**, como coadjuvante, em conteúdo
informativo, não gera indenização por si só. Um jogador ao fundo da imagem de
um jogo é diferente do rosto dele num cartaz da BANCADA.

**Conclusão:** os Termos podem cobrir a exibição do conteúdo **dentro da
plataforma** (é o serviço). **Não podem** cobrir uso publicitário da imagem —
isso exige consentimento separado, específico e revogável.

### 4.3 Autorização genérica não vale

A pesquisa é convergente e dura neste ponto: **autorizações genéricas, de prazo
indeterminado e desvinculadas de finalidade específica não se sustentam nem no
Código Civil, nem na LGPD, nem no ECA Digital.**

Isso mata a cláusula que quase todo termo brasileiro tem — "você autoriza o uso
da sua imagem para qualquer fim, em caráter irrevogável e por prazo
indeterminado". Ela é nula e ainda sinaliza má-fé.

**O que uma autorização válida precisa ter:** finalidade específica · prazo
determinado · forma de uso descrita · **revogabilidade** · registro do aceite.

---

## PARTE 5 — Menores: deixou de ser escolha

**Lei 15.211/2025 (ECA Digital)** — sancionada em 17/09/2025, **em vigor desde
17/03/2026**. Fiscalização da ANPD.

**Aplica-se a** qualquer produto ou serviço de TI voltado a crianças e
adolescentes **ou de acesso provável por esse público**. Futebol de várzea tem
categoria de base e adolescente jogando. A BANCADA está dentro — não há como
argumentar o contrário de boa-fé.

**O que a lei exige:**

- **Autodeclaração de idade é vedada.** O "clique aqui se tem mais de 18" não
  serve mais.
- Verificação por **mecanismos confiáveis, proporcionais, auditáveis e
  tecnicamente seguros**. "Proporcional" é a palavra que salva uma plataforma
  pequena: não exige o mesmo aparato da Meta, mas exige mais que um campo de
  data de nascimento.
- **Menor de 16 anos só acessa rede social com a conta vinculada à de um
  responsável legal**, com consentimento verificável e controles parentais.
- Relatório semestral de transparência **só para quem tem mais de 1 milhão de
  usuários menores** — a BANCADA não chega perto disso tão cedo.
- Princípio expresso de **minimização**: não usar a verificação como desculpa
  para coletar mais dado.

**Sanções:** advertência · multa de até 10% do faturamento do grupo no Brasil,
limitada a R$ 50 milhões por infração · suspensão ou proibição da atividade.

**Conclusão:** a pendência "idade mínima e política de menores" deixou de ser
uma decisão livre do proprietário e virou uma escolha entre dois caminhos, os
dois legítimos — ver Parte 8.

---

## PARTE 6 — Apostas: a conclusão é "não", e por um bom tempo

Registrado porque foi perguntado, e para não voltar à pauta por engano.

**Lei 14.790/2023** e Portaria SPA/MF 827/2024 exigem, para operar aposta de
quota fixa:

- autorização prévia da Secretaria de Prêmios e Apostas do Ministério da
  Fazenda;
- **outorga de até R$ 30 milhões**;
- comprovação de experiência prévia em jogos/apostas no grupo de controle;
- serviço de atendimento ao apostador e **ouvidoria** estruturados;
- infraestrutura de tecnologia robusta;
- proibição absoluta de menores de 18 anos;
- ações de prevenção ao jogo patológico.

Isso não é "uma feature". É outra empresa, outro CNPJ, outro capital.

**Mas há uma consequência que atinge a BANCADA hoje, mesmo sem apostar.**

Desde **17/07/2026** valem novas regras de publicidade de apostas. Entre as
vedações:

- promover operador **não autorizado**, inclusive por link, código promocional
  ou **mecanismo de afiliação**;
- apresentar aposta como renda, investimento ou solução de dificuldade;
- e — o que mais interessa aqui — **comentaristas, especialistas e analistas
  não podem usar autoridade técnica para recomendar apostas específicas durante
  eventos esportivos**, sendo vedada a divulgação de estratégias e análises
  capazes de influenciar aposta em determinado jogo ou mercado.

A BANCADA vai ter transmissão, estatística e comentário de usuário sobre jogo
acontecendo. É exatamente o cenário descrito. Multas de até R$ 14 milhões pela
Senacon para quem veicula publicidade irregular.

**Conclusão:** os Termos precisam **proibir expressamente** que o usuário
promova casas de aposta, publique link de afiliado ou dê palpite de aposta em
jogo da plataforma. Não é sobre um dia apostar — é sobre não ser corresponsável
pela publicidade de outra pessoa.

---

## PARTE 7 — O que as plataformas pesquisadas fazem

### Estrutura, e o que dá para aproveitar

**Meta (Facebook/Instagram)** — cinco seções: serviços que fornecemos · como
somos financiados · seu compromisso · disposições adicionais · outros termos.
Idade mínima 13. Nome real. Uma conta por pessoa. Proíbe condenado por crime
sexual. Licença **não exclusiva, transferível, sublicenciável, isenta de
royalties e mundial**. Foro: para consumidor, a lei do país de residência —
detalhe que importa, porque significa que **no Brasil vale o CDC**.

**LinkedIn** — idade mínima 16. Usuário **mantém a propriedade**; licença não
exclusiva, mundial, transferível e sublicenciável. **A licença termina quando o
conteúdo é apagado ou a conta encerrada** — com ressalva para o que já foi
compartilhado e para retenção legal. Tem uma seção "Dos and Don'ts" em
linguagem direta. Limita indenização ao maior entre taxas pagas e US$ 1.000.
Proíbe scraping explicitamente.

**X (Twitter)** — não consegui ler os termos (o site respondeu 402 à leitura
automatizada). Não vou reproduzir de memória o que não verifiquei. O que
importa da estrutura já está coberto pelos outros; se for necessário o detalhe
do X, fica pendente.

**Workana** — também não consegui ler (403). Fica pendente. O ângulo que
interessava — plataforma que **intermedeia** e se posiciona sobre o que
acontece entre usuários — é relevante para a BANCADA quando houver campeonato
com inscrição paga, e pode ser retomado depois.

**MySpace** — vale menos pelo texto e mais pela **lição histórica**. Em 2006
houve revolta pública dos usuários (o caso ficou associado ao músico Billy
Bragg) porque a licença parecia dar à plataforma direito amplo sobre a música
que os artistas subiam. O texto dizia que o MySpace **não reivindicava
propriedade** — mas a licença era ampla o bastante para assustar.

**A lição, e é a mais importante da Parte 7:** não basta ser justo, tem que
**parecer** justo na leitura. Separar em duas frases explícitas — "o conteúdo é
seu" e "a licença que você nos dá serve para isto e só isto" — evita uma crise
que o MySpace teve e que ninguém precisa repetir.

### O padrão comum

Todas concedem à plataforma licença **não exclusiva, mundial, isenta de
royalties, sublicenciável e transferível**, mantendo a propriedade com o
usuário. Isso é o mínimo técnico para exibir conteúdo (CDN, cache, redimensionar
imagem, mostrar no feed de outra pessoa).

**Recomendação para a BANCADA:** copiar o padrão, mas **com o limite do
LinkedIn** — a licença termina quando o conteúdo é apagado, ressalvado o que já
foi compartilhado e a retenção obrigatória por lei. E **sem** direito de
sublicenciar para publicidade de terceiro sem consentimento separado. É mais
estreito que o da Meta, e combina com a promessa da plataforma.

---

## PARTE 8 — Exigências do direito brasileiro que mudam a TELA, não só o texto

Estas são as que costumam ser esquecidas porque parecem detalhe de redação:

**CDC art. 46** — o consumidor não se vincula a contrato se não teve
oportunidade de tomar conhecimento prévio do conteúdo. Termo que só existe atrás
de um link que ninguém consegue abrir é termo não vinculante.

→ **Por isso a exigência de "ler clicando em cima" não é preferência de UX. É
requisito de validade.** O pedido do proprietário está juridicamente certo.

**CDC art. 54, §4º** — cláusulas que limitam direito do consumidor devem ser
redigidas **com destaque**, permitindo compreensão imediata e fácil. A
jurisprudência aplica os arts. 46, 47 e 54 §4º em conjunto, e interpreta
ambiguidade a favor do consumidor.

→ Na prática: limitação de responsabilidade, regras de encerramento de conta e
foro precisam estar **visualmente destacados** dentro do texto — não diluídos.

**Marco Civil, art. 15** — guarda de registros de acesso a aplicação por 6
meses. Precisa estar declarado na Política de Privacidade.

**LGPD art. 9º** — direito à informação clara sobre finalidade, forma, duração,
compartilhamento e responsável pelo tratamento.

**LGPD arts. 17–22** — direitos do titular: confirmação, acesso, correção,
anonimização, portabilidade, eliminação, revogação. A política tem que dizer
**como** exercer, e o app precisa de um caminho real para isso.

---

## PARTE 9 — Estrutura proposta para os Termos da BANCADA

Ordem pensada para leitura, não para blindagem. Quem lê é o jogador de várzea.

```
TERMOS DE USO DA BANCADA
 1. Em uma página — o resumo honesto do que segue
 2. Quem somos e o que a BANCADA faz
 3. Quem pode usar (idade e conta)
 4. Sua conta e seu apelido
 5. O que é seu e o que você nos autoriza a fazer  ← licença
 6. Imagem, jogo e transmissão                      ← específico da BANCADA
 7. O que não pode                                  ← inclui aposta e afiliado
 8. Conteúdo de outras pessoas e denúncia
 9. Como moderamos e como você recorre              ← exigência do STF
10. Encerrar sua conta
11. Limites da nossa responsabilidade               ← COM DESTAQUE (CDC 54 §4)
12. Mudanças nestes termos
13. Lei aplicável e foro                            ← COM DESTAQUE
14. Como falar com a gente

POLÍTICA DE PRIVACIDADE (documento separado, informativo)
 1. Em uma página
 2. Que dados coletamos e por quê                   ← com a base legal de cada um
 3. Com quem compartilhamos
 4. Por quanto tempo guardamos                      ← inclui Marco Civil art. 15
 5. Seus direitos e como exercer                    ← LGPD 17-22
 6. Dados de crianças e adolescentes                ← ECA Digital
 7. Segurança
 8. Encarregado (DPO) e contato

DIRETRIZES DA COMUNIDADE (dentro dos Termos por referência)
```

A seção 1 de cada documento — "em uma página" — não é enfeite. É o que a
pessoa vai ler de verdade, e é o que faz o art. 46 do CDC ser cumprido de fato
e não só formalmente.

---

## PARTE 10 — Decisões que dependem do proprietário

A pesquisa fecha aqui. O que falta não é informação, é escolha. Estas cinco
travam a redação:

1. **Idade mínima.** Caminho A: 18+, verificação simples, sem ECA Digital na
   prática — mas exclui o adolescente que joga várzea, que é público real.
   Caminho B: 13+ com conta de menor de 16 vinculada a responsável — atende o
   público certo e exige construir vinculação e verificação de idade.
2. **Quem é a BANCADA juridicamente** — pessoa física ou CNPJ. Sem isso não há
   parte no contrato. É pré-requisito de qualquer publicação.
3. **Uso de imagem em divulgação da própria BANCADA** — vai existir? Se sim,
   precisa de consentimento separado, com prazo.
4. **Transmissão exige aceite dos dois times?** A lei aponta que sim. Confirmar
   que o produto vai funcionar assim.
5. **Foro** — comarca da sede. Depende do item 2.

---

## Fontes

- [STF fixa tese sobre responsabilização de plataformas — ConJur](https://conjur.com.br/2025-jun-26/supremo-fixa-tese-sobre-responsabilizacao-de-plataformas-por-conteudo-de-usuarios/)
- [STF: redes respondem por posts mesmo sem ordem judicial (tese) — Migalhas](https://www.migalhas.com.br/quentes/433462/stf-redes-respondem-por-posts-mesmo-sem-ordem-judicial-veja-tese)
- [STF muda regime de responsabilização das plataformas — Machado Meyer](https://www.machadomeyer.com.br/pt/inteligencia-juridica/publicacoes-ij/direito-digital/stf-muda-regime-de-responsabilizacao-das-plataformas)
- [ECA Digital: obrigações e prazos da Lei 15.211/2025 — IBDTEC](https://www.ibdtec.com.br/post/eca-digital-lei-15211-2025-obrigacoes-prazos)
- [ECA Digital: o que muda com a Lei 15.211/2025](https://blog.livrariart.com.br/artigos-destaques/eca-digital-o-que-muda-com/)
- [ECA Digital entra em vigor — TJRJ](https://www.tjrj.jus.br/web/portal-conhecimento/noticias/noticia/-/visualizar-conteudo/5736540/405705378)
- [Prêmios, luvas, direito de arena e cessão de imagem na Lei Geral do Esporte — ANDT](https://andt.org.br/premios-luvas-direito-de-arena-e-cessao-do-uso-de-imagem-na-lei-geral-do-esporte/)
- [Lei Geral do Esporte e exploração da imagem do atleta — CSMV](https://www.csmv.com.br/lei-geral-do-esporte-e-exploracao-da-imagem-do-atleta/)
- [Súmula 403 do STJ](https://www.stj.jus.br/docs_internet/revista/eletronica/stj-revista-sumulas-2014_38_capSumula403.pdf)
- [Uso de imagens de crianças na internet sem autorização — Âmbito Jurídico](https://ambitojuridico.com.br/uso-de-imagens-de-criancas-na-internet-sem-autorizacao/)
- [Lei 14.790/23 e a proteção do consumidor diante das apostas — ConJur](https://conjur.com.br/2024-abr-29/lei-14-790-23-protege-os-consumidores-diante-das-apostas-esportivas-e-da-ludopatia/)
- [Apostas de Quota Fixa — Ministério da Fazenda](https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas/apostas-de-quota-fixa)
- [Novas portarias alteram regras de publicidade de bets — Cescon Barrieu](https://cesconbarrieu.com.br/novas-portarias-bets/)
- [Regras que exigem alertas em anúncios de bets — Agência Brasil](https://agenciabrasil.ebc.com.br/politica/noticia/2026-07/comecam-vigorar-hoje-regras-que-exigem-alertas-em-anuncios-de-bets)
- [Art. 54 do CDC comentado — Aurum](https://www.aurum.com.br/blog/cdc-comentado/art-54-cdc/)
- [Os contratos de adesão e as cláusulas abusivas — IDEC](https://idec.org.br/em-acao/artigo/os-contratos-de-adeso-e-as-clausulas-abusivas)
- [Consentimento na LGPD: quando utilizar essa base legal — Camargo e Vieira](https://blog.camargoevieira.adv.br/consentimento-na-lgpd/)
- [Guia Orientativo sobre Legítimo Interesse — ANPD (via Delivar de Mattos)](https://delivardemattos.com.br/anpd-lanca-guia-orientativo-sobre-legitimo-interesse/)
- [Guia de Elaboração de Termo de Uso e Política de Privacidade — gov.br](https://www.gov.br/governodigital/pt-br/privacidade-e-seguranca/ppsi/guia_termo_uso_politica_privacidade.pdf)
- [Termos de Serviço da Meta](https://www.facebook.com/terms.php)
- [Contrato de Usuário do LinkedIn](https://www.linkedin.com/legal/user-agreement)
- [Billy Bragg Helps Clarify MySpace License — MIT Technology Review](https://www.technologyreview.com/2006/08/01/273773/billy-bragg-helps-clarify-myspace-license/)
