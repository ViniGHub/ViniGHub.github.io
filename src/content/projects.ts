/**
 * The projects shown on the page. Each one carries the drawing of its system: boxes (nodes), the lines
 * between them (wires) and the log that prints as the request goes through. `step` is the order in which
 * each piece lights up while the visitor scrolls; pieces with the same step light up together.
 * Coordinates live in a 640 x 320 drawing.
 */

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

export type Project = {
  id: string
  name: string
  summary: string
  description: string
  stack: string[]
  links: { code: string; demo?: string }
  diagram: { caption: string; nodes: DiagramNode[]; wires: Wire[]; notes?: { x: number; y: number; text: string }[] }
  log: LogLine[]
}

export const projects: Project[] = [
  {
    id: 'agenda-ia',
    name: 'agenda-ia',
    summary: 'Perguntas em português sobre a sua agenda, com resposta que cita a fonte',
    description:
      'Pergunte em português sobre a sua agenda. O sistema entende a pergunta, busca por significado e por palavra, e só responde citando um compromisso real.',
    stack: ['python', 'fastapi', 'groq', 'pgvector', 'cloud run'],
    links: { code: 'https://github.com/ViniGHub/agenda-ai', demo: 'https://agenda-ia.web.app' },
    diagram: {
      caption: 'uma pergunta, do clique à resposta',
      nodes: [
        { x: 10, y: 40, w: 100, label: 'browser', sub: 'react · pwa', step: 0 },
        { x: 260, y: 40, w: 120, label: 'fastapi', sub: 'cloud run', step: 2 },
        { x: 470, y: 30, w: 150, label: 'groq · llm', sub: 'entender · responder', step: 4 },
        { x: 250, y: 180, w: 140, label: 'busca híbrida', sub: 'vetor + bm25 · rrf', step: 6 },
        { x: 470, y: 240, w: 150, label: 'neon · pgvector', sub: 'filtrado por dono', step: 8 },
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
      { text: '  "o que tenho na quinta?"', step: 0 },
      { text: '> understand() → tipo=listar de=2026-11-26', step: 4 },
      { text: '> hybrid_search() → 3 eventos', step: 8 },
      { text: '> compose() → 2 citações válidas', step: 9 },
      { text: '< 200 OK · resposta com fonte', step: 10, ok: true },
    ],
  },
  {
    id: 'ticketflow',
    name: 'TicketFlow',
    summary: 'Venda de ingressos sem overselling e sem cobrança duplicada',
    description:
      'Venda de ingressos para eventos pequenos. O estoque é reservado de forma atômica, o webhook do pagamento pode chegar repetido sem cobrar duas vezes, e o e-mail sai por uma outbox transacional.',
    stack: ['next.js', 'nestjs', 'postgres', 'stripe'],
    links: { code: 'https://github.com/ViniGHub/TicketFlow' },
    diagram: {
      caption: 'uma compra, do checkout ao ingresso',
      nodes: [
        { x: 10, y: 30, w: 130, label: 'checkout', sub: 'next.js', step: 0 },
        { x: 250, y: 30, w: 140, label: 'reserva', sub: 'atômica · postgres', step: 2 },
        { x: 500, y: 30, w: 130, label: 'stripe', sub: 'checkout session', step: 4 },
        { x: 500, y: 220, w: 130, label: 'webhook', sub: 'idempotente', step: 6 },
        { x: 250, y: 220, w: 140, label: 'outbox', sub: 'mesma transação', step: 9 },
        { x: 10, y: 220, w: 130, label: 'ingresso', sub: 'por e-mail', step: 11 },
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
      { text: '> POST /checkout · 2 ingressos', step: 0 },
      { text: '> reserva atômica · estoque 38 → 36', step: 2 },
      { text: '> stripe → checkout.session.completed', step: 4 },
      { text: '> webhook · pedido #A-0042 pago', step: 6 },
      { text: '> mesmo webhook de novo · ignorado', step: 7 },
      { text: '> outbox · evento gravado com o pedido', step: 9 },
      { text: '< 2 ingressos enviados · cobrado 1x', step: 11, ok: true },
    ],
  },
  {
    id: 'sinal',
    name: 'Sinal',
    summary: 'Voz e tela compartilhada direto entre navegadores',
    description:
      'Voz e tela compartilhada direto entre dois navegadores. Um servidor público só ajuda as duas pontas a se encontrarem; depois, áudio e vídeo vão de uma pessoa para a outra.',
    stack: ['typescript', 'webrtc', 'peerjs'],
    links: { code: 'https://github.com/ViniGHub/sinal-app', demo: 'https://vinighub.github.io/sinal-app/' },
    diagram: {
      caption: 'uma chamada, do link à conexão direta',
      nodes: [
        { x: 10, y: 220, w: 130, label: 'você', sub: 'navegador', step: 0 },
        { x: 255, y: 30, w: 130, label: 'broker', sub: 'peerjs · só o início', step: 2, offStep: 6 },
        { x: 500, y: 220, w: 130, label: 'amigo', sub: 'navegador', step: 4 },
      ],
      wires: [
        { d: 'M75 220 V60 H255', step: 1 },
        { d: 'M385 60 H565 V220', step: 3 },
        { d: 'M140 250 H500', step: 5, thick: true },
      ],
      notes: [{ x: 320, y: 236, text: 'áudio e tela · p2p' }],
    },
    log: [
      { text: '> você abre o link da sala', step: 0 },
      { text: '> broker troca os endereços (sdp, ice)', step: 2 },
      { text: '> o amigo entra', step: 4 },
      { text: '> conexão direta · webrtc', step: 5 },
      { text: '> broker sai da conversa', step: 6 },
      { text: '< chamada p2p · nenhum servidor no meio', step: 7, ok: true },
    ],
  },
]
