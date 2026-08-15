# BANCADA — Registro de Decisões

## D-001 — Backend

**Decisão:** Firebase é o backend inicial e deve concentrar os serviços.

**Motivo:** reduzir complexidade operacional e custo inicial.

**Status:** aprovado.

---

## D-002 — Servidor próprio

**Decisão:** não haverá servidor próprio.

**Status:** aprovado.

---

## D-003 — Custo

**Decisão:** priorizar o máximo possível o nível gratuito.

**Status:** aprovado.

---

## D-004 — Desenvolvimento

**Decisão:** construir e testar localmente antes de produção.

**Status:** aprovado.

---

## D-005 — Emulator

**Decisão:** Firebase Emulator Suite será o ambiente padrão de desenvolvimento.

**Status:** aprovado.

---

## D-006 — Live

**Decisão:** Live Simulator antes de qualquer infraestrutura real de vídeo.

**Status:** aprovado.

---

## D-007 — Backend externo

**Decisão:** nenhum backend externo será introduzido sem autorização explícita.

**Status:** aprovado.

---

## D-008 — Usuário e papéis

**Decisão:** um usuário pode exercer múltiplos papéis.

**Status:** aprovado.

---

## D-009 — Time

**Decisão:** time é entidade independente do usuário.

**Status:** aprovado.

---

## D-010 — Segurança

**Decisão:** autorização deve ser aplicada no backend/rules, não somente no frontend.

**Status:** aprovado.

---

## D-011 — Arquitetura

**Decisão:** frontend não deve espalhar chamadas Firebase; usar repositories/services.

**Status:** aprovado.

---

## D-012 — Sem Cloud Functions no MVP

**Decisão:** o projeto permanece no plano **Spark (gratuito)**. Cloud Functions não serão usadas.

**Motivo:** Functions exigem o plano Blaze com cartão cadastrado, mesmo com uso zero. A prioridade de custo mínimo (D-003) prevalece.

**Consequências aceitas, registradas para não virarem surpresa:**

1. **Push notification para outro usuário não existe no MVP.** Enviar FCM para terceiro exige servidor. Notificação **dentro do app** funciona: é um documento que o destinatário lê.
2. **Derivação na leitura, não em contador.** Placar é a contagem dos eventos de gol confirmados da partida — 10 a 20 documentos, barato e sem risco de dessincronizar. Nada de campo `homeScore` que alguém atualiza à mão.
3. **Classificação de campeonato fica em aberto.** Agregar dezenas de jogos na leitura é caro. A estratégia será decidida na Fase 8, com dados reais para medir.
4. **Toda escrita vem do cliente**, autorizada pelas Security Rules. Isso torna as Rules a única barreira real — e por isso cada regra precisa de teste (TEST_STRATEGY §3).

**Revisar quando:** a classificação de campeonato ficar cara, ou push virar requisito de produto.

**Status:** aprovado — 12/08/2026.

---

## D-013 — Projeto Firebase reaproveitado

**Decisão:** usar o projeto existente **`bancada-2ce451`**.

**Estado verificado:** zero contas no Auth, Firestore nunca criado, plano Spark. E-mail/senha e Google ativados; SMS desligado; Identity Platform **não** ativado — ativá-lo derrubaria o limite de 50.000 usuários/mês para 3.000/dia.

**Status:** aprovado — 12/08/2026.

---

## D-014 — Apelido é a identidade pública

**Decisão:** o apelido é **obrigatório e único**, e é o rastreio do perfil: busca, exibição e URL pública (`/@apelido`).

**Motivo:** resolve a pendência de username. Os mockups já tratam `@lucasrocha10` e `@resenhafc` como identidade central.

**Consequência:** o cadastro ganha uma etapa de escolha de apelido, com verificação de disponibilidade e lista de nomes reservados (os que colidem com rotas do app).

**Status:** aprovado — 12/08/2026.

---

## D-015 — Perfil público por padrão

