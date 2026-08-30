# Como redes sociais funcionam — e o que serve para a BANCADA

> **Pesquisa de 30/08/2026.** A pergunta que guiou tudo não foi "como o
> Instagram funciona", e sim: **o que serve para uma rede com duas pessoas,
> sem Cloud Functions e na cota gratuita.** Muita coisa que as grandes fazem
> não só não serve — atrapalha.

---

## PARTE 1 — A conclusão, antes do resto

Três frases que resumem a pesquisa:

1. **Não construa algoritmo de feed agora.** Ranking existe para escolher o que
   mostrar quando há mais conteúdo do que cabe. Com 2 usuários e 1 post, não há
   o que escolher — e um algoritmo sem dados produz resultado pior que a ordem
   cronológica.
2. **A arquitetura já está decidida pela nossa restrição.** Sem Cloud Functions,
   só existe um caminho viável (montar o feed na leitura). Felizmente é o certo
   para o nosso tamanho.
3. **O maior risco da BANCADA não é técnico, é a sala vazia.** E a pesquisa
   mostra que ele já matou produto muito maior que o nosso.

---

## PARTE 2 — Como os algoritmos de feed funcionam de fato

### Os sinais, em ordem de peso

O Instagram usa **algoritmos diferentes por superfície** — Feed, Reels, Stories
e Explorar não usam o mesmo. Os sinais que mais pesam:

| Sinal | O que é |
|---|---|
| **Relacionamento** | Histórico de interação com aquela pessoa: curtidas, comentários, visualização de story, mensagens. **É o que mais pesa.** |
| **Engajamento** | Tempo de visualização, envios por alcance, curtidas por alcance. As primeiras 30–60 minutos decidem se o post vai além |
| **Recência** | Ainda conta, mas menos que na era do feed cronológico |

No X, os sinais são recência, relevância, diversidade, uso de mídia,
engajamento, credibilidade da conta e palavras-chave. Resposta e repost pesam
mais que curtida — sinalizam conversa, não aprovação passiva.

### As fórmulas simples, que dá para implementar sem aprendizado de máquina

**Hacker News:**

```
pontuação = votos^0,8 / (idade_em_horas + 2)^1,8
```

O expoente 1,8 é a "gravidade": quanto maior, mais rápido o conteúdo velho
afunda. O expoente 0,8 nos votos faz o 100º voto valer menos que o 10º.

**Reddit** usa logaritmo da soma de votos e intervalos de 12,5 h desde o post
mais antigo. A diferença de filosofia importa: o Reddit **não derruba** o
conteúdo velho, ele deixa o novo subir mais fácil.

**O que isso significa para nós:** as duas cabem em cinco linhas de código e
não precisam de servidor. Quando houver conteúdo demais, é por aqui que se
começa — não por aprendizado de máquina.

---

## PARTE 3 — Como se implementa: as duas arquiteturas

Esta é a decisão que mais afeta código, e ela tem só duas respostas.

### Espalhar na escrita (*fan-out on write*)

Ao publicar, o post é **copiado para a linha do tempo de cada seguidor**. Ler o
feed vira uma leitura só, de uma lista já pronta.

- ✅ leitura instantânea
- ❌ publicar fica caro: quem tem 1.000 seguidores gera 1.000 escritas
- ❌ **o problema da celebridade**: quando alguém com 80 milhões de seguidores
  publicava, o Twitter tentava 80 milhões de escritas simultâneas e o caminho
  de escrita saturava por 3 a 5 segundos

### Montar na leitura (*fan-out on read*)

O post é gravado **uma vez**. Ao abrir o feed, consulta-se quem a pessoa segue
e junta-se o resultado.

- ✅ publicar é uma escrita só
- ✅ nada a reprocessar quando alguém deixa de seguir
- ❌ ler fica mais caro e mais lento conforme a lista cresce

### O que as grandes fazem

O Twitter começou montando na leitura, migrou para espalhar na escrita em 2012
por causa da latência, e hoje usa **híbrido**: espalha na escrita para gente
comum e monta na leitura para contas acima de ~300 mil seguidores.

### O que a BANCADA faz — e por que não há escolha

**Montar na leitura. Não por preferência: por restrição.**

Espalhar na escrita exigiria que, ao publicar, o cliente escrevesse na linha do
tempo de cada seguidor. Sem Cloud Functions (D-012), isso significa **o cliente
escrevendo em documentos de outras pessoas** — e as Security Rules teriam que
permitir. Seria abrir a porta que passamos semanas fechando.

