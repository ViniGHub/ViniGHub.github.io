import type { Project } from '@/content/projects'
import { ui } from '@/i18n/ui'

/**
 * The drawing of a system: dashed guides underneath, then the wires and boxes that light up in order.
 * On the home page it renders the start state and ProjectSection animates every element marked with
 * data-step; `lit` draws the finished picture instead (the case study pages, which do not animate it).
 */
export function SystemDiagram({ diagram, lit = false }: { diagram: Project['diagram']; lit?: boolean }) {
  return (
    <svg viewBox="0 0 640 320" className="w-full" role="img" aria-label={`${ui.project.diagram}: ${diagram.caption}`}>
      {diagram.wires.map((wire) => (
        <path key={`bg-${wire.d}`} d={wire.d} className="fill-none stroke-line-strong [stroke-dasharray:3_4]" />
      ))}
      {diagram.wires.map((wire) => (
        <path
          key={wire.d}
          d={wire.d}
          data-step={wire.step}
          data-kind="wire"
          className="fill-none stroke-accent"
          strokeWidth={wire.thick ? 4 : 1.5}
        />
      ))}
      {diagram.nodes.map((node) => (
        <g key={node.label} data-step={node.step} data-kind="node" data-off={node.offStep}>
          <rect x={node.x} y={node.y} width={node.w} height={60} rx={3} className={lit && !node.offStep ? 'fill-node stroke-accent' : 'fill-node stroke-line-strong'} />
          <text x={node.x + 14} y={node.y + 26} className="fill-text font-mono text-[13px]">{node.label}</text>
          <text x={node.x + 14} y={node.y + 46} className="fill-muted font-mono text-[11px]">{node.sub}</text>
        </g>
      ))}
      {diagram.notes?.map((note) => (
        <text key={note.text} x={note.x} y={note.y} textAnchor="middle" className="fill-muted font-mono text-[11px]">{note.text}</text>
      ))}
    </svg>
  )
}