**Decisão:** perfil nasce **público**.

**Consequência:** as Security Rules de leitura de perfil liberam qualquer um; restrição é opção do usuário, não o padrão.

**Status:** aprovado — 12/08/2026.

---

## D-016 — Login por e-mail; apelido é identidade, não credencial

**Decisão:** opção **A**. O login usa **e-mail e senha** (e Google). O **apelido** é a identidade pública: busca, exibição e URL `/@apelido`.

**Motivo:** o Firebase Auth entra por e-mail. Para entrar por apelido, o app teria que resolver apelido→e-mail **antes** de a pessoa estar logada — e sem Cloud Functions (D-012) esse mapa precisaria ser público, expondo o e-mail de todos os usuários a quem varresse a lista de apelidos.

**O que isso NÃO muda:** o apelido continua sendo o rastreio do perfil, exatamente como o proprietário definiu. Muda apenas o campo da tela de entrar.

**Revisar quando:** se o Blaze for ativado algum dia, uma Function resolve o apelido sem expor e-mail, e a opção C passa a valer.

**Status:** aprovado — 12/08/2026.

---

## D-017 — Onboarding: nome, sobrenome e apelido

**Decisão:** o cadastro fica enxuto (e-mail, senha, termos). A **segunda tela** pede **nome**, **sobrenome** e **apelido**.

**Nome e sobrenome são campos separados**, e não um `displayName` único. Isto **diverge** do `DOMAIN_MODEL.md`, que previa um campo só — o documento foi atualizado.

### Apelido único — regra fixa

Ninguém pode ter o mesmo apelido. Não é preferência, é invariante.

**Como isso é garantido, e por que não é "pesquisar todos":**

O Firestore **não sabe** impor unicidade em campo. O único identificador único que existe é o **ID do documento**. Então o apelido **é** o ID:

```text
apelidos/{apelido}  →  { uid, criadoEm }
```

Consequências:

1. **Verificar disponibilidade é UMA leitura por ID**, não uma varredura. `apelidos/lucas_rocha` existe ou não existe. Varrer a coleção inteira custaria uma leitura por documento e ficaria mais caro a cada usuário novo — com 10 mil usuários, cada checagem custaria 10 mil leituras.
2. **A garantia real está na escrita, não na consulta.** A checagem enquanto a pessoa digita é uma *dica*: entre ver "disponível" e tocar em salvar, outra pessoa pode pegar. Quem decide é o `create`, que a Security Rule só autoriza se o documento **ainda não existir**.
3. **Sem os dois, a regra falha.** Só a dica: dois usuários veem "disponível" ao mesmo tempo e o segundo quebra no salvar. Só a escrita: a pessoa só descobre depois de preencher tudo.

### Maiúsculas: visíveis, mas sem efeito na unicidade

O apelido tem **duas formas**, e a distinção é o coração da regra:

| | Exemplo | Para quê |
|---|---|---|
| **Exibição** | `Lucas_Rocha` | como a pessoa escreveu; é o que aparece no perfil |
| **Chave** | `lucas_rocha` | minúscula; é o ID em `apelidos/{chave}` e garante a unicidade |

Consequência: `Lucas_Rocha`, `lucas_rocha` e `LUCAS_ROCHA` são **o mesmo apelido**, e só um pode existir. A pessoa escolhe como escreve; ninguém consegue registrar uma variação que só difere em maiúscula.

Sem essa separação, dois perfis ficariam com endereços praticamente idênticos e ninguém saberia qual é qual — o que é exatamente como golpe de personificação funciona.

**Status:** aprovado — 12/08/2026.

---

## D-018 — Método de trabalho: tela por tela, e tela aprovada congela

**Decisão do proprietário.** A construção é **uma tela de cada vez**. Quando o
proprietário confirmar que a tela está boa, ela **congela** — não se mexe mais
nela sem motivo explícito.