E há uma segunda razão, mais confortável: **no nosso tamanho, montar na leitura
é a escolha certa de qualquer forma.** O custo dela só aparece com milhares de
seguidos por pessoa.

### O número que decide o desenho: **30**

Medido contra o emulador, não lido em documentação:

```
in com  10 valores: ACEITO
in com  30 valores: ACEITO
in com  31 valores: RECUSADO -- 'IN' supports up to 30 comparison values
```

O operador `in` do Firestore aceita **no máximo 30 valores**. Como a aba
SEGUINDO é "posts de quem eu sigo", isso significa:

- até 30 seguidos → **uma consulta**;
- acima disso → dividir em blocos de 30, consultar cada um e juntar no cliente.

Quem segue 100 pessoas gera 4 consultas por página de feed. Funciona, mas é o
ponto onde o custo começa a crescer — e o momento de reavaliar a arquitetura,
não antes.

---

## PARTE 4 — O problema da sala vazia

Esta é a parte mais importante da pesquisa, e a que menos tem a ver com código.

### O que aconteceu com quem tentou

O **Google+** teve um dos lançamentos mais aguardados da internet. As pessoas
entravam, encontravam a linha do tempo vazia e saíam. O Google admitiu depois:
**90% das sessões duravam menos de cinco segundos.**

Não foi falta de recurso, nem de dinheiro, nem de gente. Foi a sala vazia.

**A BANCADA tem exatamente esse feed hoje.** Duas contas, e o texto "Ainda não
tem nada por aqui".

### O que funciona

**Rede atômica.** Em vez de tentar "toda a várzea", construir a menor rede que
funciona sozinha e depois ligar uma na outra.

Para a BANCADA, a rede atômica **não é uma cidade nem um bairro: é um time, ou
uma pelada.** Onze a vinte pessoas que já se conhecem, já se falam e já têm
motivo para abrir o app na mesma noite. Se o app funciona para *um* time, ele
funciona — e daí replica.

Isso tem uma consequência direta no roadmap. Ver Parte 6.

**Coisas que não escalam.** Mandar mensagem para as vinte primeiras pessoas na
mão. Receber cada novo membro pelo nome. Escrever a primeira resposta de
verdade você mesmo. Nada disso é automatizável e é o que faz a diferença no
começo.

**Convite fechado.** O LinkedIn começou por convite, mirando um grupo pequeno
que convidava quem quisesse. Chegou ao ponto de virada em cerca de uma semana.

**Utilidade para uma pessoa só.** O Pinterest funcionava mesmo sem rede: servia
para *você* organizar suas coisas. A rede veio de brinde.

> **A pergunta que a BANCADA ainda não responde: o que o app faz por alguém que
> entra e não conhece ninguém?** Hoje: nada. Ele vê um feed vazio.

**O erro mais comum** é tratar o lançamento como linha de chegada. O pico de
gente do dia do lançamento costuma ser a melhor chance de massa crítica — e ela
se gasta numa sala vazia.

---

## PARTE 5 — O que o mercado brasileiro já resolve

Pesquisando o que existe para futebol amador no Brasil, aparecem
**Futebolize · FutBora · Partida · Fut7Pro · Meu Ranking** — e todos giram em
torno das mesmas funções:

| Função | Está no roadmap da BANCADA? |
|---|---|
| **Confirmar presença**, com lista de espera | ❌ **não** |
| **Sorteio de times equilibrado** | ❌ **não** |
| **Controle de mensalidade / financeiro** | ❌ **não** |
| Ranking de jogadores | 🔄 parcial (Fase 7) |
| Estatísticas e histórico | ✅ Fases 4 e 7 |
| Lembrete de jogo | ❌ não |
| Integração com WhatsApp | ❌ não |

Vários deles se conectam ao **grupo de WhatsApp** — vão onde as pessoas já
estão, em vez de exigir que mudem de lugar.

### O que isso diz

**A BANCADA está posicionada como rede social; o mercado brasileiro resolve
organização.** São coisas diferentes:

- rede social responde *"o que está acontecendo na várzea"*;
- os apps existentes respondem *"quem vai jogar domingo e quanto cada um deve"*.

O segundo é uma dor semanal, concreta, que hoje mora num grupo de WhatsApp
bagunçado. O primeiro é desejável, mas ninguém acorda precisando dele.

**Isto não é argumento para virar app de pelada.** É argumento para notar que
a dor que traz gente para dentro pode não ser a mesma que a visão descreve — e
que a resposta para "o que o app faz por quem não conhece ninguém" talvez esteja
aqui.

