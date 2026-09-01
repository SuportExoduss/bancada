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
e é a parte contratante nos Termos de Uso.

**O CNPJ ainda não foi aberto** (confirmado em 15/08/2026). Hoje "Exoduss Tec"
é nome de marca sem existência jurídica própria. Isso **não trava o
desenvolvimento** — trava a **publicação**, e só ela.

Enquanto não houver CNPJ, os Termos não podem ser publicados sem que a parte
contratante seja identificada. As duas saídas possíveis, a decidir mais perto do
lançamento:

- **abrir o CNPJ antes de publicar** — caminho recomendado, porque separa o
  patrimônio pessoal do proprietário do risco da plataforma e evita expor CPF e
  endereço residencial num documento público. A modalidade adequada
  (MEI, ME, Simples) precisa ser confirmada com contador: atividades de
  desenvolvimento de software têm restrições no MEI que mudam com frequência, e
  não é assunto que eu deva afirmar de cor;
- **publicar como pessoa física**, com CPF e endereço do proprietário nos
  Termos. Funciona juridicamente, mas expõe dado pessoal e não separa
  patrimônio.

A comarca do foro depende do endereço que resultar dessa escolha.

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

## D-025 — Supervisão da conta do menor: por contato, não por conteúdo

**Decisão do proprietário — 15/08/2026.** Aprovado o modelo proposto na
avaliação da pendência 22.

**O responsável vê e controla:**

- vinculação obrigatória da conta do menor à dele;
- **com quem** o menor conversa, e pode bloquear qualquer contato;
- quem segue e quem pode mandar mensagem;
- bloqueio de conteúdo e de temas que considerar impróprios;
- limite de tempo de uso;
- aviso de qualquer denúncia envolvendo o menor.

**O responsável não lê o conteúdo das mensagens por padrão.** Alertas
automáticos de risco — adulto desconhecido puxando conversa, palavra-chave de
perigo — chegam ao responsável. Em risco concreto existe um pedido de acesso ao
conteúdo, que fica **registrado e visível para o menor**.

**Regra transversal, e ela não é negociável:** o menor sempre sabe o que o
responsável enxerga. Supervisão às escondidas é pior que supervisão ampla e
declarada, ética e juridicamente.

### O motivo, registrado para não se perder

Em boa parte dos casos de violência contra criança e adolescente o agressor está
dentro de casa. Uma conta lida por inteiro remove justamente o canal pelo qual o
menor pediria ajuda — a ferramenta feita para proteger vira a que isola.

E a leitura completa estava invertida: assédio e dano à reputação acontecem na
**postagem**, que é pública e permanente; a **mensagem** é onde se pede socorro.
Onde o responsável enxerga mais deve ser no que é público.

A Lei 15.211/2025 exige vinculação e controle parental. **Não** exige leitura de
conversa. O ECA (art. 17) protege a intimidade do próprio adolescente.

**Faixa 16–17:** a lei não exige vinculação. Manter supervisão nessa faixa é
decisão de produto, ainda em aberto.

**Cronograma:** mensagens são Fase 13. A vinculação e o bloqueio de conteúdo
podem sair antes; o que não pode é a arquitetura fechar a porta para este
modelo.

**Status:** aprovado — 15/08/2026.

---

## D-026 — Idade mínima: 13 anos

**Decisão do proprietário — 15/08/2026.** A idade mínima para ter conta na
BANCADA é **13 anos**.

Fica acima da faixa "criança" da LGPD (art. 14 trata menor de 12 com o regime
mais rígido) e acompanha a convenção que Meta e a maioria das plataformas usam.

**As faixas resultantes:**

| Idade | Como funciona |
|---|---|
| Abaixo de 13 | Não pode ter conta |
| 13 a 15 | Conta criada **pelo responsável**, vinculada à dele (D-025). Exigência da Lei 15.211/2025 |
| 16 e 17 | Conta própria. A lei não exige vinculação |
| 18 ou mais | Conta própria, sem supervisão |

**Status:** aprovado — 15/08/2026.

---

## D-027 — Qual fundo em qual tela

**Decisão do proprietário — 18/08/2026, reforçada em 19/08/2026.**

