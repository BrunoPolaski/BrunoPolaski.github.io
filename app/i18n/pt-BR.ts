// Main language: its shape is the contract every other locale file must match (see Messages).
// Code-like text (event names, HTTP codes, design-pattern names) stays in English on purpose.

/** Text for one design pattern; `frames` line up with the frames in components/folio/Patterns.vue. */
export interface PatternText {
  gist: string
  roles: string[] // per project card; '' = sits this pattern out
  frames: { note: string, say?: Record<number, string> }[]
}

const patterns: Record<'chain' | 'facade' | 'decorator' | 'observer', PatternText> = {
  chain: {
    gist: 'Uma requisição percorre uma cadeia de handlers até que um deles a assuma.',
    roles: ['Handler 1', 'Handler 2', 'Handler 3', 'Handler 4', 'Handler 5', 'Handler 6'],
    frames: [
      { note: 'GET /x7Kq entra na cadeia pelo gateway.', say: { 0: 'rate limit ✓' } },
      { note: 'Não é com ele, então a requisição segue.', say: { 1: 'token ✓' } },
      { note: 'O url-shortener conhece essa rota e a atende.', say: { 2: '301 redirect' } },
      { note: 'POST /upload chega sem token.', say: { 0: 'rate limit ✓' } },
      { note: 'O auth-service a rejeita. Ninguém mais adiante é incomodado.', say: { 1: '401 stop' } },
      { note: 'Uma chamada de ferramenta MCP passa pelos três primeiros handlers…', say: { 0: 'passa', 1: 'passa', 2: 'não é comigo' } },
      { note: '…e o mcp-servers responde.', say: { 3: 'tool result' } },
    ],
  },
  facade: {
    gist: 'Uma interface simples na frente de um subsistema complicado.',
    roles: ['Subsistema', 'Subsistema', 'Subsistema', 'Facade', 'Subsistema', 'Subsistema'],
    frames: [
      { note: 'O cliente faz uma única chamada à facade.', say: { 3: 'getReport()' } },
      { note: 'Por trás dela, a facade coordena cada subsistema.', say: { 0: 'rotear', 1: 'autorizar', 2: 'resolver', 4: 'logar', 5: 'buscar arquivos' } },
      { note: 'O cliente recebe de volta uma única resposta, limpa e padronizada.', say: { 3: '200 report' } },
    ],
  },
  decorator: {
    gist: 'Envolva um objeto para adicionar comportamento sem mexer nele.',
    roles: ['+ rate limit', '+ auth', 'Handler principal', '', '+ logging', ''],
    frames: [
      { note: 'A chamada atinge primeiro o wrapper mais externo.', say: { 0: 'dentro do limite' } },
      { note: 'Cada camada adiciona um comportamento e delega para dentro.', say: { 1: 'token ✓' } },
      { note: 'O logging envolve o núcleo sem alterá-lo.', say: { 4: 'loga a requisição' } },
      { note: 'O handler principal nunca sabe que foi decorado.', say: { 2: 'handle()' } },
      { note: 'O resultado volta pelas mesmas camadas.', say: { 4: 'log 301 · 3ms', 0: '301' } },
    ],
  },
  observer: {
    gist: 'Os assinantes reagem quando o subject muda. Ninguém faz polling.',
    roles: ['Observer', 'Observer', 'Observer', 'Observer', 'Observer', 'Subject'],
    frames: [
      { note: 'Um arquivo novo chega ao bucket: o subject muda.', say: { 5: 'report.csv' } },
      { note: 'Todos os assinantes são notificados de uma vez.', say: { 0: 'recarregar rotas', 1: 'renovar chaves', 2: 'limpar cache', 3: 'sincronizar tools', 4: 'logar evento' } },
      { note: 'O go-logger cancela a assinatura.', say: { 4: 'desinscrito' } },
      { note: 'A próxima mudança só chega a quem ainda está ouvindo.', say: { 5: 'invoice.pdf' } },
    ],
  },
}

