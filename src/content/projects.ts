/**
 * The projects shown on the page. Each one carries the drawing of its system: boxes (nodes), the lines
 * between them (wires) and the log that prints as the request goes through. `step` is the order in which
 * each piece lights up while the visitor scrolls; pieces with the same step light up together.
 * Coordinates live in a 640 x 320 drawing.
 */

// Relative on purpose: vite.config.ts imports this file, and the '@' alias does not exist there.
import { t } from '../i18n/lang'

export type DiagramNode = {
  x: number
  y: number
  w: number
  label: string
  sub: string
  step: number
  /** Step at which the node fades out again (the Sinal broker leaves once the call is direct). */
  offStep?: number
}

export type Wire = { d: string; step: number; thick?: boolean }
export type LogLine = { text: string; step: number; ok?: boolean }

/** The real demo, opened inside the page in a large window. */
export type LiveShowcase = {
  kind: 'live'
  title: string
  text: string
  /** Address the window opens. */
  url: string
  /** A capture of the demo, shown until the visitor clicks. */
  shot: { src: string; alt: string }
  /** Shown in the window's bar: what to expect (a sleeping server, a microphone prompt). */
  hint: string
  /** Browser features the demo needs inside the frame (iframe `allow`). */
  allow?: string
}

/** A toy version of the problem, playable on the page (for projects without a public demo). */
export type ToyShowcase = { kind: 'toy'; title: string; text: string }

export type Project = {
  id: string
  name: string
  summary: string
  description: string
  stack: string[]
  links: { code: string; demo?: string }
  diagram: { caption: string; nodes: DiagramNode[]; wires: Wire[]; notes?: { x: number; y: number; text: string }[] }
  log: LogLine[]
  /** How the visitor tries the project right here, after reading how it works. */
  showcase: LiveShowcase | ToyShowcase
}