| Grupo | Fundo |
|---|---|
| Telas iniciais e de cadastro | **Foto da quadra**, trocando com a hora |
| **Todo o resto** | **Arte de feed**, retrato ou paisagem conforme a tela |

Hoje isso significa: boas-vindas, entrar, "para quem é a conta", "primeiro a
sua conta", cadastro e onboarding com a foto; termos, política e **tudo o que
vier daqui em diante** — feed, perfil, time, jogo, campeonato, mensagens,
configurações — com a arte de feed.

**A regra padrão para tela nova é `variante="app"`.** A foto é a exceção, não o
contrário. Tela nova que não seja parte do primeiro acesso nasce com a arte.

### Um caso de fronteira, registrado

A tela **"Conta criada"** está hoje com a foto, por ser o último passo do
cadastro — o fluxo termina com a mesma imagem em que começou. Dá para
defender o contrário: a conta já existe, a pessoa já é usuária, e trocar para a
arte ali sinalizaria "você chegou". Fica como está até haver decisão em
contrário; é uma linha de código.

**Status:** aprovado — 18/08/2026.

---

## D-028 — Firestore em São Paulo, e por que foi refeito

**23/08/2026.** O banco Firestore foi criado pela primeira vez em **`nam5`
(Estados Unidos)** — o valor que já vem preenchido na tela do console. Como
estava vazio e sem proteção de exclusão, foi **apagado e recriado** em
`southamerica-east1` (São Paulo) no mesmo dia.

A região de um banco Firestore **não muda depois**. A janela para corrigir
existia porque não havia nada dentro; uma semana depois, com usuários, o custo
seria outro.

**Por que São Paulo:**

- ~150ms a menos por operação para quem está no Brasil. Num app que registra
  gol ao vivo, isso é a diferença entre o placar parecer instantâneo e parecer
  atrasado;
- dado guardado no Brasil simplifica a história da LGPD — a transferência
  internacional continua declarada na Política, mas deixa de ser a regra;
- região simples custa menos que multirregião se um dia houver Blaze.

**O que se perde:** multirregião oferece 99,999% de disponibilidade contra
99,99% da região simples. Cerca de 43 minutos de indisponibilidade a mais por
ano, no pior caso. Aceito.

**Detalhe operacional:** depois de apagar um banco, o ID `(default)` fica
reservado por alguns minutos antes de poder ser reusado.

**Status:** aprovado — 23/08/2026.

---

## D-029 — Apelido não pode ser liberado pelo cliente (lacuna aberta)

**Descoberto em 23/08/2026**, ao limpar dados de teste da produção.

As regras negam `update` e `delete` em `/apelidos` — foi de propósito, para
que ninguém tome o apelido de outra pessoa. A consequência que passou
despercebida: **ninguém consegue liberar um apelido, nem o próprio dono.**

Quem encerra a conta consegue apagar o próprio perfil (`usuarios/{uid}` permite
delete), mas a reserva em `/apelidos/{chave}` fica para sempre, apontando para
um uid que não existe mais.

### Por que isso importa

A Política de Privacidade promete, na seção 6:

> Apelido após o encerramento: bloqueado por um período de segurança, depois
> liberado.

**Hoje o app não consegue cumprir isso.** O texto promete algo que a
implementação impede. Uma das duas coisas precisa mudar antes de publicar.

### Os caminhos

1. **Cloud Function** que libera o apelido ao encerrar a conta. É a solução
   limpa e a D-012 a proíbe (exige Blaze);
2. **Rule que permite delete quando o dono é quem pede** —
   `allow delete: if request.auth.uid == resource.data.uid`. Resolve sem
   Function, mas abre uma porta: quem for coagido a apagar libera o apelido
   para quem o coagiu. Em plataforma com menor de idade isso não é hipótese
   confortável;
3. **Mudar a promessa**: apelido de conta encerrada não volta a circular.
   Simples, honesto, e custa apenas apelidos parados.

**Decisão do proprietário — 23/08/2026: caminho 3.** O apelido de conta
encerrada **não volta a circular**. Fica reservado para sempre.

Os dois documentos foram corrigidos para dizer isso, com o motivo escrito para
quem lê: se um apelido encerrado voltasse para a fila, alguém poderia esperar
uma conta sumir para tomar aquele nome, e quem procurasse pelo apelido antigo
encontraria outra pessoa.