const ptBR = {
  meta: {
    title: 'Bruno Polaski, engenheiro de software',
    description: 'Bruno Polaski, engenheiro de software com mais de 3 anos de experiência. R&D Commercial Software Engineer na BairesDev.',
  },
  nav: {
    sections: { top: 'Início', about: 'Sobre', experience: 'Experiência', projects: 'Projetos', process: 'Como trabalho', contact: 'Contato' },
    label: 'Seções',
    progress: 'Progresso da página',
    language: 'Idioma',
    getInTouch: 'Fale comigo',
  },
  hero: {
    role: 'Engenheiro de Software',
    intro: 'Sou o Bruno, engenheiro de software com mais de 3 anos de experiência construindo backends e produtos full-stack. Hoje faço P&D em software comercial na BairesDev.',
    hire: 'Me contrate',
    seeProjects: 'Ver projetos',
    scroll: 'Rolar',
    scrollLabel: 'Rolar até Sobre',
  },
  about: {
    title: 'Sobre mim',
    text: 'Gosto de resolver os problemas difíceis do servidor, construir telas que parecem vivas e conectar as duas pontas tão bem que ninguém vê a emenda. No dia a dia, isso é serviços em Go, integrações e ferramentas MCP no back, e interfaces como esta no front.',
    years: 'Anos de experiência',
    degreeValue: 'Último ano',
    degree: 'Bacharelado em Engenharia de Software',
    repos: 'Repositórios públicos no GitHub',
  },
  experience: {
    title: 'Experiência',
    now: 'atual',
    roles: {
      rd: 'R&D Commercial Software Engineer',
      mid: 'Desenvolvedor Full-stack Pleno',
      junior: 'Desenvolvedor Full-stack Júnior',
      intern: 'Estagiário de Desenvolvimento Full-stack',
    },
  },
  projects: {
    title: 'Projetos',
    lead: 'Escolha um padrão de projeto e meus projetos o encenam. Os nomes levam aos repositórios.',
    more: 'Mais no GitHub',
    patternLabel: 'Padrão de projeto',
    notInPattern: 'Fora deste padrão',
    play: 'Reproduzir',
    pause: 'Pausar',
    next: 'Próximo passo',
    blurbs: {
      'api-gateway': 'API gateway com rate limiter e tabela de rotas em JSON.',
      'auth-service': 'Cuida da autenticação dos outros microsserviços.',
      'url-shortener': 'Clean architecture, MySQL, JWT e suporte a serverless.',
      'mcp-servers': 'Servidor MCP que orquestra integrações com bureaus atrás de uma única interface.',
      'go-logger': 'Logs com níveis sobre o pacote log padrão.',
      's3-bucket-listener': 'Observa um bucket S3 e baixa cada arquivo novo.',
    },
    patterns,
  },
  process: {
    title: 'Como trabalho',
    lead: 'Meu processo como uma saga: cada etapa é um handler que reage a um evento e publica o próximo.',
    step: 'Etapa',
    handlers: [
      { name: 'Descoberta', text: 'Entender o objetivo, os usuários e as restrições.' },
      { name: 'Desenvolvimento', text: 'Incrementos pequenos e revisados, que você pode testar.' },
      { name: 'Revisão', text: 'Testes, code review e uma demo antes de qualquer entrega.' },
      { name: 'Lançamento', text: 'Publicar, medir e continuar melhorando.' },
    ],
    notes: [
      'Um item do backlog é publicado no log como evento.',
      'A Descoberta o trata e publica o que aprendeu.',
      'O Desenvolvimento reage ao escopo e entrega um incremento.',
      'A Revisão reprova: um evento compensatório devolve o trabalho. Sem estado compartilhado, sem rollback manual.',
      'O Desenvolvimento corrige e publica de novo.',
      'A Revisão aprova, e o Lançamento assume.',
      'Publicado e medido. A saga termina; o próximo item já está no log.',
    ],
    state: { handling: 'processando', reworking: 'retrabalho', done: 'feito' },
    status: { running: 'em andamento', compensating: 'compensando', completed: 'concluída' },
  },
  contact: {
    title: 'Tem uma ideia?',
    lead: 'Me conta o que você está construindo.',
  },
  footer: { top: 'Voltar ao topo', domain: 'domínio', label: 'Onde me encontrar' },
}

export type Messages = typeof ptBR
export default ptBR
