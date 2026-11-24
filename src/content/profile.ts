/** Everything about the person that the page prints. Public on purpose: nothing here is private data. */
export const profile = {
  name: ['Vinicius', 'Rodrigues'],
  handle: 'vinicius',
  role: 'desenvolvedor front-end · são paulo',
  stack: ['react', 'angular', 'typescript', 'c#/.net'],
  facts: [
    ['hoje', 'Class Solutions, front-end (desde 2024)'],
    ['formação', 'Sistemas de Informação, FIAP (2025)'],
    ['projetos', '3 sistemas, explicados por dentro aqui embaixo'],
    ['idiomas', 'português nativo · inglês intermediário'],
  ],
  about:
    'Sou desenvolvedor front-end na Class Solutions, onde construo aplicações em React e Angular integradas ao SharePoint e a APIs em C#/.NET. Formado em Sistemas de Informação pela FIAP. Gosto de problemas em que o detalhe técnico decide se a coisa funciona: pagamento que não pode cobrar duas vezes, conexão direta entre navegadores, resposta de IA que precisa citar a fonte.',
  toolbox: [
    ['front', 'React · Angular · TypeScript · SPFx'],
    ['back', 'C#/.NET · Node/NestJS · Python/FastAPI'],
    ['dados', 'Postgres · pgvector · Oracle'],
    ['nuvem', 'Cloud Run · Neon · GitHub Actions'],
  ],
  /**
   * The 3D model of the hero, a GLB in public/ (for example '/models/avatar.glb').
   * While it is null, the page draws the placeholder bust. See docs/gerar-avatar.md.
   */
  avatarModel: null as string | null,
  links: [
    { label: 'linkedin', href: 'https://www.linkedin.com/in/vini-rodri' },
    { label: 'github', href: 'https://github.com/ViniGHub' },
  ],
} as const