A regra que nega `delete` em `/apelidos` deixa de ser uma lacuna e passa a ser
a implementação correta da promessa. Nada muda no código — muda o texto, que
estava prometendo o contrário.

**Reavaliar se um dia houver Blaze:** com Cloud Functions daria para liberar o
apelido de forma controlada, sem abrir a porta de alguém coagir o dono a
apagar a conta para tomar o nome. Enquanto não houver, o custo de um apelido
parado é menor que esse risco.

**Status:** aprovado — 23/08/2026.

---

## D-030 — Acambarcamento de apelido: fechado pela metade, e por quê

**Achado em 29/08/2026**, numa varredura do projeto. Foi medido, não suposto.

A regra de `/apelidos` conferia apenas que o `uid` era o de quem pedia. Nada
limitava **quantos** apelidos uma conta reservava. Um teste tentou dez nomes
cobiçados — `pele`, `neymar`, `varzea`, `flamengo` — com uma conta só:
**dez de dez passaram**. E pela D-029 apelido não volta a circular, então cada
um ficaria preso para sempre.

### O que foi feito

A regra passou a exigir que quem reserva **ainda não tenha perfil**. Medido
depois da correção:

| Cenário | Antes | Depois |
|---|---:|---:|
| Conta **com** perfil acambarcando | 10/10 | **0/10** |
| Conta que nunca completa o cadastro | 10/10 | 10/10 |
| Tudo num lote só | 10/10 | 10/10 |

### O que **não** foi fechado, e por que não dá

Quem cria a autenticação e **nunca completa o perfil** continua reservando à
vontade.

Não é descuido: **as regras do Firestore não conseguem exprimir isso.** Elas
avaliam cada documento contra o estado *anterior* à escrita e não sabem
consultar "quantos documentos este uid já tem". Num lote, todas as escritas
enxergam o mesmo estado anterior — então dez reservas de uma vez passam juntas,
qualquer que seja a regra.

Tentativas que não resolvem, e o motivo:

- **marcador `apelidosPorDono/{uid}` no mesmo lote** — o `exists()` continua
  vendo o estado pré-lote, e as dez passam;
- **exigir que o perfil exista antes** — quebra o lote atômico da D-024 e traz
  de volta a conta órfã, trocando um problema por outro.

### O que fecha de verdade

1. **Cloud Function** validando a reserva. É a solução correta e a D-012
   proíbe (exige Blaze);
2. **App Check** — não impede, mas encarece muito: só instância legítima do
   app consegue escrever. Está na Fase 15 do roadmap e **vale antecipar**;
3. **Faxina administrativa** — uma consulta por reservas cujo `uid` não tem
   perfil acha os acambarcadores, e o SDK de administrador (que ignora as
   regras) limpa. Serve enquanto o volume for pequeno.

### Por que isso é aceitável agora

A plataforma não tem usuário, e apelido cobiçado só vale quando há gente para
cobiçar. O risco cresce junto com a base — e a mitigação (App Check) é barata e
cabe antes do beta.

**O que não é aceitável é chegar ao beta sem decidir isto.**

**Status:** mitigado em parte; App Check antecipado para antes do beta.

---

## D-031 — Ciclo de conclusão: nada avança sem varredura

**Decisão do proprietário — 29/08/2026.** Concluir um item **não** é o fim dele.
Ao terminar qualquer coisa, nesta ordem:

1. **Perguntar ao proprietário se está testado.** Não presumir. Verificação
   feita pela IA não substitui teste no aparelho dele e com o grupo.
2. **Marcar no roadmap** com o estado real, não com o otimista.
3. **Reverificar o projeto inteiro contra regressão** — `npx tsc --noEmit`,
   `npm run testar`, e conferir se a documentação não passou a mentir sobre o
   código.
4. **Só então seguir** para o próximo item.

### Por que esta regra nasceu

Duas coisas aconteceram e as duas eram deriva entre o que se sabia e o que
estava escrito ou publicado:

- o `ROADMAP.md` afirmou "nenhuma tela fala com o Firebase" durante seis dias
  depois de todas falarem;
- o proprietário relatou que o botão Entrar não fazia nada. Era verdade: o que
  estava publicado era anterior ao Firebase, e ninguém tinha republicado.