**Como cada tela é entregue:** implementar → verificar nos seis tamanhos de
tela (`DEFINITION_OF_DONE`) → relatar no formato do `00_MASTER_PROMPT.md` →
**parar** e esperar a confirmação.

### Tensão registrada com a regra de ouro

O `CLAUDE.md §6` diz para não desenvolver tela isolada: toda funcionalidade
precisa de dados, regras, permissões, estados e testes. Construir a interface
antes da persistência **contraria isso**.

A tensão é consciente e tem prazo: as telas de primeiro acesso estão sendo
feitas primeiro para o proprietário ver e aprovar o fluxo visual, e **serão
ligadas ao Firebase antes de o M1 fechar**. Nenhuma tela conta como pronta
pela `DEFINITION_OF_DONE` enquanto não tiver persistência, regra e teste.

O que **não** é aceitável: seguir para a Fase 3 com as telas da Fase 2 ainda
sem backend. Isso seria acumular exatamente a dívida que a regra de ouro
existe para evitar.

### Regra que veio junto

**Adaptação a tamanhos de tela é critério de aceite de toda tela**, não
polimento. Os seis tamanhos e as seis verificações estão no
`DEFINITION_OF_DONE.md`.

**Status:** aprovado — 12/08/2026.

---

## D-019 — Senha: alfanumérica, mínimo 8 caracteres

**Decisão do proprietário — 14/08/2026.** A senha deve ser **alfanumérica com
no mínimo 8 caracteres**.

### Como foi interpretado

"Alfanumérica" **exige** letra e número; **não proíbe** símbolo. Proibir
símbolo rejeitaria `Minha$enha123`, que é mais forte que muita senha que a
regra aceita — a regra existe para levantar o piso, não para baixar o teto.

Regra anterior (mais fraca) recusava apenas senha só de números; `minhasenha`
passava. Agora não passa.

| Senha | Antes | Agora |
|---|---|---|
| `12345678` | recusada | recusada — "Inclua pelo menos uma letra." |
| `minhasenha` | **aceita** | recusada — "Inclua pelo menos um número." |
| `abc12` | recusada | recusada — "Use pelo menos 8 caracteres." |
| `senha123` | aceita | aceita |
| `Minha$enha123` | aceita | aceita |

O medidor de força passou a usar `validarSenha` como piso: enquanto a senha não
passar na regra, ele mostra "fraca". O medidor não pode dizer "razoável" para
uma senha que o botão vai recusar.

### Limitação conhecida: esta regra vive só no cliente

O `CLAUDE.md §3` manda aplicar segurança no servidor, nunca só no cliente. Esta
regra **não** cumpre isso, e a causa é externa:

- o mínimo do Firebase Auth é de 6 caracteres, sem exigência de composição;
- política de senha customizada é recurso do **Identity Platform**, cujo
  upgrade a D-013 proíbe (derruba a cota de 50k MAU para 3k DAU).

Consequência real: quem chamar a API REST do Firebase Auth direto, sem passar
pela tela, consegue criar conta com senha fraca. O que **não** está em risco é
autorização — quem pode ler e escrever o quê continua decidido pelas Security
Rules, no servidor. Isto aqui é proteção do usuário contra a própria senha, não
controle de acesso.

Fica registrado como aceito até que se decida pagar o Identity Platform ou
adotar outro mecanismo.

**Status:** aprovado — 14/08/2026.

---

## D-020 — A BANCADA é da Exoduss Tec

**Decisão do proprietário — 15/08/2026.** A BANCADA é um produto da
**Exoduss Tec**, na mesma relação que o Facebook e o Instagram têm com a Meta:
a marca do app é BANCADA, a pessoa jurídica por trás é a Exoduss Tec.

Consequências: a Exoduss Tec é a **controladora** dos dados para efeito de LGPD
e é a parte contratante nos Termos de Uso. Razão social completa, CNPJ,
endereço e comarca ainda precisam ser informados para fechar os documentos.

**Status:** aprovado — 15/08/2026.

