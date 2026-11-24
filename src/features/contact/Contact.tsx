import { InkLink } from '@/components/ui/skiper-ui/ink-link'
import { profile } from '@/content/profile'

export function Contact() {
  return (
    <section id="contato" aria-labelledby="contato-title" className="border-t border-line py-28">
      <div className="mx-auto flex max-w-[1200px] items-end justify-between gap-8 px-8 max-md:flex-col max-md:items-start">
        <div>
          <p className="label">// contato</p>
          <h2 id="contato-title" className="mt-2.5 text-[clamp(2.1rem,4.4vw,3.5rem)] font-semibold tracking-[-0.03em]">Contato</h2>
        </div>
        <ul className="flex gap-7 font-mono text-[15px]">
          {profile.links.map((link) => (
            <li key={link.label}>
              <InkLink href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</InkLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