Nos dois casos o código estava certo. O que estava errado era o que se dizia
sobre ele.

### O passo que mais escapa

O passo 3. Rodar `tsc` e os testes é metade — eles passam com a documentação
mentindo. A outra metade é reler o que os documentos prometem e conferir se
ainda é verdade.

**Status:** aprovado — 29/08/2026.

---

## D-032 — Os mockups são a direção visual

> **A barra desta decisão foi substituída pela D-036 em 01/09/2026.** O resto
> — os mockups como direção visual, as abas do feed, o cartão de post —
> continua valendo.

**Confirmado pelo proprietário — 30/08/2026:** "mais ou menos assim que eu
tenho em mente", sobre `IMAGENS/bancada exemplo app.png` e
`IMAGENS/bancada ex alll.png`.

Isso fecha três coisas que estavam abertas.

### Barra de navegação — conflito resolvido

O `DESIGN_SYSTEM` propunha *Início · Explorar · Ao Vivo · Jogos · Perfil*. Os
mockups mostram, nos três, a mesma coisa:

**Início · Explorar · [+] · Atividades · Mensagens**

Vale a dos mockups. O `[+]` central é o botão de publicar, em destaque verde.

**Ressalva registrada:** Mensagens é Fase 13 e Atividades depende de
notificações (Fase 3). Barra com cinco itens hoje deixaria três mortos por
muito tempo. **A barra nasce com o que existe e cresce** — item que não leva a
lugar nenhum é pior que item ausente, e já corrigimos isso antes com o "Já
tenho conta" que não tinha destino.

### Abas do feed — a pendência 7 muda de forma

Os mockups mostram **FEED · SEGUINDO · COMUNIDADES · TRENDING**.

A pendência 7 perguntava "feed cronológico **ou** híbrido". A resposta dos
mockups é que a pergunta estava errada: **são abas diferentes**, não um
algoritmo só. FEED é descoberta, SEGUINDO é a sua turma. Some a escolha
excludente.

### O cartão de post

Avatar · nome · selo de verificado · tempo relativo · menu `...` · texto ·
mídia · reações com contagem · contagem de comentários e compartilhamentos ·
barra Curtir / Comentar / Compartilhar.

O que existe hoje: apelido, nome, tempo relativo, texto, apagar. O resto entra
por fatias.

---

## D-033 — O que os mockups pedem e o roadmap não previa

**Registrado em 30/08/2026.** Os mockups mostram funções que **não estão em
nenhuma fase** do roadmap:

| O que aparece | Onde estaria |
|---|---|
| **Stories** no topo do feed | fase nova |
| **Níveis e XP** ("NÍVEL BANCADER · 2.450 XP") | fase nova |
| **Comunidades** como aba própria | fase nova |
| **Selo de verificado** | fase nova, e exige critério de verificação |
| **Enquete** no post | dentro da Fase 3 |
| **Compartilhar** | dentro da Fase 3 |
| **Trending** | precisa de sinal de engajamento |
| **Ranking geral** com pontos | perto da Fase 8 |

**Isto não é crítica ao mockup — é aviso de tamanho.** O roadmap tem 19 fases
e leva a 100% da publicação; estes itens somam pelo menos mais quatro frentes.

Duas coisas seguem daqui:

1. **A primeira tela do mockup não é uma tela, são sete.** Stories, live,
   próximos jogos, abas, publicar, feed e ranking — cada bloco é uma fase
   inteira. Construir tudo de uma vez produziria sete cascas em vez de uma
   coisa que funciona;
2. **A ordem continua sendo a do roadmap**, com o mockup servindo de alvo
   visual. Cada fatia entrega uma parte do desenho funcionando de verdade.

**Status:** registrado. O proprietário decide se estas frentes entram no
roadmap agora ou quando chegar a hora.

---

## D-034 — Os nomes são MOMENT e ROLLS, não story e reels

**Decidido pelo proprietário — 01/09/2026**, na especificação da navegação:
*"A BANCADA NÃO utilizará o termo 'Story'. O nome oficial será MOMENT"* e
*"Não utilizar 'Reels'. O nome correto é ROLLS"*.