export const projects: Project[] = [
  {
    id: 'agenda-ia',
    name: 'agenda-ia',
    summary: t('Perguntas em português sobre a sua agenda, com resposta que cita a fonte', 'Questions about your calendar, answered with the source'),
    description: t(
      'Pergunte em português sobre a sua agenda. O sistema entende a pergunta, busca por significado e por palavra, e só responde citando um compromisso real.',
      'Ask about your calendar in Portuguese. The system understands the question, searches by meaning and by keyword, and only answers by citing a real appointment.',
    ),
    stack: ['python', 'fastapi', 'groq', 'pgvector', 'cloud run'],
    links: { code: 'https://github.com/ViniGHub/agenda-ai', demo: 'https://agenda-ia.web.app' },
    diagram: {
      caption: t('uma pergunta, do clique à resposta', 'one question, from click to answer'),
      nodes: [
        { x: 10, y: 40, w: 100, label: 'browser', sub: 'react · pwa', step: 0 },
        { x: 260, y: 40, w: 120, label: 'fastapi', sub: 'cloud run', step: 2 },
        { x: 470, y: 30, w: 150, label: 'groq · llm', sub: t('entender · responder', 'understand · answer'), step: 4 },
        { x: 250, y: 180, w: 140, label: t('busca híbrida', 'hybrid search'), sub: t('vetor + bm25 · rrf', 'vector + bm25 · rrf'), step: 6 },
        { x: 470, y: 240, w: 150, label: 'neon · pgvector', sub: t('filtrado por dono', 'filtered by owner'), step: 8 },
      ],
      wires: [
        { d: 'M110 70 H260', step: 1 },
        { d: 'M380 60 H470', step: 3 },
        { d: 'M320 100 V180', step: 5 },
        { d: 'M390 210 C430 210 430 270 470 270', step: 7 },
      ],
    },
    log: [
      { text: '> POST /api/minha/perguntar', step: 0 },
      { text: t('  "o que tenho na quinta?"', '  "what do I have on thursday?"'), step: 0 },
      { text: t('> understand() → tipo=listar de=2026-11-26', '> understand() → type=list from=2026-11-26'), step: 4 },
      { text: t('> hybrid_search() → 3 eventos', '> hybrid_search() → 3 events'), step: 8 },
      { text: t('> compose() → 2 citações válidas', '> compose() → 2 valid citations'), step: 9 },
      { text: t('< 200 OK · resposta com fonte', '< 200 OK · answer with source'), step: 10, ok: true },
    ],
    showcase: {
      kind: 'live',
      title: t('Pergunte você mesmo', 'Ask it yourself'),
      text: t(
        'A demo usa uma agenda fictícia de novembro. Pergunte quando é o dentista ou peça para marcar um almoço, e veja de qual compromisso saiu cada resposta.',
        'The demo is in Portuguese and uses a made-up November calendar. Try "quando é o dentista?" (when is the dentist?) and see which appointment each answer came from.',
      ),
      url: 'https://agenda-ia.web.app/#demo',
      shot: {
        src: '/shots/agenda-ia.jpg',
        alt: t(
          'agenda-ia respondendo "Quando é o dentista?" com o compromisso de origem destacado no calendário',
          'agenda-ia answering "Quando é o dentista?" with the source appointment highlighted on the calendar',
        ),
      },
      hint: t(
        'agenda fictícia · o servidor dorme quando ninguém usa; a primeira resposta pode levar até 1 minuto',
        'made-up calendar, in Portuguese · the server sleeps when idle; the first answer can take up to 1 minute',
      ),
      allow: 'microphone',
    },
  },
  {
    id: 'ticketflow',
    name: 'TicketFlow',
    summary: t('Venda de ingressos sem overselling e sem cobrança duplicada', 'Ticket sales with no overselling and no double charges'),
    description: t(
      'Venda de ingressos para eventos pequenos. O estoque é reservado de forma atômica, o webhook do pagamento pode chegar repetido sem cobrar duas vezes, e o e-mail sai por uma outbox transacional.',
      'Ticket sales for small events. Stock is reserved atomically, the payment webhook can arrive twice without charging twice, and the email goes out through a transactional outbox.',
    ),
    stack: ['next.js', 'nestjs', 'postgres', 'stripe'],
    links: { code: 'https://github.com/ViniGHub/TicketFlow' },
    diagram: {
      caption: t('uma compra, do checkout ao ingresso', 'one purchase, from checkout to ticket'),
      nodes: [
        { x: 10, y: 30, w: 130, label: 'checkout', sub: 'next.js', step: 0 },
        { x: 250, y: 30, w: 140, label: t('reserva', 'reservation'), sub: t('atômica · postgres', 'atomic · postgres'), step: 2 },
        { x: 500, y: 30, w: 130, label: 'stripe', sub: 'checkout session', step: 4 },
        { x: 500, y: 220, w: 130, label: 'webhook', sub: t('idempotente', 'idempotent'), step: 6 },
        { x: 250, y: 220, w: 140, label: 'outbox', sub: t('mesma transação', 'same transaction'), step: 9 },
        { x: 10, y: 220, w: 130, label: t('ingresso', 'ticket'), sub: t('por e-mail', 'by email'), step: 11 },
      ],
      wires: [
        { d: 'M140 60 H250', step: 1 },
        { d: 'M390 60 H500', step: 3 },
        { d: 'M565 90 V220', step: 5 },
        { d: 'M500 250 H390', step: 8 },
        { d: 'M250 250 H140', step: 10 },
      ],
    },
    log: [
      { text: t('> POST /checkout · 2 ingressos', '> POST /checkout · 2 tickets'), step: 0 },
      { text: t('> reserva atômica · estoque 38 → 36', '> atomic reservation · stock 38 → 36'), step: 2 },
      { text: '> stripe → checkout.session.completed', step: 4 },
      { text: t('> webhook · pedido #A-0042 pago', '> webhook · order #A-0042 paid'), step: 6 },
      { text: t('> mesmo webhook de novo · ignorado', '> same webhook again · ignored'), step: 7 },
      { text: t('> outbox · evento gravado com o pedido', '> outbox · event saved with the order'), step: 9 },
      { text: t('< 2 ingressos enviados · cobrado 1x', '< 2 tickets sent · charged once'), step: 11, ok: true },
    ],
    showcase: {
      kind: 'toy',
      title: t('Tente cobrar duas vezes', 'Try to charge twice'),
      text: t(
        'Uma versão de brinquedo do fluxo, sem servidor. Compre ingressos, faça a Stripe reenviar o webhook e tente comprar depois de esgotar. A cobrança e o estoque não saem do lugar.',
        'A toy version of the flow, with no server. Buy tickets, make Stripe resend the webhook, and try to buy after the show sells out. The charge and the stock stay right.',
      ),
    },
  },
  {
    id: 'sinal',
    name: 'Sinal',
    summary: t('Voz e tela compartilhada direto entre navegadores', 'Voice and screen sharing straight between browsers'),
    description: t(
      'Voz e tela compartilhada direto entre dois navegadores. Um servidor público só ajuda as duas pontas a se encontrarem; depois, áudio e vídeo vão de uma pessoa para a outra.',
      'Voice and screen sharing straight between two browsers. A public server only helps the two ends find each other; after that, audio and video go from one person to the other.',
    ),
    stack: ['typescript', 'webrtc', 'peerjs'],
    links: { code: 'https://github.com/ViniGHub/sinal-app', demo: 'https://vinighub.github.io/sinal-app/' },
    diagram: {
      caption: t('uma chamada, do link à conexão direta', 'one call, from link to direct connection'),
      nodes: [
        { x: 10, y: 220, w: 130, label: t('você', 'you'), sub: t('navegador', 'browser'), step: 0 },
        { x: 255, y: 30, w: 130, label: 'broker', sub: t('peerjs · só o início', 'peerjs · start only'), step: 2, offStep: 6 },
        { x: 500, y: 220, w: 130, label: t('amigo', 'friend'), sub: t('navegador', 'browser'), step: 4 },
      ],
      wires: [
        { d: 'M75 220 V60 H255', step: 1 },
        { d: 'M385 60 H565 V220', step: 3 },
        { d: 'M140 250 H500', step: 5, thick: true },
      ],
      notes: [{ x: 320, y: 236, text: t('áudio e tela · p2p', 'audio and screen · p2p') }],
    },
    log: [
      { text: t('> você abre o link da sala', '> you open the room link'), step: 0 },
      { text: t('> broker troca os endereços (sdp, ice)', '> broker swaps the addresses (sdp, ice)'), step: 2 },
      { text: t('> o amigo entra', '> your friend joins'), step: 4 },
      { text: t('> conexão direta · webrtc', '> direct connection · webrtc'), step: 5 },
      { text: t('> broker sai da conversa', '> broker leaves the conversation'), step: 6 },
      { text: t('< chamada p2p · nenhum servidor no meio', '< p2p call · no server in the middle'), step: 7, ok: true },
    ],
    showcase: {
      kind: 'live',
      title: t('Abra um canal', 'Open a channel'),
      text: t(
        'A demo abre aqui mesmo e pede o microfone. Para ver a chamada direta, crie um canal e entre nele de novo por outra aba ou pelo celular.',
        'The demo opens right here and asks for the microphone (its interface is in Portuguese). To see the direct call, create a channel and join it again from another tab or your phone.',
      ),
      url: 'https://vinighub.github.io/sinal-app/',
      shot: {
        src: '/shots/sinal.jpg',
        alt: t(
          'Tela inicial do Sinal, com o participante "você" e o convite para compartilhar o link do canal',
          'Sinal start screen, with the participant "você" (you) and an invitation to share the channel link',
        ),
      },
      hint: t('pede o microfone · para a chamada, entre no mesmo canal por outra aba', 'asks for the microphone · for a call, join the same channel from another tab'),
      allow: 'microphone; camera; display-capture; clipboard-write',
    },
  },
]
