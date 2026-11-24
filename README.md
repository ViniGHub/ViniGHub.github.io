# Portfólio · Vinicius Rodrigues

Três sistemas explicados por dentro: [agenda-ia](https://github.com/ViniGHub/agenda-ai), [TicketFlow](https://github.com/ViniGHub/TicketFlow) e [Sinal](https://github.com/ViniGHub/sinal-app). Cada projeto tem um diagrama que fica preso na tela e se desenha conforme a pessoa rola: o caminho de um pedido, do clique até a resposta.

## Stack

- **React 19 + TypeScript + Vite 7**, com Tailwind CSS 4 e componentes no padrão do [shadcn/ui](https://ui.shadcn.com).
- **GSAP + ScrollTrigger** para os diagramas presos e as entradas, **SplitText** para o nome e **Lenis** para o scroll suave.
- **three.js + React Three Fiber** para o avatar, carregado num arquivo separado, depois do texto.
- Link com sublinhado animado adaptado do [Skiper UI](https://skiper-ui.com).

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # confere os tipos e gera dist/
```

## Onde está cada coisa

```
src/
├── content/          o texto do site: projects.ts (projetos e diagramas) e profile.ts
├── features/
│   ├── nav/          barra fixa (início e contato sempre à mão) e selo "projeto 02/03"
│   ├── hero/         abertura e avatar 3D
│   ├── projects/     índice, seção de projeto e diagrama
│   ├── about/        sobre
│   └── contact/      contato
├── components/ui/    botão (shadcn) e link do Skiper UI
├── hooks/            em qual seção a pessoa está
└── lib/              GSAP registrado, scroll suave, cn()
prototipos/           os protótipos em HTML e as ideias guardadas (IDEIAS.md)
```

Para trocar um texto ou acrescentar um projeto, edite só `src/content/`. Os diagramas usam um desenho de 640 × 320, e o campo `step` define a ordem em que cada peça acende.

## Movimento e acessibilidade

Quem pede menos animação no sistema (`prefers-reduced-motion`) não recebe scroll suave nem entradas com deslocamento. Os diagramas continuam presos e acendendo com o scroll, porque só mudam cor e opacidade, no ritmo da própria pessoa.

## Avatar

Hoje é um busto provisório desenhado em código (`features/hero/Avatar.tsx`). O plano é gerar o modelo a partir de selfies, no Avaturn ou no MetaPerson, exportar em GLB e carregá-lo no lugar do busto.