| Conceito | Nome na BANCADA | O que é |
|---|---|---|
| Publicação que expira | **MOMENT** | o círculo no topo, o equivalente ao story |
| Vídeo curto vertical | **ROLLS** | a aba do meio, o equivalente ao reels |
| Feed principal | **HOME** | onde o app abre |
| Descoberta | **EXPLORAR** | a antiga lupa, agora seção própria |
| Conversas | **MENSAGENS** | |
| Conta da pessoa | **PERFIL** | |

**Por que importa mais do que parece.** "Stories" e "Reels" são marcas
registradas da Meta. Um app brasileiro que os usa como nome de seção não está
se inspirando — está usando marca alheia na própria interface. E, do lado do
produto, o app que copia o vocabulário assume o lugar de cópia: a
especificação é explícita em não querer parecer "um clone literal do
Instagram".

**Onde isso é aplicado no código:** `src/navigation/abas.ts` é a fonte dos
rótulos, e nenhuma tela escreve o nome da seção à mão.

---

## D-035 — Perfil aberto por padrão, privado por escolha; seguir vira pedido

**Decidido pelo proprietário — 01/09/2026**, respondendo à pergunta sobre
"pedidos de amizade": *"seguir para quem tem perfil aberto e pedido de seguir
para quem tem perfil privado! inicialmente todos os perfis são abertos e na
seção de privacidade haverá a opção de privar o perfil"*.

Isso encerra a **pendência 6** ("sistema de amizade além de seguir"): **não
haverá amizade**. O vínculo continua sendo o de seguir — assimétrico, um lado
segue o outro — com um estado a mais.

| Perfil | O que acontece ao tocar em Seguir |
|---|---|
| aberto (padrão) | segue na hora, como hoje |
| privado | vira **pedido**, e o dono aceita ou recusa |

**O que muda no que já existe:**

- o vínculo `seguidores/{seguidorUid}_{alvoUid}` ganha um estado — hoje ele só
  existe ou não existe;
- as Rules passam a precisar **ler o perfil do alvo** para saber se a criação
  direta é permitida. Hoje elas não leem nada além do próprio documento, e
  cada `get()` numa regra é uma leitura cobrada;
- a tela de privacidade da Fase 2, que está como ⬜, ganha o interruptor.

**Confirma a D-015** (perfil público por padrão) em vez de contradizê-la: o
padrão continua aberto. O que a D-035 acrescenta é a saída para quem não quer.

---

## D-036 — A barra tem cinco abas, e substitui a D-032

**Decidido pelo proprietário — 01/09/2026**, com uma nova referência visual
(`IMAGENS/bancada exemplo app.png`, atualizada) e a especificação escrita da
navegação.

### O que muda em relação à D-032

A D-032 registrou *Início · Explorar · [+] · Atividades · Mensagens*. A
especificação nova diz outra coisa, e ela vale:

**HOME · EXPLORAR · ROLLS · MENSAGENS · PERFIL**

Três diferenças, cada uma com motivo:

1. **o `[+]` sai da barra de baixo e sobe para o topo, à esquerda.** Publicar
   deixa de disputar espaço com navegação;
2. **Atividades sai da barra** — as notificações viram o sino do canto
   superior direito;
3. **Perfil entra na barra.** É o destino mais visitado que não tinha atalho.

O topo fica assim: `[+] BANCADA` à esquerda, `[sino] [hambúrguer]` à direita.
**Sem lupa no topo** — a descoberta é a aba Explorar, e ter as duas faria a
mesma função morar em dois lugares.

### A ressalva da D-032 continua valendo, com um ajuste

A D-032 dizia que a barra "nasce com o que existe e cresce". A especificação
nova pede as **cinco posições de uma vez**, e o motivo é bom: a ordem dos
ícones é o que a mão decora, e mudar a posição depois quebra esse aprendizado
em quem já usava.

O acordo, então, é outro: **a barra nasce inteira, o conteúdo não**. Rolls e
Mensagens mostram uma tela que diz o que vão ter e de que fase dependem. Não é
o "item sem destino" que a D-032 proibia — aquele não avisava nada; este
avisa.

### Estado dos ícones — a regra

Verde é ativo, cinza é inativo, e vale para os oito ícones. Duas exceções, as
duas por estado real do aplicativo e nunca por efeito visual:

