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
  avatarModel: '/models/avatar.glb' as string | null,
  links: [
    { label: 'linkedin', href: 'https://www.linkedin.com/in/vini-rodri' },
    { label: 'github', href: 'https://github.com/ViniGHub' },
  ],
  /** Studies and jobs, oldest first, for the timeline in "Sobre". Months as 'AAAA-MM'; `to: null` means "hoje". */
  timeline: [
    { from: '2019-02', to: '2021-12', role: 'Técnico em Eletrônica', place: 'Etec Getúlio Vargas', kind: 'estudo' },
    { from: '2022-02', to: '2025-12', role: 'Sistemas de Informação', place: 'FIAP', kind: 'estudo' },
    { from: '2023-04', to: '2024-01', role: 'Estágio em desenvolvimento', place: 'Ipem-SP', kind: 'trabalho' },
    { from: '2024-01', to: '2025-12', role: 'Estágio em desenvolvimento', place: 'Class Solutions', kind: 'trabalho' },
    { from: '2026-01', to: null, role: 'Desenvolvedor front-end', place: 'Class Solutions', kind: 'trabalho' },
  ],
  /** GitHub account whose latest public commit the hero shows ("mexendo agora"). */
  githubUser: 'ViniGHub',
} as const
