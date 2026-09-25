import type { Messages } from './pt-BR'

const en: Messages = {
  meta: {
    title: 'Bruno Polaski, software engineer',
    description: 'Bruno Polaski, software engineer with 3+ years of experience. R&D Commercial Software Engineer at BairesDev.',
  },
  nav: {
    sections: { top: 'Intro', about: 'About', experience: 'Experience', projects: 'Projects', process: 'How I work', contact: 'Contact' },
    label: 'Sections',
    language: 'Language',
    toLight: 'Use light theme',
    toDark: 'Use dark theme',
  },
  hero: {
    intro: 'I\'m Bruno, a software engineer with 3+ years of experience building backends and full-stack products. Right now I do R&D on commercial software at BairesDev.',
    hire: 'Hire me',
    hireText: 'Hi Bruno! I saw your portfolio and would like to talk about an opportunity.',
    seeProjects: 'See projects',
    scroll: 'Scroll',
    scrollLabel: 'Scroll to About',
  },
  about: {
    title: 'About me',
    text: 'I like solving the hard problems on the server, building screens that feel alive, and connecting the two so cleanly you can\'t see the seam. Most days that\'s Go services, integrations and MCP tooling in the back, and interfaces like this one in the front.',
    years: 'Years of experience',
    degreeValue: 'Final year',
    degree: 'Software Engineering bachelor\'s',
    repos: 'Public repos on GitHub',
  },
  experience: {
    title: 'Experience',
    now: 'now',
    roles: {
      rd: 'R&D Commercial Software Engineer',
      mid: 'Mid-level Full-stack Developer',
      junior: 'Junior Full-stack Developer',
      intern: 'Full-stack Developer Intern',
    },
    // tooltip per icon; the icons are in pages/index.vue, under the same keys
    acts: {
      rd: {
        building: 'Still writing my story here. Focused on delivering quality and value to the team.',
      },
      mid: {
        components: 'White-label front ends in Vue 3: componentized, responsive and wired to the back end.',
        features: 'Back ends and databases in PHP and Go for B2C insurance and credit sales, from model to production.',
        devops: 'Infrastructure as code (GitHub Actions, Terraform, AWS SAM, Serverless) and CI/CD for the team.',
      },
      junior: {
        server: 'Kept a multi-tenant PHP sales back end running in production.',
        products: 'Integrated new insurance and credit products while the project was underway.',
      },
      intern: {
        mobile: 'Flutter screens for the wallet of a BaaS app (credit and FAQ).',
        backoffice: 'A white-label, multi-tenant sales system in Vue 3 used by partners.',
        api: 'API features in PHP with hexagonal architecture, reviewed by senior engineers.',
      },
    },
  },
  projects: {
    title: 'Projects',
    lead: 'Pick a design pattern and my projects act it out. Names link to the repos.',
    more: 'More on GitHub',
    patternLabel: 'Design pattern',
    notInPattern: 'Not in this pattern',
    play: 'Play',
    pause: 'Pause',
    next: 'Next step',
    blurbs: {
      'api-gateway': 'API gateway with a rate limiter and a JSON route table.',
      'auth-service': 'Handles authentication for other microservices.',
      'url-shortener': 'Clean architecture, MySQL, JWT and serverless support.',
      'mcp-servers': 'MCP server that orchestrates bureau integrations behind one interface.',
      'go-logger': 'Leveled logging on top of the standard log package.',
      's3-bucket-listener': 'Watches an S3 bucket and downloads every new file.',
    },
    patterns: {
      chain: {
        gist: 'A request walks a chain of handlers until one of them takes it.',
        roles: ['Handler 1', 'Handler 2', 'Handler 3', 'Handler 4', 'Handler 5', 'Handler 6'],
        frames: [
          { note: 'GET /x7Kq enters the chain at the gateway.', say: { 0: 'rate limit ✓' } },
          { note: 'Not its job, so the request moves on.', say: { 1: 'token ✓' } },
          { note: 'url-shortener knows this route and handles it.', say: { 2: '301 redirect' } },
          { note: 'POST /upload arrives without a token.', say: { 0: 'rate limit ✓' } },
          { note: 'auth-service rejects it. Nobody further down is bothered.', say: { 1: '401 stop' } },
          { note: 'An MCP tool call slips past the first three handlers…', say: { 0: 'pass', 1: 'pass', 2: 'not mine' } },
          { note: '…and mcp-servers answers it.', say: { 3: 'tool result' } },
        ],
      },
      facade: {
        gist: 'One simple interface in front of a complicated subsystem.',
        roles: ['Subsystem', 'Subsystem', 'Subsystem', 'Facade', 'Subsystem', 'Subsystem'],
        frames: [
          { note: 'The client makes a single call to the facade.', say: { 3: 'getReport()' } },
          { note: 'Behind it, the facade coordinates every subsystem.', say: { 0: 'route', 1: 'authorize', 2: 'resolve', 4: 'log', 5: 'fetch files' } },
          { note: 'The client gets back one clean, standardized response.', say: { 3: '200 report' } },
        ],
      },
      decorator: {
        gist: 'Wrap an object to add behaviour without touching it.',
        roles: ['+ rate limit', '+ auth', 'Core handler', '', '+ logging', ''],
        frames: [
          { note: 'The call hits the outermost wrapper first.', say: { 0: 'within limit' } },
          { note: 'Each layer adds one behaviour, then delegates inward.', say: { 1: 'token ✓' } },
          { note: 'Logging wraps the core without changing it.', say: { 4: 'log request' } },
          { note: 'The core handler never knows it was decorated.', say: { 2: 'handle()' } },
          { note: 'The result travels back out through the same layers.', say: { 4: 'log 301 · 3ms', 0: '301' } },
        ],
      },
      observer: {
        gist: 'Subscribers react when the subject changes. Nobody polls.',
        roles: ['Observer', 'Observer', 'Observer', 'Observer', 'Observer', 'Subject'],
        frames: [
          { note: 'A new file lands in the bucket: the subject changes.', say: { 5: 'report.csv' } },
          { note: 'Every subscriber is notified at once.', say: { 0: 'reload routes', 1: 'refresh keys', 2: 'purge cache', 3: 'sync tools', 4: 'log event' } },
          { note: 'go-logger unsubscribes.', say: { 4: 'unsubscribed' } },
          { note: 'The next change only reaches who is still listening.', say: { 5: 'invoice.pdf' } },
        ],
      },
    },
  },
  process: {
    title: 'How I work',
    lead: 'My process as a saga: every step is a handler that reacts to an event and publishes the next one.',
    step: 'Step',
    handlers: [
      { name: 'Discovery', text: 'Understand the goal, the users and the constraints.' },
      { name: 'Development', text: 'Small, reviewed increments you can click through.' },
      { name: 'Review', text: 'Tests, code review and a demo before anything ships.' },
      { name: 'Launch', text: 'Deploy, measure, and keep improving.' },
    ],
    notes: [
      'A backlog item is published to the log as an event.',
      'Discovery handles it, then publishes what it learned.',
      'Development reacts to the scope and ships an increment.',
      'Review fails it: a compensating event sends the work back. No shared state, no manual rollback.',
      'Development fixes it and publishes again.',
      'Review passes, and Launch picks it up.',
      'Deployed and measured. The saga completes; the next item is already in the log.',
    ],
    state: { handling: 'handling', reworking: 'reworking', done: 'done' },
    status: { running: 'running', compensating: 'compensating', completed: 'completed' },
  },
  contact: {
    title: 'Got an idea?',
    lead: 'Tell me what you\'re building.',
    via: 'Send via',
    channels: { email: 'Email', whatsapp: 'WhatsApp' },
    name: 'Name',
    email: 'Your email',
    message: 'Message',
    messageHint: 'The project, the timeline and how I can help.',
    send: 'Send message',
    openWhatsapp: 'Open in WhatsApp',
    sent: 'Message sent! I\'ll get back to you soon.',
    failed: 'I couldn\'t send it right now.',
    failedHint: 'Try again, or write straight to',
    or: 'Or write straight to',
    subject: 'Portfolio contact: {name}',
    whatsappText: 'Hi Bruno! I\'m {name}.\n\n{message}',
  },
  footer: { top: 'Back to top', domain: 'domain', label: 'Find me' },
}

export default en