| Elemento | Cinza | Verde |
|---|---|---|
| aba comum | não selecionada | selecionada |
| **Mensagens** | não selecionada e sem mensagem por ler | selecionada **ou** com mensagem por ler (+ bolinha) |
| **sino** | nada por ver | tem notificação por ver (+ contador) |
| **`+`** | ainda não publicou hoje | já publicou hoje |

O `+` consulta o Firestore de verdade (`publiqueiHoje`): uma leitura, com
`limit(1)`, sobre o índice que já existia. "Hoje" é a meia-noite do relógio do
aparelho — quem publicou às 23h e abre o app à 00h30 tem que ver o botão
apagado, porque para ele virou outro dia.

### Os assets são oficiais

Oito ícones, quatro tamanhos (16/24/32/64), duas cores. Ficam em
`assets/icones/`, gerados por `scripts/gerar-icones.mjs` a partir de
`IMAGENS/icones/`. **Não redesenhar em código, não trocar por emoji, não
importar biblioteca de ícones.** O componente `Icone` escolhe o arquivo pelo
tamanho de tela: um ícone de 26 pontos numa tela 3x precisa de 78 pixels, e
serve o arquivo de 64 reduzido em vez do de 32 ampliado.

**A marca do topo teve que ser recuperada.** O arquivo entregue
(`nome+logo top hambuerguer.png`) veio sem canal alfa, com fundo preto chapado
— colado sobre o grafite ele apareceria como um retângulo. O script reconstrói
a transparência: como a arte é clara sobre preto, o alfa de cada pixel é o
próprio brilho dele (`max(r,g,b)`), e a cor é dividida por esse alfa para
virar alfa reto. O resultado está em `assets/marca/marca-topo.png`.

---

# DECISÕES PENDENTES

Estas decisões devem ser confirmadas pelo proprietário antes das partes afetadas:

1. plataformas da primeira publicação: Android apenas ou Android+iOS;
2. ~~login por apelido ou por e-mail~~ → **decidido em D-016** (opção A);
3. ~~username obrigatório ou opcional~~ → **decidido em D-014**;
4. ~~idade mínima e política de menores~~ → **decidido em D-026**
   (13 anos) e **D-025** (supervisão por contato, não por conteúdo);
5. ~~perfil público por padrão~~ → **decidido em D-015**;
6. ~~sistema de amizade além de seguir~~ → **decidido em D-035**: não
   haverá amizade. Segue valendo o seguir, com pedido quando o perfil for
   privado;
7. ~~feed cronológico ou híbrido~~ → **reformulada pela D-032**: são abas
   (FEED / SEGUINDO), não um algoritmo só. Resta definir o critério de
   ordenação de cada aba quando houver sinais para isso;
8. regras exatas de campeonato;
9. categorias esportivas;
10. campos obrigatórios do jogador;
11. possibilidade de um jogador estar em vários times simultaneamente;
12. transferência entre times;
13. formato de live real;
14. chat da live;
15. sistema de denúncia;
16. monetização;
17. região inicial do lançamento;

18. ~~personalidade jurídica da BANCADA~~ → **decidido em D-020** (Exoduss
    Tec). Faltam apenas os dados de registro: razão social, CNPJ e endereço;
19. **foro e comarca** — depende do endereço da Exoduss Tec (D-020);
20. ~~uso da imagem do usuário em divulgação da BANCADA~~ → **decidido em
    D-022**: não haverá. O consentimento de imagem para marketing deixa de ser
    necessário;
21. ~~transmissão exige anuência dos dois times?~~ → **decidido em D-023**: sim,
    no modelo de convite de partida.

22. ~~supervisão da conta do menor~~ → **decidido em D-025**. Resta apenas
    definir se a faixa **16–17** terá supervisão, já que a lei não exige.

23. ~~liberação de apelido de conta encerrada~~ → **decidido em D-029**: não
    volta a circular. Os documentos foram corrigidos.

24. **App Check antes do beta** — ver D-030. É a mitigação prática contra
    acambarcamento de apelido enquanto não houver Cloud Functions. Estava na
    Fase 15; precisa vir antes.

Quando uma pendência for decidida, registrar aqui com data e motivo.
