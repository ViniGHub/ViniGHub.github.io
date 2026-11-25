import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Tone = 'ok' | 'warn'
type Line = { id: number; text: string; tone?: Tone }
type Say = (text: string, tone?: Tone) => Promise<void>

/** Few tickets on purpose: three purchases sell the show out, so the visitor also sees the "sold out" path. */
const START_STOCK = 6
/** Pause between two log lines, like a server answering. */
const STEP_MS = 380
/** The log keeps only the latest lines. */
const MAX_LINES = 9

const orderName = (n: number) => `#A-${String(42 + n).padStart(4, '0')}`

/**
 * A toy TicketFlow, with no server: buying reserves stock once and charges once; the payment webhook can
 * arrive again and changes nothing; a purchase after the show sells out is refused and charges nothing.
 */
export function TicketToy() {
  const [stock, setStock] = useState(START_STOCK)
  const [paid, setPaid] = useState<string[]>([])
  const [lines, setLines] = useState<Line[]>([])
  const [busy, setBusy] = useState(false)
  // Each sequence gets a token; "recomeçar" (or leaving the page) bumps it, and the old sequence goes quiet.
  const run = useRef(0)
  const nextLine = useRef(0)

  useEffect(() => () => void run.current++, [])

  async function sequence(script: (say: Say) => Promise<void>, { clear = false } = {}) {
    const token = ++run.current
    setBusy(true)
    if (clear) setLines([])
    const say: Say = (text, tone) =>
      new Promise((resolve, reject) =>
        window.setTimeout(() => {
          if (run.current !== token) return reject(new Error('reset'))
          setLines((all) => [...all, { id: nextLine.current++, text, tone }].slice(-MAX_LINES))
          resolve()
        }, STEP_MS),
      )
    try {
      await script(say)
    } catch {
      return // reset while it was running
    }
    setBusy(false)
  }

  const buy = () =>
    sequence(
      async (say) => {
        await say('> POST /checkout · 2 ingressos')
        if (stock < 2) {
          await say('> reserva atômica · recusada', 'warn')
          await say('< 409 esgotado · nada cobrado', 'ok')
          return
        }
        const order = orderName(paid.length)
        await say(`> reserva atômica · estoque ${stock} → ${stock - 2}`)
        setStock(stock - 2)
        await say('> stripe → session.completed')
        await say(`> webhook · pedido ${order} pago`)
        setPaid([...paid, order])
        await say('> outbox · e-mail com 2 ingressos')
        await say(`< ${order} · cobrado 1x`, 'ok')
      },
      { clear: true },
    )

  const replayWebhook = () =>
    sequence(async (say) => {
      const order = paid[paid.length - 1]
      await say(`> webhook do ${order} chegou de novo`, 'warn')
      await say('> idempotente · já processado')
      await say(`< ${order} continua cobrado 1x`, 'ok')
    })

  const reset = () => {
    run.current++
    setStock(START_STOCK)
    setPaid([])
    setLines([])
    setBusy(false)
  }

  return (
    <div className="grid gap-4 border border-line-strong bg-panel p-4 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <div className="border border-dashed border-line-strong p-4">
        <p className="label">show de sábado · pista</p>
        <p className="mt-1.5 text-xl font-semibold">Banda Exemplo</p>
        <p className="mt-3.5 font-mono text-[44px] leading-none">
          {stock}
          <small className="ml-2 text-[13px] text-muted">{stock === 1 ? 'ingresso' : 'ingressos'}</small>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="accent" onClick={buy} disabled={busy}>
            {stock < 2 ? 'tentar comprar 2' : 'comprar 2 ingressos'}
          </Button>
          <Button onClick={replayWebhook} disabled={busy || paid.length === 0}>
            Stripe reenviou o webhook
          </Button>
        </div>
        <dl className="mt-4 flex gap-6">
          <div>
            <dt className="label">cobranças</dt>
            <dd className="font-mono text-[22px]">{paid.length}</dd>
          </div>
          <div>
            <dt className="label">ingressos emitidos</dt>
            <dd className="font-mono text-[22px]">{paid.length * 2}</dd>
          </div>
        </dl>
        <Button variant="ghost" size="sm" className="mt-2 px-0" onClick={reset}>
          recomeçar
        </Button>
      </div>
      <div role="log" aria-label="Log da compra" className="min-h-[230px] border border-line bg-node p-3 font-mono text-[12.5px] leading-[1.9]">
        {lines.length === 0 ? (
          <p className="label">// log · clique em comprar</p>
        ) : (
          lines.map((line) => (
            <p key={line.id} className={cn('truncate whitespace-pre motion-safe:animate-[slide-in_0.3s_ease-out]', line.tone === 'ok' && 'text-accent', line.tone === 'warn' && 'text-warn')}>
              {line.text}
            </p>
          ))
        )}
      </div>
    </div>
  )
}