**É decisão do proprietário**, e está registrada como pendência.

---

## PARTE 6 — O que fazer, na ordem

### Agora

**Manter o feed cronológico.** Ranking com 1 post é ruído. O gatilho para mudar
é objetivo: *quando alguém tiver mais posts novos do que consegue ler numa
sessão*. Antes disso, ordenar é resolver problema que não existe.

**Montar na leitura, com blocos de 30.** Já é o que fazemos, e agora está
medido e documentado.

**Seguir** — sem isso a aba SEGUINDO não existe e o feed é um mural de
desconhecidos.

### Depois, e com peso

**Priorizar Time (Fase 5) antes do que o roadmap sugere.** Se a rede atômica é
um time, a função que cria a rede atômica é criar time e chamar o elenco. Feed
sem gente é feed vazio; time com elenco traz onze pessoas de uma vez.

**Notificação** é o que traz de volta — mas com limite. Mais de três por semana
e as pessoas silenciam o app. As que funcionam são as que envolvem a pessoa
diretamente: te marcaram, comentaram no seu post, o jogo é amanhã.

### Quando houver volume

**Fórmula de decaimento** no estilo Hacker News, cinco linhas, sem servidor.
**Peso de relacionamento** — quem você interage aparece mais. Depois disso, e só
depois, faz sentido pensar em qualquer coisa mais sofisticada.

### O que NÃO fazer

- **Aprendizado de máquina.** Precisa de volume que não existe e não vai existir
  tão cedo;
- **Espalhar na escrita.** Sem Cloud Functions, exigiria abrir as regras;
- **Trending.** Precisa de sinal de engajamento em escala; com 2 usuários
  mostraria o único post que existe;
- **Copiar a tela do mockup inteira de uma vez.** São sete blocos, cada um uma
  fase (D-033).

---

## Fontes

- [Fan-out on write vs fan-out on read — trade-offs](https://rurutia1027.medium.com/system-design-social-platforms-fan-out-on-write-vs-fan-out-on-read-trade-offs-3a9a6eb339f0)
- [Software Design 101: Twitter Timeline](https://stackshala.medium.com/software-design-101-twitter-timeline-5912d31afada)
- [Fan-out on Write vs Fan-out on Read: The Core Trade-off](https://wittycoder.in/courses/news-feed/fan-out-strategies)
- [Instagram algorithm 2026: rank signals for growth — Later](https://later.com/blog/how-instagram-algorithm-works/)
- [How the Instagram Algorithm Works — Sprout Social](https://sproutsocial.com/insights/instagram-algorithm/)
- [Understanding how the X (Twitter) algorithm works in 2026 — SocialBee](https://socialbee.com/blog/twitter-algorithm/)
- [How Hacker News ranking algorithm works](https://medium.com/hacking-and-gonzo/how-hacker-news-ranking-algorithm-works-1d9b0cf2c08d)
- [Reddit's ranking algorithm for content curation](https://medium.com/@niruthiha2000/reddits-ranking-algorithm-for-content-curation-systems-2daa3f33a14f)
- [How to solve the cold-start problem for social products — Andrew Chen](https://andrewchen.com/how-to-solve-the-cold-start-problem-for-social-products/)
- [The Cold Start Problem Every Online Community Has](https://wbcomdesigns.com/bootstrap-community)
- [Threads: Meta's New Social Network and the Cold Start Problem](https://zoia.org/posts/threads-and-the-cold-start-problem/)
- [Learn Firestore Data Modeling — Follower Feed (Fireship)](https://fireship.io/courses/firestore-data-modeling/models-social-feed/)
- [How to Build a Scalable Follower Feed in Firestore](https://dev.to/jdgamble555/how-to-build-a-scalable-follower-feed-in-firestore-25oj)
- [Lista de Presença para Pelada — FutBora](https://futbora.com.br/lista-presenca-pelada)
- [Como organizar um racha de futebol sem depender do WhatsApp — Fut7Pro](https://www.fut7pro.com.br/blog/organizar-racha-de-futebol)
- [Aplicativo para Marcar Futebol — Partida](https://www.partida.app/blog/aplicativo-para-marcar-futebol)
- [25 Effective Push Notification Strategies — CleverTap](https://clevertap.com/blog/push-notification-strategy/)

**O limite de 30 do operador `in` foi medido contra o emulador, não lido em
documentação** — a página de quotas do Firebase não traz esse número.