---

## D-021 — Apostas estão fora do escopo, em definitivo

**Decisão do proprietário — 15/08/2026.** A BANCADA não terá apostas. O assunto
sai da documentação e não volta à pauta.

Permanece **uma** regra que nasceu dessa análise e não é sobre apostar: as
Diretrizes da Comunidade proíbem o usuário de promover casa de aposta ou
publicar link de afiliado dentro da plataforma. É regra de convivência, do
mesmo tipo que proibir spam, e sustenta a promessa de ambiente familiar.

**Status:** aprovado — 15/08/2026.

---

## D-022 — Divulgação da BANCADA não usa dados nem imagem dos usuários

**Decisão do proprietário — 15/08/2026.** O marketing da BANCADA é feito com
material próprio. A plataforma **não** usa dados, fotos, vídeos ou imagem dos
usuários em benefício da própria divulgação.

Esta decisão é mais forte do que parece. Ela **elimina** a necessidade do
consentimento de imagem para marketing que a pesquisa apontava (Parte 4.2), e
com ele elimina o risco da Súmula 403 do STJ — que presume o dano quando há uso
comercial de imagem sem autorização. Onde não há uso comercial, não há a
presunção.

Também simplifica o cadastro: some uma caixa de consentimento da tela.

**Status:** aprovado — 15/08/2026.

---

## D-023 — Transmissão exige aceite do time adversário

**Decisão do proprietário — 15/08/2026.** Transmitir um jogo funciona como
**convite de partida**: o time que quer transmitir convida, e a transmissão só
existe depois que o time adversário aceita.

Ao aceitar, o adversário é perguntado se também quer abrir a própria
transmissão. Quem for transmitir recebe orientação de **posicionamento e
distância** para a captação ficar boa.

Isto atende a Lei 14.597/2023, art. 160, §6º: sem mando de jogo definido — o
caso normal da várzea — a captação e a transmissão dependem da anuência das
organizações participantes. A regra legal e a mecânica de produto coincidem, o
que é raro e conveniente.

**Status:** aprovado — 15/08/2026.

---

## D-024 — A conta só é criada no botão final

**Decisão do proprietário — 15/08/2026.** Nada é criado enquanto o fluxo não
termina. E-mail, senha, nome, sobrenome e apelido são coletados pelas telas e
**só viram conta** quando a pessoa confirma no botão final.

Ganho concreto: não existe conta órfã — autenticação criada sem perfil, sem
apelido, sem nome. Quem abandona no meio não deixa rastro e pode recomeçar com
o mesmo e-mail.

**Consequência de implementação a resolver:** sem Cloud Functions (D-012), criar
a autenticação e gravar o perfil são duas operações de cliente que não podem
ser uma transação só. Se a segunda falhar, sobra a autenticação sem perfil —
exatamente o que esta decisão quer evitar. O tratamento precisa ser: detectar,
no login seguinte, a conta sem perfil e retomar o fluxo de onde parou. Isso
tem que ser projetado junto com a ligação do Firebase, não depois.

**Status:** aprovado — 15/08/2026.

---

# DECISÕES PENDENTES

Estas decisões devem ser confirmadas pelo proprietário antes das partes afetadas:

1. plataformas da primeira publicação: Android apenas ou Android+iOS;
2. ~~login por apelido ou por e-mail~~ → **decidido em D-016** (opção A);
3. ~~username obrigatório ou opcional~~ → **decidido em D-014**;
4. **idade mínima e política de menores** — deixou de ser escolha livre.
   A Lei 15.211/2025 (ECA Digital) está em vigor desde 17/03/2026 e alcança
   serviço "de acesso provável" por menores, o que inclui a BANCADA. Restam
   dois caminhos, ambos legítimos: **(A)** 18+, mais simples, mas exclui o
   adolescente que joga várzea; **(B)** 13+ com conta de menor de 16 vinculada
   a responsável, que atende o público real e exige construir verificação de
   idade e vinculação. Autodeclaração está **vedada** nos dois casos.
   Detalhes em `docs/12-legal/TERMOS_PESQUISA.md`, Parte 5;
