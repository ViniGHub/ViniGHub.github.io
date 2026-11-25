import { t } from '@/i18n/lang'

/** Everything about the person that the page prints. Public on purpose: nothing here is private data. */
export const profile = {
  name: ['Vinicius', 'Rodrigues'],
  handle: 'vinicius',
  role: t('desenvolvedor front-end · são paulo', 'front-end developer · são paulo'),
  stack: ['react', 'angular', 'typescript', 'c#/.net'],
  facts: [
    [t('hoje', 'now'), t('Class Solutions, front-end (desde 2024)', 'Class Solutions, front-end (since 2024)')],
    [t('formação', 'education'), t('Sistemas de Informação, FIAP (2025)', 'Information Systems, FIAP (2025)')],
    [t('projetos', 'projects'), t('3 sistemas, explicados por dentro aqui embaixo', '3 systems, explained from the inside below')],
    [t('idiomas', 'languages'), t('português nativo · inglês intermediário', 'Portuguese (native) · English (intermediate)')],
  ],
  about: t(
    'Sou desenvolvedor front-end na Class Solutions, onde construo aplicações em React e Angular integradas ao SharePoint e a APIs em C#/.NET. Formado em Sistemas de Informação pela FIAP. Gosto de problemas em que o detalhe técnico decide se a coisa funciona: pagamento que não pode cobrar duas vezes, conexão direta entre navegadores, resposta de IA que precisa citar a fonte.',
    "I'm a front-end developer at Class Solutions, where I build React and Angular applications integrated with SharePoint and C#/.NET APIs. I have a degree in Information Systems from FIAP. I like problems where a technical detail decides whether the thing works: a payment that must never charge twice, a direct connection between browsers, an AI answer that has to cite its source.",
  ),
  toolbox: [
    ['front', 'React · Angular · TypeScript · SPFx'],
    ['back', 'C#/.NET · Node/NestJS · Python/FastAPI'],
    [t('dados', 'data'), 'Postgres · pgvector · Oracle'],
    [t('nuvem', 'cloud'), 'Cloud Run · Neon · GitHub Actions'],
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
    { from: '2019-02', to: '2021-12', role: t('Técnico em Eletrônica', 'Electronics technical course'), place: 'Etec Getúlio Vargas', kind: 'study' },
    { from: '2022-02', to: '2025-12', role: t('Sistemas de Informação', 'Information Systems'), place: 'FIAP', kind: 'study' },
    { from: '2023-04', to: '2024-01', role: t('Estágio em desenvolvimento', 'Software development intern'), place: 'Ipem-SP', kind: 'work' },
    { from: '2024-01', to: '2025-12', role: t('Estágio em desenvolvimento', 'Software development intern'), place: 'Class Solutions', kind: 'work' },
    { from: '2026-01', to: null, role: t('Desenvolvedor front-end', 'Front-end developer'), place: 'Class Solutions', kind: 'work' },
  ],
  /** GitHub account whose latest public commit the hero shows ("mexendo agora"). */
  githubUser: 'ViniGHub',
} as const
