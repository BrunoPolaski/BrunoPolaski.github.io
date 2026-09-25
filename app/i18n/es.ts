import type { Messages } from './pt-BR'

const es: Messages = {
  meta: {
    title: 'Bruno Polaski, ingeniero de software',
    description: 'Bruno Polaski, ingeniero de software con más de 3 años de experiencia. R&D Commercial Software Engineer en BairesDev.',
  },
  nav: {
    sections: { top: 'Inicio', about: 'Sobre mí', experience: 'Experiencia', projects: 'Proyectos', process: 'Cómo trabajo', contact: 'Contacto' },
    label: 'Secciones',
    progress: 'Progreso de la página',
    language: 'Idioma',
    getInTouch: 'Contáctame',
  },
  hero: {
    intro: 'Soy Bruno, ingeniero de software con más de 3 años de experiencia construyendo backends y productos full-stack. Hoy hago I+D en software comercial en BairesDev.',
    hire: 'Contrátame',
    seeProjects: 'Ver proyectos',
    scroll: 'Desliza',
    scrollLabel: 'Ir a Sobre mí',
  },
  langs: {
    title: n => `Mis ${n} repositorios públicos, por lenguaje`,
    other: 'Otros',
  },
  about: {
    title: 'Sobre mí',
    text: 'Me gusta resolver los problemas difíciles del servidor, construir pantallas que se sienten vivas y conectar ambos lados tan bien que no se nota la costura. Casi todos los días eso son servicios en Go, integraciones y herramientas MCP en el back, e interfaces como esta en el front.',
    years: 'Años de experiencia',
    degreeValue: 'Último año',
    degree: 'Grado en Ingeniería de Software',
    repos: 'Repositorios públicos en GitHub',
  },
  experience: {
    title: 'Experiencia',
    now: 'actual',
    roles: {
      rd: 'R&D Commercial Software Engineer',
      mid: 'Desarrollador Full-stack Semi Senior',
      junior: 'Desarrollador Full-stack Junior',
      intern: 'Pasante de Desarrollo Full-stack',
    },
  },
  projects: {
    title: 'Proyectos',
    lead: 'Elige un patrón de diseño y mis proyectos lo representan. Los nombres enlazan a los repositorios.',
    more: 'Más en GitHub',
    patternLabel: 'Patrón de diseño',
    notInPattern: 'Fuera de este patrón',
    play: 'Reproducir',
    pause: 'Pausar',
    next: 'Siguiente paso',
    blurbs: {
      'api-gateway': 'API gateway con rate limiter y una tabla de rutas en JSON.',
      'auth-service': 'Gestiona la autenticación de otros microservicios.',
      'url-shortener': 'Clean architecture, MySQL, JWT y soporte serverless.',
      'mcp-servers': 'Servidor MCP que orquesta integraciones con burós detrás de una sola interfaz.',
      'go-logger': 'Logs por niveles sobre el paquete log estándar.',
      's3-bucket-listener': 'Observa un bucket de S3 y descarga cada archivo nuevo.',
    },
    patterns: {
      chain: {
        gist: 'Una petición recorre una cadena de handlers hasta que uno de ellos la toma.',
        roles: ['Handler 1', 'Handler 2', 'Handler 3', 'Handler 4', 'Handler 5', 'Handler 6'],
        frames: [
          { note: 'GET /x7Kq entra en la cadena por el gateway.', say: { 0: 'rate limit ✓' } },
          { note: 'No le corresponde, así que la petición sigue.', say: { 1: 'token ✓' } },
          { note: 'url-shortener conoce esta ruta y la atiende.', say: { 2: '301 redirect' } },
          { note: 'POST /upload llega sin token.', say: { 0: 'rate limit ✓' } },
          { note: 'auth-service la rechaza. Nadie más abajo se entera.', say: { 1: '401 stop' } },
          { note: 'Una llamada a una herramienta MCP pasa los tres primeros handlers…', say: { 0: 'pasa', 1: 'pasa', 2: 'no es mío' } },
          { note: '…y mcp-servers la responde.', say: { 3: 'tool result' } },
        ],
      },
      facade: {
        gist: 'Una interfaz simple delante de un subsistema complicado.',
        roles: ['Subsistema', 'Subsistema', 'Subsistema', 'Facade', 'Subsistema', 'Subsistema'],
        frames: [
          { note: 'El cliente hace una sola llamada a la facade.', say: { 3: 'getReport()' } },
          { note: 'Detrás, la facade coordina cada subsistema.', say: { 0: 'enrutar', 1: 'autorizar', 2: 'resolver', 4: 'registrar', 5: 'traer archivos' } },
          { note: 'El cliente recibe una única respuesta, limpia y estandarizada.', say: { 3: '200 report' } },
        ],
      },
      decorator: {
        gist: 'Envuelve un objeto para añadir comportamiento sin tocarlo.',
        roles: ['+ rate limit', '+ auth', 'Handler principal', '', '+ logging', ''],
        frames: [
          { note: 'La llamada llega primero al wrapper más externo.', say: { 0: 'dentro del límite' } },
          { note: 'Cada capa añade un comportamiento y delega hacia adentro.', say: { 1: 'token ✓' } },
          { note: 'El logging envuelve el núcleo sin cambiarlo.', say: { 4: 'registra la petición' } },
          { note: 'El handler principal nunca sabe que fue decorado.', say: { 2: 'handle()' } },
          { note: 'El resultado vuelve por las mismas capas.', say: { 4: 'log 301 · 3ms', 0: '301' } },
        ],
      },
      observer: {
        gist: 'Los suscriptores reaccionan cuando el subject cambia. Nadie hace polling.',
        roles: ['Observer', 'Observer', 'Observer', 'Observer', 'Observer', 'Subject'],
        frames: [
          { note: 'Llega un archivo nuevo al bucket: el subject cambia.', say: { 5: 'report.csv' } },
          { note: 'Todos los suscriptores reciben el aviso a la vez.', say: { 0: 'recargar rutas', 1: 'renovar claves', 2: 'purgar caché', 3: 'sincronizar tools', 4: 'registrar evento' } },
          { note: 'go-logger cancela su suscripción.', say: { 4: 'desuscrito' } },
          { note: 'El siguiente cambio solo llega a quien sigue escuchando.', say: { 5: 'invoice.pdf' } },
        ],
      },
    },
  },
  process: {
    title: 'Cómo trabajo',
    lead: 'Mi proceso como una saga: cada etapa es un handler que reacciona a un evento y publica el siguiente.',
    step: 'Etapa',
    handlers: [
      { name: 'Descubrimiento', text: 'Entender el objetivo, los usuarios y las restricciones.' },
      { name: 'Desarrollo', text: 'Incrementos pequeños y revisados que puedes probar.' },
      { name: 'Revisión', text: 'Tests, code review y una demo antes de publicar nada.' },
      { name: 'Lanzamiento', text: 'Desplegar, medir y seguir mejorando.' },
    ],
    notes: [
      'Un ítem del backlog se publica en el log como evento.',
      'Descubrimiento lo procesa y publica lo que aprendió.',
      'Desarrollo reacciona al alcance y entrega un incremento.',
      'Revisión lo rechaza: un evento compensatorio devuelve el trabajo. Sin estado compartido, sin rollback manual.',
      'Desarrollo lo corrige y publica de nuevo.',
      'Revisión lo aprueba, y Lanzamiento lo toma.',
      'Desplegado y medido. La saga termina; el siguiente ítem ya está en el log.',
    ],
    state: { handling: 'procesando', reworking: 'rehaciendo', done: 'hecho' },
    status: { running: 'en curso', compensating: 'compensando', completed: 'completada' },
  },
  contact: {
    title: '¿Tienes una idea?',
    lead: 'Cuéntame qué estás construyendo.',
  },
  footer: { top: 'Volver arriba' },
}

export default es