5. ~~perfil público por padrão~~ → **decidido em D-015**;
6. sistema de amizade além de seguir;
7. feed cronológico ou híbrido;
8. regras exatas de campeonato;
9. categorias esportivas;
10. campos obrigatórios do jogador;
11. possibilidade de um jogador estar em vários times simultaneamente;
12. transferência entre times;
13. formato de live real;
14. chat da live;
15. sistema de denúncia;
16. monetização;
17. região inicial do lançamento.

18. ~~personalidade jurídica da BANCADA~~ → **decidido em D-020** (Exoduss
    Tec). Faltam apenas os dados de registro: razão social, CNPJ e endereço;
19. **foro e comarca** — depende do endereço da Exoduss Tec (D-020);
20. ~~uso da imagem do usuário em divulgação da BANCADA~~ → **decidido em
    D-022**: não haverá. O consentimento de imagem para marketing deixa de ser
    necessário;
21. ~~transmissão exige anuência dos dois times?~~ → **decidido em D-023**: sim,
    no modelo de convite de partida.

22. **supervisão da conta do menor — o que o responsável enxerga.** O fluxo
    proposto em 15/08/2026 (responsável cria a conta, vincula, bloqueia
    conteúdo) está certo e é melhor que o da maioria das plataformas. A parte
    a decidir é o **alcance da supervisão**. Avaliação registrada:

    **O que recomendo manter sem ressalva:** vinculação obrigatória · bloquear
    conteúdo e temas · ver e aprovar quem segue e quem manda mensagem ·
    bloquear contato · limite de tempo · receber aviso de denúncia envolvendo
    o menor.

    **Onde tenho reserva: ler o conteúdo das mensagens.** Três motivos.

    *Primeiro, o risco que ninguém quer nomear.* Em boa parte dos casos de
    violência contra criança e adolescente o agressor está dentro de casa. Uma
    conta em que o responsável lê tudo remove justamente o canal pelo qual o
    menor pediria ajuda. A ferramenta feita para proteger vira a que isola.

    *Segundo, está invertido.* A proposta deixa a postagem livre e a mensagem
    aberta. É o contrário do que protege: o dano à reputação e o assédio
    público acontecem na **postagem**; a **mensagem** é onde o menor procura
    socorro. Se for para escolher onde o responsável enxerga mais, é no que é
    público.

    *Terceiro, o ECA protege a intimidade do próprio adolescente* (art. 17).
    Supervisão é legítima; vigilância total de 15 anos é outra coisa, e a lei
    não exige. A Lei 15.211/2025 pede vinculação e controle parental — não pede
    leitura de conversa.

    **Proposta:** o responsável vê **com quem** o menor conversa e pode
    bloquear qualquer contato, mas não lê o conteúdo por padrão. Alertas
    automáticos de risco (contato adulto desconhecido, palavra-chave de perigo)
    chegam ao responsável. Em risco concreto, há um pedido de acesso ao
    conteúdo que fica **registrado e visível para o menor**.

    **Regra que vale em qualquer cenário escolhido: o menor precisa saber o que
    o responsável enxerga.** Supervisão às escondidas é pior que supervisão
    ampla e declarada — eticamente e juridicamente.

    **Faixas etárias:** abaixo de 16 a vinculação é obrigatória por lei; de 16 a
    18 a lei não exige, e manter supervisão total nessa faixa é decisão de
    produto, não obrigação.

    **Nada disso trava o cronograma:** mensagens são Fase 13. Dá para lançar a
    vinculação e o bloqueio de conteúdo agora e decidir a supervisão de
    mensagem quando a mensagem existir — desde que a arquitetura não feche a
    porta.

Quando uma pendência for decidida, registrar aqui com data e motivo.
