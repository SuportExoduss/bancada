/**
 * GERADO AUTOMATICAMENTE — não edite este arquivo.
 *
 * Fonte: docs/12-legal/*.md
 * Para atualizar: node scripts/gerar-documentos-legais.mjs
 *
 * O Markdown em docs/ é a única fonte de verdade. Documento jurídico que
 * existe em duas cópias diverge, e a cópia errada é sempre a que o usuário lê.
 */

export type Bloco =
  | { t: 'h1' | 'h2' | 'h3' | 'h4'; x: string }
  | { t: 'p'; x: string }
  | { t: 'li'; x: string }
  | { t: 'hr' }
  | { t: 'destaque'; linhas: string[] }
  | { t: 'cabecalho' | 'linha'; c: string[] };

export interface DocumentoLegal {
  titulo: string;
  origem: string;
  /** true enquanto o texto ainda tiver lacunas por preencher */
  rascunho: boolean;
  blocos: Bloco[];
}

export const documentosLegais = {
  termos: {
    titulo: "Termos de Uso",
    origem: "docs/12-legal/TERMOS_DE_USO.md",
    rascunho: true,
    blocos: [
          {
                "t": "h2",
                "x": "1. Em uma página"
          },
          {
                "t": "p",
                "x": "Antes do texto longo, o resumo honesto. Este resumo não substitui as seções seguintes, mas nada nelas contradiz o que está aqui."
          },
          {
                "t": "li",
                "x": "A BANCADA é uma plataforma para a várzea: times, jogos, campeonatos, jogadores e torcida no mesmo lugar. É um produto da **Exoduss Tec**."
          },
          {
                "t": "li",
                "x": "**Usar é de graça.** Não cobramos para você ter perfil, entrar num time ou registrar seu jogo."
          },
          {
                "t": "li",
                "x": "**O que você publica continua sendo seu.** Você nos dá permissão para exibir na plataforma — só isso, e só enquanto o conteúdo estiver lá."
          },
          {
                "t": "li",
                "x": "**Não usamos você na nossa propaganda.** Sua foto, seu nome e seus dados não entram em material de divulgação da BANCADA."
          },
          {
                "t": "li",
                "x": "**Seu apelido é único** e é como as pessoas te acham. Ele é público."
          },
          {
                "t": "li",
                "x": "**Transmitir um jogo depende dos dois times.** Quem convida e quem aceita."
          },
          {
                "t": "li",
                "x": "**A idade mínima é 13 anos.** De 13 a 15, quem cria e acompanha a conta é o responsável — que vê **com quem** o menor conversa, não o que ele escreve. E o menor sempre sabe o que o responsável enxerga."
          },
          {
                "t": "li",
                "x": "Se você desrespeitar as pessoas, a gente age. E se a gente errar com você, você pode recorrer."
          },
          {
                "t": "li",
                "x": "**Você pode sair quando quiser** e levar seus dados com você."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "2. Quem somos"
          },
          {
                "t": "p",
                "x": "A BANCADA é operada pela **Exoduss Tec**, `[A DEFINIR: razão social completa]`, inscrita no CNPJ sob o nº `[A DEFINIR]`, com sede em `[A DEFINIR: endereço]`."
          },
          {
                "t": "p",
                "x": "Quando estes Termos disserem \"nós\", \"a BANCADA\" ou \"a plataforma\", é dela que se trata. Quando disserem \"você\", é da pessoa que usa o aplicativo."
          },
          {
                "t": "p",
                "x": "A BANCADA é o nome do produto. A Exoduss Tec é a empresa por trás dele — a mesma relação que existe entre um aplicativo e a empresa que o desenvolve."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "3. Quem pode usar"
          },
          {
                "t": "h3",
                "x": "3.1 Idade"
          },
          {
                "t": "p",
                "x": "A idade mínima para ter conta na BANCADA é **13 anos**."
          },
          {
                "t": "cabecalho",
                "c": [
                      "Sua idade",
                      "Como funciona"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Menos de 13",
                      "Não é possível ter conta"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "**13 a 15**",
                      "A conta é criada pelo seu responsável e fica ligada à dele"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "**16 e 17**",
                      "Você cria sua própria conta"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "**18 ou mais**",
                      "Conta própria, sem supervisão"
                ]
          },
          {
                "t": "h3",
                "x": "3.2 Menores de 16 anos"
          },
          {
                "t": "p",
                "x": "Quem tem menos de 16 anos **não cria a própria conta**. A conta é criada pelo responsável legal — mãe, pai ou tutor — a partir da conta dele, e fica **vinculada** a ela."
          },
          {
                "t": "p",
                "x": "**O que o responsável enxerga e controla:** com quem o menor conversa, podendo bloquear qualquer contato · quem segue e quem pode mandar mensagem · bloqueio de conteúdo e temas · limite de tempo de uso · aviso de qualquer denúncia envolvendo o menor."
          },
          {
                "t": "p",
                "x": "**O que o responsável não faz:** ler o conteúdo das mensagens. Alertas automáticos de risco chegam a ele, e em caso de risco concreto existe um pedido de acesso ao conteúdo — que fica **registrado e visível para o menor**."
          },
          {
                "t": "p",
                "x": "**O menor sempre sabe o que o responsável enxerga.** Isso está escrito na conta dele, em linguagem que ele entende. Não existe acompanhamento escondido na BANCADA, e essa regra não tem exceção."
          },
          {
                "t": "p",
                "x": "O que o menor publica é responsabilidade do menor e de quem responde por ele."
          },
          {
                "t": "p",
                "x": "A vinculação não é escolha nossa: a Lei 15.211/2025 a exige e **proíbe** que a idade seja apenas declarada por quem se cadastra. Já o limite da supervisão é escolha nossa — a lei pede controle parental, não pede leitura de conversa, e o ECA (art. 17) protege também a intimidade do adolescente."
          },
          {
                "t": "h3",
                "x": "3.3 Uma conta por pessoa"
          },
          {
                "t": "p",
                "x": "Cada pessoa tem uma conta, com informações verdadeiras. Perfil de time, campeonato ou página é outra coisa, e pode ser criado por quem tem conta."
          },
          {
                "t": "h3",
                "x": "3.4 Quem não pode"
          },
          {
                "t": "p",
                "x": "Não pode usar a BANCADA quem teve a conta encerrada por nós por violação grave destes Termos, enquanto durar o impedimento."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "4. Sua conta e seu apelido"
          },
          {
                "t": "h3",
                "x": "4.1 A conta só existe quando você termina"
          },
          {
                "t": "p",
                "x": "Nada é criado enquanto você está preenchendo. Sua conta passa a existir no momento em que você confirma no botão final. Se desistir no meio, nada fica guardado e você pode recomeçar com o mesmo e-mail."
          },
          {
                "t": "h3",
                "x": "4.2 Seu apelido"
          },
          {
                "t": "p",
                "x": "O apelido é sua identidade pública na BANCADA. É por ele que as pessoas te encontram."
          },
          {
                "t": "li",
                "x": "É **único**: se alguém já tem, você precisa escolher outro."
          },
          {
                "t": "li",
                "x": "Maiúscula e minúscula aparecem como você escreveu, mas **não criam apelidos diferentes**: `Lucas_Rocha` e `lucas_rocha` são o mesmo apelido, e só um pode existir."
          },
          {
                "t": "li",
                "x": "Alguns apelidos são reservados por confundirem com áreas do app."
          },
          {
                "t": "li",
                "x": "Dá para trocar, mas não toda hora — apelido que muda sempre deixa de servir para te achar."
          },
          {
                "t": "h3",
                "x": "4.3 Sua senha"
          },
          {
                "t": "p",
                "x": "A senha é sua e não deve ser compartilhada. Se desconfiar que alguém teve acesso à sua conta, troque a senha e nos avise."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "5. O que é seu e o que você nos autoriza a fazer"
          },
          {
                "t": "h3",
                "x": "5.1 O conteúdo é seu"
          },
          {
                "t": "p",
                "x": "Foto, vídeo, texto, comentário: **você continua dono de tudo que publica**. Nós não nos tornamos donos de nada seu."
          },
          {
                "t": "h3",
                "x": "5.2 A permissão que você nos dá"
          },
          {
                "t": "p",
                "x": "Para conseguirmos mostrar seu conteúdo, você nos dá uma licença **gratuita, não exclusiva e válida em qualquer lugar** para hospedar, armazenar, copiar, redimensionar, adaptar formato e exibir o que você publica **dentro da BANCADA**."
          },
          {
                "t": "p",
                "x": "É o mínimo técnico para o app funcionar: guardar a foto, gerar a versão menor que aparece na lista, mostrar no perfil e no feed de quem te segue."
          },
          {
                "t": "h3",
                "x": "5.3 Os limites dessa permissão — e eles são estreitos"
          },
          {
                "t": "p",
                "x": "Esta permissão serve para **operar a plataforma e mais nada**. Especificamente:"
          },
          {
                "t": "li",
                "x": "**Não** usamos seu conteúdo em propaganda da BANCADA."
          },
          {
                "t": "li",
                "x": "**Não** licenciamos nem vendemos seu conteúdo para terceiros."
          },
          {
                "t": "li",
                "x": "**Não** usamos sua imagem para promover a plataforma."
          },
          {
                "t": "h3",
                "x": "5.4 Quando a permissão acaba"
          },
          {
                "t": "p",
                "x": "Quando você apaga o conteúdo ou encerra a conta, **a permissão acaba junto** e retiramos o conteúdo de circulação."
          },
          {
                "t": "p",
                "x": "Duas ressalvas honestas, que valem para qualquer plataforma:"
          },
          {
                "t": "li",
                "x": "o que outras pessoas já compartilharam ou salvaram fora da BANCADA não está mais ao nosso alcance;"
          },
          {
                "t": "li",
                "x": "podemos precisar manter cópias por prazo determinado quando a lei exigir, ou enquanto durar uma apuração de denúncia."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "6. Imagem, jogo e transmissão"
          },
          {
                "t": "p",
                "x": "Esta seção existe porque a BANCADA não é só um lugar onde você posta sua foto. Aqui se registram jogos, e jogo tem outras pessoas dentro."
          },
          {
                "t": "h3",
                "x": "6.1 Transmitir depende dos dois times"
          },
          {
                "t": "p",
                "x": "Transmitir uma partida funciona como um convite: um time propõe, e a transmissão **só acontece depois que o time adversário aceita**. Ao aceitar, o adversário também pode abrir a própria transmissão."
          },
          {
                "t": "p",
                "x": "Isso não é formalidade nossa. A Lei Geral do Esporte (Lei 14.597/2023, art. 160, §6º) determina que, quando não há mando de jogo definido — o caso da maioria dos jogos de várzea — captar e transmitir depende da concordância das organizações participantes."
          },
          {
                "t": "h3",
                "x": "6.2 A imagem de cada pessoa continua dela"
          },
          {
                "t": "p",
                "x": "O time aceitar a transmissão **não** dá a ninguém o direito de usar o rosto de um jogador para outra finalidade. O direito de imagem é individual e não é transferido pelo aceite do time."
          },
          {
                "t": "p",
                "x": "Dentro da BANCADA, a exibição do jogo é o próprio serviço. Fora dela, ou para qualquer uso comercial, é preciso autorização da pessoa."
          },
          {
                "t": "h3",
                "x": "6.3 Ao publicar, você responde pelo que está na imagem"
          },
          {
                "t": "p",
                "x": "Se você publica foto ou vídeo com outras pessoas, você declara que pode fazer isso. Se alguém aparece e não quer aparecer, pode nos pedir a remoção pelo canal de denúncia — e nós removemos."
          },
          {
                "t": "h3",
                "x": "6.4 Menores em imagem"
          },
          {
                "t": "p",
                "x": "Publicar imagem de criança ou adolescente exige o cuidado do responsável. A proteção de menor é de ordem pública: nem a autorização do responsável torna lícita a exposição que humilhe, sexualize ou exponha o menor a risco. Conteúdo assim é removido sem aviso e a conta responde por ele."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "7. O que não pode"
          },
          {
                "t": "p",
                "x": "A regra geral é simples: **trate as pessoas como você trataria alguém que está na sua frente, no seu campo, junto com a família dela.**"
          },
          {
                "t": "p",
                "x": "Em concreto, não é permitido:"
          },
          {
                "t": "li",
                "x": "publicar conteúdo que envolva criança ou adolescente de forma sexualizada, ou que os exponha a risco;"
          },
          {
                "t": "li",
                "x": "ameaçar, perseguir, humilhar ou incitar violência contra alguém;"
          },
          {
                "t": "li",
                "x": "discurso de ódio por raça, cor, etnia, religião, origem, deficiência, idade, gênero ou orientação sexual;"
          },
          {
                "t": "li",
                "x": "incitar suicídio ou automutilação;"
          },
          {
                "t": "li",
                "x": "fazer-se passar por outra pessoa, time ou organização;"
          },
          {
                "t": "li",
                "x": "publicar dado pessoal de terceiro sem autorização — endereço, telefone, documento;"
          },
          {
                "t": "li",
                "x": "publicar conteúdo com direito autoral de outra pessoa sem permissão;"
          },
          {
                "t": "li",
                "x": "**promover casa de aposta ou publicar link de afiliado de aposta**, inclusive palpite de aposta sobre jogo da plataforma;"
          },
          {
                "t": "li",
                "x": "vender ou anunciar produto ilícito;"
          },
          {
                "t": "li",
                "x": "spam, robô, coleta automatizada de dados (*scraping*) ou tentativa de burlar limites técnicos;"
          },
          {
                "t": "li",
                "x": "manipular resultado, estatística ou placar de forma desonesta."
          },
          {
                "t": "p",
                "x": "Nem tudo o que não está nesta lista é permitido, e nem tudo o que está nela esgota o assunto. As Diretrizes da Comunidade detalham os casos."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "8. Conteúdo de outras pessoas e denúncia"
          },
          {
                "t": "p",
                "x": "A maior parte do que você vê na BANCADA foi publicada por outros usuários. Não somos autores desse conteúdo e não conferimos cada publicação antes de ela aparecer."
          },
          {
                "t": "p",
                "x": "Mas isso **não** significa que lavamos as mãos."
          },
          {
                "t": "p",
                "x": "Todo conteúdo tem um caminho de denúncia dentro do app, e há um canal de atendimento aberto também para quem não tem conta — porque quem é ofendido nem sempre é usuário."
          },
          {
                "t": "p",
                "x": "Removemos por iniciativa própria, sem esperar denúncia e sem esperar decisão judicial, conteúdo que envolva: crime sexual contra criança ou adolescente, terrorismo, atos antidemocráticos, incitação a suicídio ou automutilação, discurso de ódio, tráfico de pessoas."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "9. Como moderamos e como você recorre"
          },
          {
                "t": "h3",
                "x": "9.1 O que podemos fazer"
          },
          {
                "t": "p",
                "x": "Conforme a gravidade: remover o conteúdo · limitar o alcance · suspender a conta por tempo determinado · encerrar a conta."
          },
          {
                "t": "h3",
                "x": "9.2 Você é avisado e pode recorrer"
          },
          {
                "t": "p",
                "x": "Sempre que agirmos sobre você, dizemos **o que** foi feito e **por quê**, e você pode pedir revisão. O recurso é analisado por pessoa, não só por sistema."
          },
          {
                "t": "p",
                "x": "A única exceção é quando a lei nos proibir de avisar — o que acontece, por exemplo, em investigação de crime contra criança."
          },
          {
                "t": "h3",
                "x": "9.3 Se a gente errar"
          },
          {
                "t": "p",
                "x": "Se o recurso mostrar que erramos, o conteúdo volta e a restrição sai do seu histórico. Errar acontece. Não corrigir é que não pode."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "10. Encerrar sua conta"
          },
          {
                "t": "p",
                "x": "Você pode encerrar quando quiser, pelo próprio app, sem precisar dar explicação e sem falar com ninguém."
          },
          {
                "t": "p",
                "x": "Ao encerrar: seu perfil sai do ar · seu conteúdo é retirado de circulação · seu apelido volta a ficar disponível depois de um período de segurança."
          },
          {
                "t": "p",
                "x": "Antes de encerrar, você pode **baixar seus dados**."
          },
          {
                "t": "p",
                "x": "Nós só encerramos a sua conta por violação grave ou repetida destes Termos, ou por determinação legal — e sempre com aviso e direito a recurso, na forma da seção 9."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "11. Limites da nossa responsabilidade"
          },
          {
                "t": "destaque",
                "linhas": [
                      "⚠️ LEIA COM ATENÇÃO — ESTA SEÇÃO LIMITA DIREITOS",
                      "",
                      "**A BANCADA não se responsabiliza por:**",
                      "",
                      "- **o que acontece fora da plataforma**, inclusive combinações, jogos,",
                      "pagamentos e desentendimentos entre usuários, times ou campeonatos;",
                      "- **a conduta de outros usuários**, inclusive informação falsa que alguém",
                      "publique sobre si mesmo, sobre um time ou sobre um jogo;",
                      "- **interrupções, falhas ou indisponibilidade** do serviço, inclusive as",
                      "causadas por internet, aparelho ou serviços de terceiros;",
                      "- **perda de conteúdo** decorrente de falha técnica, ainda que façamos o que",
                      "está ao nosso alcance para evitá-la.",
                      "",
                      "**O que continua sob nossa responsabilidade, e não é afastado por esta",
                      "seção:** danos que causarmos por dolo ou culpa, o cumprimento do Código de",
                      "Defesa do Consumidor, e todos os direitos que a lei brasileira garante a você",
                      "e que não podem ser renunciados por contrato."
                ]
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "12. Mudanças nestes Termos"
          },
          {
                "t": "p",
                "x": "Podemos mudar estes Termos. Quando a mudança for relevante, avisamos **dentro do app e com pelo menos 30 dias de antecedência**, com o que mudou em destaque — não só um aviso de que \"os termos mudaram\"."
          },
          {
                "t": "p",
                "x": "Se você não concordar, pode encerrar a conta antes de a mudança valer, levando seus dados."
          },
          {
                "t": "p",
                "x": "Toda versão anterior fica disponível para consulta, com a data em que valeu."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "13. Lei aplicável e foro"
          },
          {
                "t": "destaque",
                "linhas": [
                      "⚠️ LEIA COM ATENÇÃO",
                      "",
                      "Estes Termos são regidos pela **lei brasileira**.",
                      "",
                      "Fica eleito o foro da comarca de **`[A DEFINIR]`** para dirimir questões",
                      "decorrentes destes Termos.",
                      "",
                      "**Se você for consumidor, esta cláusula não afasta o seu direito de acionar a",
                      "BANCADA no foro do seu próprio domicílio**, na forma do Código de Defesa do",
                      "Consumidor."
                ]
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "14. Como falar com a gente"
          },
          {
                "t": "li",
                "x": "**Dentro do app:** Ajuda → Falar com a BANCADA"
          },
          {
                "t": "li",
                "x": "**E-mail:** suportexoduss333@gmail.com"
          },
          {
                "t": "li",
                "x": "**Encarregado de dados (DPO):** suportexoduss333@gmail.com — para assuntos de privacidade, ver a Política de Privacidade"
          },
          {
                "t": "li",
                "x": "**Endereço:** `[A DEFINIR]`"
          },
          {
                "t": "p",
                "x": "Respondemos toda denúncia e todo recurso. Não deixamos mensagem sem resposta."
          },
          {
                "t": "hr"
          },
          {
                "t": "p",
                "x": "*Última atualização: `[data da publicação]` · Versão 1.0*"
          }
    ] as Bloco[],
  },
  privacidade: {
    titulo: "Política de Privacidade",
    origem: "docs/12-legal/POLITICA_DE_PRIVACIDADE.md",
    rascunho: true,
    blocos: [
          {
                "t": "h2",
                "x": "1. Em uma página"
          },
          {
                "t": "li",
                "x": "**Quem cuida dos seus dados:** Exoduss Tec, que opera a BANCADA."
          },
          {
                "t": "li",
                "x": "**Não vendemos seus dados.** Para ninguém, por nenhum valor."
          },
          {
                "t": "li",
                "x": "**Não usamos você na nossa propaganda.** Nem seus dados, nem sua imagem."
          },
          {
                "t": "li",
                "x": "**Coletamos pouco:** o que você digita, o que você publica e o mínimo técnico para o app funcionar e ser seguro."
          },
          {
                "t": "li",
                "x": "**Seu apelido, seu nome e seu conteúdo são públicos** — é assim que as pessoas te acham na várzea. Seu e-mail e sua senha **não** são."
          },
          {
                "t": "li",
                "x": "**Dado de menor de idade recebe tratamento reforçado.**"
          },
          {
                "t": "li",
                "x": "**Você manda nos seus dados:** pode ver, corrigir, baixar e apagar."
          },
          {
                "t": "li",
                "x": "**Quer falar sobre isso?** Tem um canal direto no fim deste texto."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "2. Quem é responsável"
          },
          {
                "t": "p",
                "x": "**Exoduss Tec**, `[A DEFINIR: razão social]`, CNPJ `[A DEFINIR]`, com sede em `[A DEFINIR]`, é a **controladora** dos dados pessoais tratados na BANCADA."
          },
          {
                "t": "p",
                "x": "**Encarregado pelo Tratamento de Dados Pessoais (DPO):** suportexoduss333@gmail.com"
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "3. Que dados coletamos, para quê, e com que base legal"
          },
          {
                "t": "p",
                "x": "A LGPD exige que todo tratamento tenha uma **base legal**. Abaixo está cada dado, a finalidade e a base. A coluna da base não é burocracia: ela diz o que você pode exigir que a gente pare de fazer."
          },
          {
                "t": "h3",
                "x": "3.1 Dados que você fornece"
          },
          {
                "t": "cabecalho",
                "c": [
                      "Dado",
                      "Para quê",
                      "Base legal"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Nome e sobrenome",
                      "Identificar você no perfil",
                      "Execução de contrato"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Apelido",
                      "Sua identidade pública; como te acham",
                      "Execução de contrato"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "E-mail",
                      "Entrar na conta, recuperar senha, avisos essenciais",
                      "Execução de contrato"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Senha",
                      "Proteger sua conta (guardada cifrada, ninguém da BANCADA a vê)",
                      "Execução de contrato"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Foto de perfil",
                      "Ilustrar seu perfil",
                      "Execução de contrato"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Conteúdo que você publica",
                      "Mostrar na plataforma",
                      "Execução de contrato"
                ]
          },
          {
                "t": "h3",
                "x": "3.2 Dados gerados pelo uso"
          },
          {
                "t": "cabecalho",
                "c": [
                      "Dado",
                      "Para quê",
                      "Base legal"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Registros de acesso (IP, data e hora)",
                      "Segurança e cumprimento do art. 15 do Marco Civil",
                      "Obrigação legal"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Time, jogos, gols, cartões, escalações",
                      "Montar seu histórico e as estatísticas",
                      "Execução de contrato"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Denúncias que você faz ou recebe",
                      "Moderar e responder",
                      "Execução de contrato / obrigação legal"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Dados técnicos do aparelho (modelo, versão do sistema)",
                      "Corrigir erro e manter o app funcionando",
                      "Legítimo interesse"
                ]
          },
          {
                "t": "h3",
                "x": "3.3 Dados que pedimos separadamente"
          },
          {
                "t": "p",
                "x": "Estes **não** são necessários para o serviço. Pedimos com consentimento, e **recusar não te tira nada**:"
          },
          {
                "t": "cabecalho",
                "c": [
                      "Dado",
                      "Para quê",
                      "Base legal"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Notificações e novidades por e-mail",
                      "Avisar sobre a plataforma",
                      "Consentimento"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Localização",
                      "Achar campos e jogos perto de você",
                      "Consentimento"
                ]
          },
          {
                "t": "p",
                "x": "Você pode voltar atrás a qualquer momento, nas configurações, sem precisar justificar."
          },
          {
                "t": "h3",
                "x": "3.4 O que **não** coletamos"
          },
          {
                "t": "p",
                "x": "Não pedimos CPF, RG, dado bancário, dado de saúde, biometria, religião nem opinião política. Se um dia algum deles for necessário para uma função nova, avisaremos antes e pediremos separadamente."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "4. O que é público e o que não é"
          },
          {
                "t": "p",
                "x": "Isso costuma ser a maior surpresa em qualquer rede social, então está separado em seção própria."
          },
          {
                "t": "p",
                "x": "**Público — qualquer pessoa vê, mesmo sem conta:** seu apelido · seu nome · sua foto de perfil · o que você publica · seus times · suas estatísticas de jogo."
          },
          {
                "t": "p",
                "x": "**Não é público — só você vê:** seu e-mail · sua senha · seus registros de acesso · suas denúncias."
          },
          {
                "t": "p",
                "x": "O perfil é público por padrão porque a BANCADA existe para dar **visibilidade** a quem joga. Um perfil escondido não é achado por quem procura jogador, e é justamente esse encontro que a plataforma quer provocar."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "5. Com quem compartilhamos"
          },
          {
                "t": "p",
                "x": "**Não vendemos dados pessoais.** Não compartilhamos com anunciante. Não alimentamos corretor de dados."
          },
          {
                "t": "p",
                "x": "Compartilhamos apenas com:"
          },
          {
                "t": "li",
                "x": "**Google (Firebase)** — presta a infraestrutura que guarda os dados e faz a autenticação. Atua como **operador**: trata os dados por conta da BANCADA e seguindo nossas instruções."
          },
          {
                "t": "li",
                "x": "**Autoridades** — quando houver ordem judicial ou requisição legal válida. Quando pudermos avisar você, avisamos."
          },
          {
                "t": "p",
                "x": "Havendo transferência internacional de dados (o Firebase opera em servidores fora do Brasil), ela se dá com as garantias exigidas pelo capítulo V da LGPD."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "6. Por quanto tempo guardamos"
          },
          {
                "t": "cabecalho",
                "c": [
                      "Dado",
                      "Prazo"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Perfil e conteúdo",
                      "Enquanto a conta existir"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Registros de acesso",
                      "6 meses, por exigência do art. 15 do Marco Civil"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Dados após você encerrar a conta",
                      "Removidos em até 30 dias"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Apelido após o encerramento",
                      "Bloqueado por um período de segurança, depois liberado"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Registro de denúncia e moderação",
                      "Enquanto durar a apuração e o prazo de recurso"
                ]
          },
          {
                "t": "p",
                "x": "Prazo legal maior prevalece sobre esta tabela quando existir."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "7. Seus direitos, e como usar"
          },
          {
                "t": "p",
                "x": "A LGPD (arts. 17 a 22) te dá direitos sobre seus dados. Na BANCADA eles são exercidos assim:"
          },
          {
                "t": "cabecalho",
                "c": [
                      "Direito",
                      "Como"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Saber se tratamos seus dados e acessá-los",
                      "Configurações → Meus dados"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Corrigir dado errado",
                      "Editar o perfil, ou pelo canal de contato"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Baixar tudo o que é seu",
                      "Configurações → Baixar meus dados"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Apagar seus dados",
                      "Configurações → Encerrar conta"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Retirar um consentimento",
                      "Configurações → Privacidade"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Saber com quem compartilhamos",
                      "Seção 5 deste documento"
                ]
          },
          {
                "t": "linha",
                "c": [
                      "Reclamar à autoridade",
                      "Diretamente à **ANPD** — [gov.br/anpd](https://www.gov.br/anpd)"
                ]
          },
          {
                "t": "p",
                "x": "Respondemos em até **15 dias**. Se um pedido não puder ser atendido, dizemos **por que** — não deixamos sem resposta."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "8. Crianças e adolescentes"
          },
          {
                "t": "p",
                "x": "Esta seção é a mais importante para nós, e vale a leitura mesmo de quem não tem filho na plataforma."
          },
          {
                "t": "p",
                "x": "**A idade mínima na BANCADA é 13 anos.**"
          },
          {
                "t": "p",
                "x": "**De 13 a 15, a conta é criada pelo responsável legal**, a partir da conta dele, e fica vinculada a ela. A idade não é apenas declarada — a Lei 15.211/2025 proíbe isso. De 16 anos em diante a pessoa cria a própria conta."
          },
          {
                "t": "p",
                "x": "**O responsável enxerga o contato, não o conteúdo.** Ele vê com quem o menor conversa e pode bloquear qualquer contato, mas não lê as mensagens. Alertas automáticos de risco chegam a ele; em risco concreto há um pedido de acesso ao conteúdo, que fica registrado e visível para o menor."
          },
          {
                "t": "p",
                "x": "Fizemos assim de propósito. Uma conta lida por inteiro tira do menor o canal por onde ele pediria ajuda — e é justamente na mensagem privada que um pedido de socorro costuma sair."
          },
          {
                "t": "p",
                "x": "**O menor sabe o que o responsável enxerga.** Está escrito na conta dele, em linguagem que ele entende. Acompanhamento escondido não protege ninguém."
          },
          {
                "t": "p",
                "x": "**Coletamos o mínimo.** Dado de menor não vira estatística de uso, não alimenta recomendação e não sai da plataforma."
          },
          {
                "t": "p",
                "x": "**Nunca haverá publicidade direcionada a menor de idade na BANCADA.**"
          },
          {
                "t": "p",
                "x": "Se descobrirmos uma conta de menor criada fora dessa regra, ela é suspensa e o responsável é procurado."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "9. Segurança"
          },
          {
                "t": "li",
                "x": "Senha guardada de forma cifrada, pelo Firebase Authentication. **Ninguém da BANCADA tem acesso à sua senha** — nem para te ajudar."
          },
          {
                "t": "li",
                "x": "Comunicação entre o app e o servidor sempre criptografada."
          },
          {
                "t": "li",
                "x": "Acesso aos dados restrito ao necessário, com registro."
          },
          {
                "t": "li",
                "x": "As regras de quem pode ler e escrever cada dado são aplicadas **no servidor**, não no aplicativo — não adianta alterar o app para ver o que não é seu."
          },
          {
                "t": "p",
                "x": "Nenhum sistema é infalível. Se acontecer um incidente que traga risco a você, avisaremos você e a ANPD, na forma do art. 48 da LGPD."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "10. Mudanças nesta Política"
          },
          {
                "t": "p",
                "x": "Quando esta Política mudar de forma relevante, avisamos dentro do app com pelo menos 30 dias de antecedência, apontando **o que** mudou."
          },
          {
                "t": "p",
                "x": "Versões anteriores ficam disponíveis, com a data em que valeram."
          },
          {
                "t": "hr"
          },
          {
                "t": "h2",
                "x": "11. Falar sobre privacidade"
          },
          {
                "t": "li",
                "x": "**Encarregado (DPO):** suportexoduss333@gmail.com"
          },
          {
                "t": "li",
                "x": "**Dentro do app:** Configurações → Privacidade → Falar com o Encarregado"
          },
          {
                "t": "li",
                "x": "**ANPD:** [gov.br/anpd](https://www.gov.br/anpd) — você pode reclamar diretamente à autoridade, sem passar por nós."
          },
          {
                "t": "hr"
          },
          {
                "t": "p",
                "x": "*Última atualização: `[data da publicação]` · Versão 1.0*"
          }
    ] as Bloco[],
  },
} satisfies Record<string, DocumentoLegal>;

export type ChaveDocumento = keyof typeof documentosLegais;
