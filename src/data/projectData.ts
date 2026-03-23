// =============================================================================
// i10 Project Control - Project Data
// Instituto i10 — Educação · Tecnologia · Inovação
// Encomenda Tecnológica (ETEC) - Santa Catarina
// =============================================================================

import type {
  Phase,
  Department,
  Task,
  Person,
  AssociateCompany,
  Milestone,
  HiringPosition,
  CountdownTarget,
  ProjectData,
  DashboardSummary,
} from './types';

// ---------------------------------------------------------------------------
// Phases
// ---------------------------------------------------------------------------

export const phases: Phase[] = [
  {
    id: 'phase-0',
    number: 0,
    title: 'Alinhamento e Imersão',
    description:
      'Fase preparatória de alinhamento institucional, formalização jurídica do Instituto i10, imersão no contexto educacional de Santa Catarina e preparação da estrutura organizacional para a Encomenda Tecnológica.',
    status: 'em_andamento',
    startDate: '2026-04-01',
    endDate: '2026-05-31',
    progress: 20,
    deliverables: [
      'Registro do Estatuto do Instituto i10',
      'CNPJ atualizado e regular',
      'Primeira Assembleia de fundação realizada',
      'Mapeamento de stakeholders SED/SC',
      'Diagnóstico inicial da infraestrutura educacional SC',
      'Contrato de parceria com provedores tecnológicos',
      'Plano de trabalho detalhado para PoC',
    ],
    budgetBRL: 150000,
  },
  {
    id: 'phase-1',
    number: 1,
    title: 'Prova de Conceito - PoC',
    description:
      'Desenvolvimento e validação da prova de conceito da plataforma educacional, incluindo integração com sistemas legados de SC, modelos de IA para personalização e primeiros testes com escolas selecionadas.',
    status: 'planejada',
    startDate: '2026-05-01',
    endDate: '2026-09-30',
    progress: 0,
    deliverables: [
      'Arquitetura da plataforma definida e documentada',
      'APIs de integração com sistemas SED/SC mapeadas',
      'Protótipo funcional da plataforma',
      'Modelo de IA treinado com dados curriculares BNCC',
      'Relatório de validação da PoC com métricas',
      'Feedback de professores e gestores piloto',
    ],
    budgetBRL: 800000,
  },
  {
    id: 'phase-2',
    number: 2,
    title: 'Piloto Controlado',
    description:
      'Implantação piloto em escolas selecionadas de Santa Catarina com monitoramento rigoroso de resultados, ajustes iterativos e preparação para escalabilidade.',
    status: 'planejada',
    startDate: '2026-10-01',
    endDate: '2027-06-30',
    progress: 0,
    deliverables: [
      'Plataforma implantada em escolas piloto',
      'Programa de capacitação de professores executado',
      'Dados de aprendizagem coletados e analisados',
      'Relatório de impacto pedagógico',
      'Ajustes na plataforma baseados em feedback',
      'Plano de escalabilidade validado',
    ],
    budgetBRL: 2500000,
  },
  {
    id: 'phase-3',
    number: 3,
    title: 'Validação e Transferência',
    description:
      'Validação final dos resultados, documentação completa da solução, transferência de tecnologia para SED/SC e preparação para expansão estadual.',
    status: 'planejada',
    startDate: '2027-07-01',
    endDate: '2028-03-31',
    progress: 0,
    deliverables: [
      'Relatório final de validação com evidências',
      'Documentação técnica completa da plataforma',
      'Transferência de tecnologia para SED/SC',
      'Manual de operação e manutenção',
      'Plano de expansão estadual aprovado',
      'Relatório de prestação de contas ao TCU',
    ],
    budgetBRL: 1200000,
  },
];

// ---------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------

export const people: Person[] = [
  // --- Fundadores (primeira assembleia) ---
  {
    id: 'pessoa-raphael',
    name: 'Raphael Ruiz',
    role: 'lider',
    title: 'Líder do Projeto',
    departmentIds: ['tecnologia', 'administrativo_financeiro'],
    email: null,
    notes:
      'Líder geral do projeto ETEC. Responsável pela visão estratégica, relação com SED/SC e coordenação entre todas as áreas.',
    avatarUrl: null,
    assembleiaConfirmed: true,
  },
  {
    id: 'pessoa-bruno-almeida',
    name: 'Bruno Almeida',
    role: 'fundador',
    title: 'Gerência de Tecnologia',
    departmentIds: ['tecnologia'],
    email: null,
    notes:
      'Líder técnico responsável pela arquitetura da plataforma, integrações e equipe de desenvolvimento.',
    avatarUrl: null,
    assembleiaConfirmed: true,
  },
  {
    id: 'pessoa-bruno-quick',
    name: 'Bruno Quick',
    role: 'fundador',
    title: 'Relações Públicas e Parcerias Governamentais',
    departmentIds: ['relacoes_publicas'],
    email: null,
    notes:
      'Responsável pelas relações com governo de SC, articulação política e comunicação institucional.',
    avatarUrl: null,
    assembleiaConfirmed: true,
  },
  {
    id: 'pessoa-mercia',
    name: 'Mercia',
    role: 'fundador',
    title: 'Assessoria Jurídica (co-líder)',
    departmentIds: ['juridico'],
    email: null,
    notes:
      'Co-líder jurídica. Responsável pelo registro do estatuto, conformidade legal e contratos de parceria.',
    avatarUrl: null,
    assembleiaConfirmed: true,
  },
  {
    id: 'pessoa-emerson',
    name: 'Emerson',
    role: 'fundador',
    title: 'Assessoria Jurídica (co-líder)',
    departmentIds: ['juridico'],
    email: null,
    notes:
      'Co-líder jurídico. Atua junto com Mercia na estruturação jurídica do Instituto i10 e conformidade regulatória.',
    avatarUrl: null,
    assembleiaConfirmed: true,
  },
  {
    id: 'pessoa-gustavo',
    name: 'Gustavo',
    role: 'fundador',
    title: 'Operações e Provedores Locais',
    departmentIds: ['operacoes_locais'],
    email: null,
    notes:
      'Responsável pela operação em Santa Catarina, rede de provedores locais e logística de campo.',
    avatarUrl: null,
    assembleiaConfirmed: true,
  },
  {
    id: 'pessoa-enio',
    name: 'Enio',
    role: 'fundador',
    title: 'Administrativo / Financeiro',
    departmentIds: ['administrativo_financeiro'],
    email: null,
    notes:
      'Co-líder da área administrativa e financeira. Planejamento orçamentário e compliance.',
    avatarUrl: null,
    assembleiaConfirmed: true,
  },

  // --- Convidados (Advisory / Executive Board - a definir) ---
  {
    id: 'pessoa-daniel-aguado',
    name: 'Daniel Aguado',
    role: 'convidado',
    title: 'Marketing Director - FDC (Fundação Dom Cabral)',
    departmentIds: [],
    email: null,
    notes:
      'Diretor de Marketing na FDC. Potencial membro do conselho consultivo para estratégia de posicionamento e relacionamento institucional.',
    avatarUrl: null,
    assembleiaConfirmed: false,
  },
  {
    id: 'pessoa-franco',
    name: 'Franco',
    role: 'convidado',
    title: 'Diretor Geral - FAAP',
    departmentIds: [],
    email: null,
    notes:
      'Diretor Geral da FAAP. Potencial conselheiro com experiência em gestão de instituições de ensino superior.',
    avatarUrl: null,
    assembleiaConfirmed: false,
  },
  {
    id: 'pessoa-daniel-mendes',
    name: 'Daniel Mendes',
    role: 'convidado',
    title: 'Empreendedor K12',
    departmentIds: [],
    email: null,
    notes:
      'Empreendedor no segmento de educação básica (K12). Experiência prática com escolas e mercado educacional.',
    avatarUrl: null,
    assembleiaConfirmed: false,
  },
  {
    id: 'pessoa-mariza',
    name: 'Mariza',
    role: 'convidado',
    title: 'Ex-MEC e FUNDEB',
    departmentIds: [],
    email: null,
    notes:
      'Experiência no Ministério da Educação e no FUNDEB. Conhecimento profundo de políticas públicas educacionais e financiamento.',
    avatarUrl: null,
    assembleiaConfirmed: false,
  },
];

// ---------------------------------------------------------------------------
// Departments
// ---------------------------------------------------------------------------

export const departments: Department[] = [
  {
    id: 'juridico',
    name: 'Jurídico',
    description:
      'Assessoria jurídica responsável pela formalização do Instituto i10, contratos, conformidade regulatória e LGPD.',
    leadIds: ['pessoa-mercia', 'pessoa-emerson'],
    color: '#6366F1',
    icon: 'Scale',
    taskIds: [
      'task-jur-01',
      'task-jur-02',
      'task-jur-03',
      'task-jur-04',
      'task-jur-05',
      'task-estatuto-cartorio',
      'task-cnpj-regularizacao',
      'task-ripd-lgpd',
      'task-declaracao-conflito',
      'task-minuta-contrato',
    ],
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia',
    description:
      'Desenvolvimento da plataforma educacional, integrações com sistemas legados, IA e infraestrutura técnica.',
    leadIds: ['pessoa-bruno-almeida'],
    color: '#10B981',
    icon: 'Code',
    taskIds: [
      'task-tech-01',
      'task-tech-02',
      'task-tech-03',
      'task-tech-04',
      'task-tech-05',
      'task-tech-06',
      'task-arquitetura-plataforma',
      'task-connectors-legados',
      'task-offline-first',
      'task-modelo-ia-bncc',
    ],
  },
  {
    id: 'relacoes_publicas',
    name: 'Relações Públicas e Parcerias',
    description:
      'Relações governamentais, comunicação institucional, parcerias estratégicas e articulação política com SC.',
    leadIds: ['pessoa-bruno-quick'],
    color: '#F59E0B',
    icon: 'Handshake',
    taskIds: [
      'task-rp-01',
      'task-rp-02',
      'task-rp-03',
      'task-rp-04',
    ],
  },
  {
    id: 'operacoes_locais',
    name: 'Operações Locais',
    description:
      'Operação em campo em Santa Catarina, rede de provedores, escritório local e coordenação de equipes.',
    leadIds: ['pessoa-gustavo'],
    color: '#EF4444',
    icon: 'MapPin',
    taskIds: [
      'task-ops-01',
      'task-ops-02',
      'task-ops-03',
      'task-ops-04',
      'task-escritorio-setup',
    ],
  },
  {
    id: 'santa_catarina',
    name: 'Santa Catarina (SED/SC)',
    description:
      'Acompanhamento das ações que a Secretaria de Educação de SC (SED/SC) precisa executar para viabilizar a ETEC. Segue diretrizes do TCU e Guia InovaGovSC.',
    leadIds: [],
    color: '#8B5CF6',
    icon: 'Building2',
    taskIds: [
      'task-sc-01',
      'task-sc-02',
      'task-sc-03',
      'task-sc-04',
      'task-sc-05',
      'task-sc-06',
      'task-sc-07',
      'task-mapeamento-stakeholders',
      'task-diagnostico-validacao',
      'task-etp-estudo-preliminar',
      'task-pesquisa-mercado',
      'task-universidade-gratuita-modulo',
    ],
  },
  {
    id: 'pedagogico',
    name: 'Pedagógico',
    description:
      'Alinhamento curricular BNCC, design do programa de formação de professores, critérios de seleção de escolas piloto.',
    leadIds: [],
    color: '#EC4899',
    icon: 'GraduationCap',
    taskIds: [
      'task-ped-01',
      'task-ped-02',
      'task-ped-03',
      'task-ped-04',
      'task-multiplicadores-regionais',
      'task-modulo-formacao-basico',
    ],
  },
  {
    id: 'administrativo_financeiro',
    name: 'Administrativo e Financeiro',
    description:
      'Planejamento financeiro, alocação orçamentária por fase, compliance e prestação de contas.',
    leadIds: ['pessoa-enio'],
    color: '#14B8A6',
    icon: 'Wallet',
    taskIds: [
      'task-adm-01',
      'task-adm-02',
      'task-adm-03',
      'task-adm-04',
    ],
  },
];

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export const tasks: Task[] = [
  // =========================================================================
  // JURIDICO
  // =========================================================================
  {
    id: 'task-jur-01',
    title: 'Registrar Estatuto do Instituto i10',
    description:
      'Finalizar e protocolar o estatuto social do Instituto i10 no cartório competente. Prazo crítico: quarta-feira 18/03/2026. Necessário para existência jurídica da organização.',
    status: 'em_andamento',
    priority: 'critica',
    departmentId: 'juridico',
    assigneeIds: ['pessoa-mercia', 'pessoa-emerson'],
    dueDate: '2026-03-18',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: [],
    notes:
      'URGENTE - Prazo iminente. Sem o registro do estatuto, o Instituto i10 não existe juridicamente e nenhuma outra ação formal pode prosseguir. Bloqueia CNPJ, assembleia e contratos.',
    progress: 60,
    tags: ['urgente', 'bloqueante', 'fundacao'],
    subtasks: [],
  },
  {
    id: 'task-estatuto-cartorio',
    title: 'Dar entrada no Estatuto no Cartório',
    description:
      'Protocolar o estatuto do Instituto i10 no Cartório de Registro Civil de Pessoas Jurídicas. Levar: estatuto original assinado por todos os fundadores, documentos pessoais (RG + CPF) de todos os signatários, comprovante de pagamento das taxas cartoriais.',
    status: 'nao_iniciada',
    priority: 'critica',
    departmentId: 'juridico',
    assigneeIds: ['pessoa-mercia', 'pessoa-emerson'],
    dueDate: '2026-03-26',
    createdAt: '2026-03-20',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-jur-01'],
    notes:
      'Prazo CRÍTICO - 26 de março. Levar todos os documentos originais assinados pelos fundadores.',
    progress: 0,
    tags: ['cartório', 'estatuto', 'fundação', 'prazo-crítico'],
    subtasks: [],
  },
  {
    id: 'task-cnpj-regularizacao',
    title: 'Regularização do CNPJ 05.124.602/0001-74',
    description:
      'Verificar e regularizar situação cadastral do CNPJ junto à Receita Federal. Garantir que esteja ativo e sem pendências para assinatura do contrato ETEC.',
    status: 'em_andamento',
    priority: 'critica',
    departmentId: 'juridico',
    assigneeIds: ['pessoa-mercia'],
    dueDate: '2026-04-15',
    createdAt: '2026-03-15',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: [],
    notes:
      'CNPJ 05.124.602/0001-74 precisa estar ativo e sem pendências na Receita Federal para assinatura do contrato ETEC.',
    progress: 30,
    tags: ['cnpj', 'receita-federal', 'regularização'],
    subtasks: [],
  },
  {
    id: 'task-ripd-lgpd',
    title: 'Elaborar RIPD — Relatório de Impacto à Proteção de Dados',
    description:
      'Relatório de Impacto à Proteção de Dados Pessoais (RIPD) preliminar conforme exigência da Portaria SED/SC e LGPD. Especial atenção a dados de menores (alunos). Obrigatório para o contrato ETEC.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'juridico',
    assigneeIds: ['pessoa-mercia', 'pessoa-emerson'],
    dueDate: '2026-04-25',
    createdAt: '2026-03-20',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: [],
    notes:
      'RIPD exigido pela Portaria SED/SC. Foco especial em dados de menores de idade (alunos da rede estadual).',
    progress: 0,
    tags: ['lgpd', 'ripd', 'conformidade', 'dados-pessoais'],
    subtasks: [],
  },
  {
    id: 'task-declaracao-conflito',
    title: 'Termo de Confidencialidade e Ausência de Conflito de Interesse',
    description:
      'Elaborar e assinar Termo de Confidencialidade e Declaração de Ausência de Conflito de Interesse (Anexo IV da Portaria SED/SC) para todos os membros que participarão das reuniões com a Comissão SED/SC.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'juridico',
    assigneeIds: ['pessoa-mercia', 'pessoa-emerson'],
    dueDate: '2026-04-10',
    createdAt: '2026-03-20',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: [],
    notes:
      'Anexo IV da Portaria SED/SC. Todos os membros que participarão da Comissão devem assinar.',
    progress: 0,
    tags: ['conformidade', 'ética', 'comissão-sed'],
    subtasks: [],
  },
  {
    id: 'task-jur-02',
    title: 'Registrar Instituto i10 em Santa Catarina',
    description:
      'Efetuar o registro do Instituto i10 junto aos órgãos competentes do estado de Santa Catarina para operação local.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'juridico',
    assigneeIds: ['pessoa-mercia', 'pessoa-emerson'],
    dueDate: '2026-04-15',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-jur-01'],
    notes:
      'Depende do registro do estatuto. Necessário para operar formalmente em SC e firmar contratos com o governo estadual.',
    progress: 0,
    tags: ['fundacao', 'sc'],
    subtasks: [],
  },
  {
    id: 'task-jur-03',
    title: 'Atualizar CNPJ',
    description:
      'Obter ou atualizar o CNPJ do Instituto i10 junto à Receita Federal com as informações do novo estatuto.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'juridico',
    assigneeIds: ['pessoa-mercia'],
    dueDate: '2026-04-10',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-jur-01'],
    notes:
      'Depende do registro do estatuto. CNPJ necessário para abertura de conta bancária, contratos e notas fiscais.',
    progress: 0,
    tags: ['fundacao', 'bloqueante'],
    subtasks: [],
  },
  {
    id: 'task-jur-04',
    title: 'Elaborar contratos de parceria',
    description:
      'Preparar minutas de contratos de parceria com empresas associadas (Jinso, Sprix, MadeinWEB, Gestorial) e eventuais termos de cooperação com SED/SC.',
    status: 'nao_iniciada',
    priority: 'media',
    departmentId: 'juridico',
    assigneeIds: ['pessoa-emerson'],
    dueDate: '2026-05-15',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-jur-01', 'task-jur-03'],
    notes:
      'Contratos devem prever termos de propriedade intelectual, confidencialidade e escopo de atuação de cada parceiro.',
    progress: 0,
    tags: ['contratos', 'parcerias'],
    subtasks: [],
  },
  {
    id: 'task-jur-05',
    title: 'Preparação de conformidade LGPD',
    description:
      'Desenvolver política de privacidade, termos de uso e procedimentos de tratamento de dados pessoais conforme a LGPD, especialmente para dados de alunos menores.',
    status: 'nao_iniciada',
    priority: 'media',
    departmentId: 'juridico',
    assigneeIds: ['pessoa-mercia', 'pessoa-emerson'],
    dueDate: '2026-06-30',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-1',
    dependencies: ['task-jur-01'],
    notes:
      'Crítico para a plataforma educacional que lidará com dados de menores de idade. Deve estar pronto antes do início da PoC com escolas.',
    progress: 0,
    tags: ['lgpd', 'compliance', 'dados'],
    subtasks: [],
  },

  // =========================================================================
  // TECNOLOGIA
  // =========================================================================
  {
    id: 'task-tech-01',
    title: 'Definir arquitetura de integração da plataforma',
    description:
      'Projetar a arquitetura técnica da plataforma educacional, incluindo microsserviços, banco de dados, APIs e pontos de integração com sistemas existentes da SED/SC.',
    status: 'em_andamento',
    priority: 'alta',
    departmentId: 'tecnologia',
    assigneeIds: ['pessoa-bruno-almeida'],
    dueDate: '2026-04-30',
    createdAt: '2026-03-05',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: [],
    notes:
      'Deve considerar sistemas legados de SC (SISGESC, Professor Online, etc). Arquitetura precisa ser escalável para expansão estadual.',
    progress: 25,
    tags: ['arquitetura', 'integracao', 'plataforma'],
    subtasks: [],
  },
  {
    id: 'task-tech-02',
    title: 'Mapeamento de APIs de sistemas legados SC',
    description:
      'Identificar e documentar todas as APIs disponíveis dos sistemas educacionais de Santa Catarina (SISGESC, SIGEF, Professor Online, entre outros).',
    status: 'em_andamento',
    priority: 'alta',
    departmentId: 'tecnologia',
    assigneeIds: ['pessoa-bruno-almeida'],
    dueDate: '2026-05-15',
    createdAt: '2026-03-05',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: [],
    notes:
      'Depende de acesso concedido pela SED/SC. Bruno Quick está articulando junto ao governo.',
    progress: 10,
    tags: ['apis', 'legado', 'sc', 'integracao'],
    subtasks: [],
  },
  {
    id: 'task-tech-03',
    title: 'Desenvolvimento da PoC',
    description:
      'Construir a prova de conceito da plataforma educacional com funcionalidades core: gestão de conteúdo alinhado à BNCC, dashboard do professor e módulo de aprendizagem adaptativa.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'tecnologia',
    assigneeIds: ['pessoa-bruno-almeida'],
    dueDate: '2026-08-31',
    createdAt: '2026-03-05',
    completedAt: null,
    phaseId: 'phase-1',
    dependencies: ['task-tech-01', 'task-tech-02'],
    notes:
      'PoC deve demonstrar valor suficiente para justificar o investimento completo no piloto. Meta: 3 escolas testando até setembro/2026.',
    progress: 0,
    tags: ['poc', 'desenvolvimento', 'plataforma'],
    subtasks: [],
  },
  {
    id: 'task-tech-04',
    title: 'Treinamento de modelos de IA',
    description:
      'Desenvolver e treinar modelos de inteligência artificial para personalização de aprendizagem, identificação de gaps de conhecimento e recomendação de conteúdo baseado na BNCC.',
    status: 'nao_iniciada',
    priority: 'media',
    departmentId: 'tecnologia',
    assigneeIds: ['pessoa-bruno-almeida'],
    dueDate: '2026-09-15',
    createdAt: '2026-03-05',
    completedAt: null,
    phaseId: 'phase-1',
    dependencies: ['task-tech-01', 'task-ped-01'],
    notes:
      'Depende do alinhamento curricular BNCC do time pedagógico. Modelos iniciais podem usar dados sintéticos até dados reais estarem disponíveis.',
    progress: 0,
    tags: ['ia', 'machine-learning', 'bncc', 'personalizacao'],
    subtasks: [],
  },
  {
    id: 'task-tech-05',
    title: 'Setup de infraestrutura cloud e CI/CD',
    description:
      'Configurar ambiente de nuvem (AWS/GCP), pipelines de CI/CD, monitoramento, logs e ambientes de desenvolvimento, staging e produção.',
    status: 'nao_iniciada',
    priority: 'media',
    departmentId: 'tecnologia',
    assigneeIds: ['pessoa-bruno-almeida'],
    dueDate: '2026-05-31',
    createdAt: '2026-03-10',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: [],
    notes:
      'Deve considerar requisitos de soberania de dados (dados educacionais brasileiros). Verificar se há exigência de datacenter nacional.',
    progress: 0,
    tags: ['infraestrutura', 'devops', 'cloud'],
    subtasks: [],
  },
  {
    id: 'task-tech-06',
    title: 'Definir stack tecnológico e padrões',
    description:
      'Documentar decisões de stack (linguagens, frameworks, banco de dados), padrões de código, guidelines de contribuição e ferramentas de desenvolvimento.',
    status: 'em_andamento',
    priority: 'alta',
    departmentId: 'tecnologia',
    assigneeIds: ['pessoa-bruno-almeida'],
    dueDate: '2026-04-15',
    createdAt: '2026-03-05',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: [],
    notes:
      'Alinhamento com parceiros tecnológicos (Jinso, Sprix, MadeinWEB) sobre capacidades e preferências técnicas.',
    progress: 30,
    tags: ['stack', 'padroes', 'documentacao'],
    subtasks: [],
  },
  {
    id: 'task-arquitetura-plataforma',
    title: 'Definir Arquitetura da Plataforma (34 Deliverables)',
    description:
      'Documentar a arquitetura técnica completa das 34 entregas técnicas organizadas em 5 camadas: L1 Acesso Unificado (S01-S03), L2 Integridade de Dados (S04-S06), L3 Integração Ped-Adm (S07-S14), L4 Análise e Experimentação IA (S15-S23), L5 Transferência Institucional (S24-S29) + Componentes Transversais (S30-S34).',
    status: 'em_andamento',
    priority: 'critica',
    departmentId: 'tecnologia',
    assigneeIds: ['pessoa-bruno-almeida'],
    dueDate: '2026-04-20',
    createdAt: '2026-03-15',
    completedAt: null,
    phaseId: 'phase-1',
    dependencies: [],
    notes:
      '5 camadas arquiteturais: L1(S01-S03), L2(S04-S06), L3(S07-S14), L4(S15-S23), L5(S24-S29) + Transversais(S30-S34).',
    progress: 20,
    tags: ['arquitetura', 'deliverables', 'poc'],
    subtasks: [],
  },
  {
    id: 'task-connectors-legados',
    title: 'Desenvolver Conectores Sistemas Legados SED/SC (S02)',
    description:
      'Desenvolver e validar conectores específicos para cada sistema legado: Professor Online, SISGESC, SED Virtual, Sistema de Matrícula, Pergamum. Cada integração tratada como hipótese de pesquisa (TRL 3→7).',
    status: 'nao_iniciada',
    priority: 'critica',
    departmentId: 'tecnologia',
    assigneeIds: ['pessoa-bruno-almeida'],
    dueDate: '2026-09-30',
    createdAt: '2026-03-20',
    completedAt: null,
    phaseId: 'phase-1',
    dependencies: ['task-arquitetura-plataforma'],
    notes:
      '5 sistemas legados: Professor Online, SISGESC, SED Virtual, Matrícula, Pergamum. TRL 3→7.',
    progress: 0,
    tags: ['integração', 'legados', 'conectores', 'poc'],
    subtasks: [],
  },
  {
    id: 'task-offline-first',
    title: 'Implementar Capacidades Offline (S33)',
    description:
      'Funções críticas operam localmente sem rede; sincronização automática ao reconectar. Essencial para escolas com infraestrutura de telecomunicações limitada (Oeste e Planalto Serrano SC).',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'tecnologia',
    assigneeIds: ['pessoa-bruno-almeida'],
    dueDate: '2026-09-30',
    createdAt: '2026-03-20',
    completedAt: null,
    phaseId: 'phase-1',
    dependencies: ['task-arquitetura-plataforma'],
    notes:
      'Essencial para Oeste e Planalto Serrano SC - regiões com infraestrutura limitada de telecomunicações.',
    progress: 0,
    tags: ['offline', 'sync', 'poc', 'infraestrutura'],
    subtasks: [],
  },
  {
    id: 'task-modelo-ia-bncc',
    title: 'Modelo de IA — Trilhas Adaptativas (S17)',
    description:
      'Desenvolver motor de trilhas de aprendizagem individualizadas por competência (Matemática e Português EM). Diagnóstico inicial, progressão personalizada, reforço automático. Treinado com dados curriculares BNCC e dados SC.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'tecnologia',
    assigneeIds: ['pessoa-bruno-almeida'],
    dueDate: '2026-09-30',
    createdAt: '2026-03-20',
    completedAt: null,
    phaseId: 'phase-1',
    dependencies: ['task-arquitetura-plataforma'],
    notes:
      'Matemática e Português EM. BNCC + Currículo Base do Território Catarinense.',
    progress: 0,
    tags: ['ia', 'trilhas-adaptativas', 'bncc', 'poc'],
    subtasks: [],
  },

  // =========================================================================
  // RELAÇÕES PÚBLICAS E PARCERIAS
  // =========================================================================
  {
    id: 'task-rp-01',
    title: 'Articulação com governo de SC',
    description:
      'Manter e aprofundar o relacionamento com a SED/SC, Gabinete do Governador e demais órgãos relevantes para viabilizar a ETEC.',
    status: 'em_andamento',
    priority: 'alta',
    departmentId: 'relacoes_publicas',
    assigneeIds: ['pessoa-bruno-quick'],
    dueDate: null,
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: [],
    notes:
      'Atividade contínua. Fundamental para o sucesso do projeto. Inclui reuniões periódicas, alinhamento de expectativas e suporte político.',
    progress: 30,
    tags: ['governo', 'sc', 'relacionamento'],
    subtasks: [],
  },
  {
    id: 'task-rp-02',
    title: 'Comunicação com stakeholders',
    description:
      'Desenvolver estratégia de comunicação institucional e manter stakeholders informados sobre progresso do projeto ETEC.',
    status: 'nao_iniciada',
    priority: 'media',
    departmentId: 'relacoes_publicas',
    assigneeIds: ['pessoa-bruno-quick'],
    dueDate: '2026-04-30',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: [],
    notes:
      'Inclui newsletter mensal, relatórios de progresso para investidores e comunicação com comunidade educacional.',
    progress: 0,
    tags: ['comunicacao', 'stakeholders'],
    subtasks: [],
  },
  {
    id: 'task-rp-03',
    title: 'Acordos de parceria pública',
    description:
      'Negociar e formalizar acordos de parceria pública com órgãos governamentais de SC, incluindo termos de cooperação técnica.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'relacoes_publicas',
    assigneeIds: ['pessoa-bruno-quick'],
    dueDate: '2026-05-31',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-jur-01', 'task-jur-02'],
    notes:
      'Depende da existência jurídica do Instituto i10 (estatuto registrado e Instituto i10 registrado em SC).',
    progress: 0,
    tags: ['parcerias', 'governo', 'acordos'],
    subtasks: [],
  },
  {
    id: 'task-rp-04',
    title: 'Convite e engajamento do conselho consultivo',
    description:
      'Formalizar convites para Daniel Aguado (FDC), Franco (FAAP), Daniel Mendes e Mariza (ex-MEC) para o conselho consultivo do Instituto i10.',
    status: 'nao_iniciada',
    priority: 'media',
    departmentId: 'relacoes_publicas',
    assigneeIds: ['pessoa-raphael', 'pessoa-bruno-quick'],
    dueDate: '2026-04-30',
    createdAt: '2026-03-10',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-jur-01'],
    notes:
      'Convites devem ser formalizados após registro do estatuto. Preparar material institucional e proposta de valor para cada convidado.',
    progress: 0,
    tags: ['conselho', 'advisory', 'convites'],
    subtasks: [],
  },

  // =========================================================================
  // OPERAÇÕES LOCAIS
  // =========================================================================
  {
    id: 'task-ops-01',
    title: 'Estruturar rede de provedores locais',
    description:
      'Mapear, avaliar e contratar provedores de serviços locais em SC (internet, hardware, suporte técnico) para suportar a implantação nas escolas.',
    status: 'nao_iniciada',
    priority: 'media',
    departmentId: 'operacoes_locais',
    assigneeIds: ['pessoa-gustavo'],
    dueDate: '2026-06-30',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-1',
    dependencies: [],
    notes:
      'Considerar cobertura geográfica de SC, diversidade de regiões (litoral, serra, oeste) e diferentes necessidades de infraestrutura.',
    progress: 0,
    tags: ['provedores', 'infraestrutura', 'sc'],
    subtasks: [],
  },
  {
    id: 'task-ops-02',
    title: 'Montar escritório em SC',
    description:
      'Identificar local, negociar aluguel e montar escritório operacional em Florianópolis para a equipe de campo do i10.',
    status: 'em_andamento',
    priority: 'alta',
    departmentId: 'operacoes_locais',
    assigneeIds: ['pessoa-gustavo'],
    dueDate: '2026-04-01',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: [],
    notes:
      'Escritório no Edifício Corporativo Softplan, Sapiens Park, Av. Luiz Boiteux Piazza, 1302, Canasvieiras, Florianópolis/SC. CBMSC válido até 07/06/2026.',
    progress: 60,
    tags: ['escritorio', 'florianopolis', 'sapiens-park', 'infraestrutura'],
    subtasks: [],
  },
  {
    id: 'task-escritorio-setup',
    title: 'Montagem e Operacionalização do Escritório Sapiens Park',
    description:
      'Configurar escritório no Edifício Corporativo Softplan, Sapiens Park, Av. Luiz Boiteux Piazza, 1302, Canasvieiras, Florianópolis/SC. CBMSC válido até 07/06/2026. Setup: mobiliário, internet, equipamentos, identidade visual i10.',
    status: 'em_andamento',
    priority: 'alta',
    departmentId: 'operacoes_locais',
    assigneeIds: ['pessoa-gustavo'],
    dueDate: '2026-04-01',
    createdAt: '2026-03-20',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: [],
    notes:
      'Sapiens Park, Canasvieiras, Florianópolis/SC. CBMSC válido até 07/06/2026. Setup completo: mobiliário, internet, equipamentos.',
    progress: 40,
    tags: ['escritório', 'sapiens-park', 'infraestrutura'],
    subtasks: [],
  },
  {
    id: 'task-ops-03',
    title: 'Coordenação de equipe de campo',
    description:
      'Definir processos de coordenação para equipe de campo que atuará nas escolas piloto, incluindo logística, comunicação e relatórios.',
    status: 'nao_iniciada',
    priority: 'baixa',
    departmentId: 'operacoes_locais',
    assigneeIds: ['pessoa-gustavo'],
    dueDate: '2026-08-31',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-1',
    dependencies: ['task-ops-02'],
    notes:
      'Processos devem estar prontos antes do início do piloto controlado em outubro/2026.',
    progress: 0,
    tags: ['equipe', 'campo', 'processos'],
    subtasks: [],
  },
  {
    id: 'task-ops-04',
    title: 'Levantamento de infraestrutura escolar',
    description:
      'Realizar diagnóstico da infraestrutura tecnológica (internet, equipamentos, rede elétrica) das escolas candidatas ao piloto em SC.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'operacoes_locais',
    assigneeIds: ['pessoa-gustavo'],
    dueDate: '2026-07-31',
    createdAt: '2026-03-10',
    completedAt: null,
    phaseId: 'phase-1',
    dependencies: [],
    notes:
      'Trabalho conjunto com SED/SC para acesso às escolas. Resultado alimenta critérios de seleção do time pedagógico.',
    progress: 0,
    tags: ['diagnostico', 'escolas', 'infraestrutura'],
    subtasks: [],
  },

  // =========================================================================
  // SANTA CATARINA (SED/SC) - Ações que o governo deve executar
  // =========================================================================
  {
    id: 'task-sc-01',
    title: 'Concluir documento de Planejamento e Diagnóstico',
    description:
      'SED/SC deve elaborar o documento de Planejamento e Diagnóstico que justifica a necessidade da ETEC, conforme diretrizes do TCU e Guia InovaGovSC.',
    status: 'em_andamento',
    priority: 'critica',
    departmentId: 'santa_catarina',
    assigneeIds: [],
    dueDate: '2026-04-15',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: [],
    notes:
      'Documento fundamental conforme TCU. Deve conter análise do problema, justificativa da ETEC vs. outras modalidades de contratação, e diagnóstico da situação atual.',
    progress: 40,
    tags: ['sed', 'tcu', 'inovagovsc', 'documento'],
    subtasks: [],
  },
  {
    id: 'task-sc-02',
    title: 'Concluir ETP (Estudo Técnico Preliminar)',
    description:
      'SED/SC deve elaborar o Estudo Técnico Preliminar detalhando viabilidade técnica e econômica da ETEC.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'santa_catarina',
    assigneeIds: [],
    dueDate: '2026-04-30',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-sc-01'],
    notes:
      'Conforme Guia InovaGovSC. Deve incluir análise de risco tecnológico, estimativa de custos e cronograma preliminar.',
    progress: 0,
    tags: ['sed', 'etp', 'inovagovsc'],
    subtasks: [],
  },
  {
    id: 'task-sc-03',
    title: 'Publicar Portaria criando comissão ETEC',
    description:
      'Governo de SC deve publicar Portaria oficial criando a comissão responsável pela condução do processo de ETEC.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'santa_catarina',
    assigneeIds: [],
    dueDate: '2026-04-20',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-sc-01'],
    notes:
      'Portaria deve designar membros da comissão com representantes da SED, CIASC e áreas técnicas do governo.',
    progress: 0,
    tags: ['sed', 'portaria', 'comissao'],
    subtasks: [],
  },
  {
    id: 'task-sc-04',
    title: 'Elaborar Termo de Referência',
    description:
      'Comissão ETEC deve elaborar o Termo de Referência com especificações técnicas, critérios de seleção da ICT e métricas de avaliação.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'santa_catarina',
    assigneeIds: [],
    dueDate: '2026-05-15',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-sc-02', 'task-sc-03'],
    notes:
      'Deve definir claramente: problema a ser resolvido, requisitos técnicos, marcos contratuais, propriedade intelectual e métricas de sucesso.',
    progress: 0,
    tags: ['sed', 'termo-referencia', 'especificacoes'],
    subtasks: [],
  },
  {
    id: 'task-sc-05',
    title: 'Submeter à PGE/SC para parecer jurídico',
    description:
      'Encaminhar toda a documentação para a Procuradoria Geral do Estado de SC para parecer jurídico sobre a legalidade e conformidade do processo.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'santa_catarina',
    assigneeIds: [],
    dueDate: '2026-05-31',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-sc-04'],
    notes:
      'PGE deve atestar legalidade do processo. Tempo médio de parecer: 15-30 dias. Pode haver pedidos de esclarecimento.',
    progress: 0,
    tags: ['sed', 'pge', 'parecer-juridico'],
    subtasks: [],
  },
  {
    id: 'task-sc-06',
    title: 'Publicar Chamamento / Seleção de ICT',
    description:
      'Publicar edital de chamamento público ou processo de seleção para escolha da Instituição Científica e Tecnológica (ICT) que executará a ETEC.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'santa_catarina',
    assigneeIds: [],
    dueDate: '2026-06-15',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-sc-05'],
    notes:
      'Conforme Lei de Inovação e regulamentação estadual. Instituto i10 deve estar preparado para apresentar proposta técnica e financeira.',
    progress: 0,
    tags: ['sed', 'chamamento', 'ict', 'selecao'],
    subtasks: [],
  },
  {
    id: 'task-sc-07',
    title: 'Assinar contrato ETEC',
    description:
      'Assinatura formal do contrato de Encomenda Tecnológica entre o Estado de Santa Catarina e a ICT selecionada.',
    status: 'nao_iniciada',
    priority: 'critica',
    departmentId: 'santa_catarina',
    assigneeIds: [],
    dueDate: '2026-07-15',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-1',
    dependencies: ['task-sc-06'],
    notes:
      'Marco fundamental do projeto. Após assinatura, inicia-se oficialmente a execução da ETEC com recursos do estado.',
    progress: 0,
    tags: ['sed', 'contrato', 'etec', 'marco'],
    subtasks: [],
  },
  {
    id: 'task-mapeamento-stakeholders',
    title: 'Mapeamento de Stakeholders SED/SC',
    description:
      'Identificar e mapear todos os stakeholders da SED/SC: DTIE, GEINFE, DIEN, Compras, ASJUR, CREs (37 unidades). Criar mapa de influência e plano de engajamento para cada área.',
    status: 'em_andamento',
    priority: 'critica',
    departmentId: 'santa_catarina',
    assigneeIds: [],
    dueDate: '2026-04-05',
    createdAt: '2026-03-15',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: [],
    notes:
      'Stakeholders chave: DTIE, GEINFE, DIEN, Compras, ASJUR e 37 CREs regionais.',
    progress: 25,
    tags: ['stakeholders', 'sed-sc', 'engajamento'],
    subtasks: [],
  },
  {
    id: 'task-diagnostico-validacao',
    title: 'Fase A — Validação do Diagnóstico (Dias 1-10 da Comissão)',
    description:
      'Validar o diagnóstico do documento PD-SED-2025/001. Confirmar: 5 sistemas legados sem integração (Professor Online, SISGESC, SED Virtual, Matrícula, Pergamum), IDEB EM 4.2, dropout 5.2%, distorção 21.9%, 70% professores ACT. Apresentar para Comissão.',
    status: 'nao_iniciada',
    priority: 'critica',
    departmentId: 'santa_catarina',
    assigneeIds: [],
    dueDate: '2026-04-18',
    createdAt: '2026-03-20',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: [],
    notes:
      'Documento PD-SED-2025/001. 5 sistemas legados, IDEB 4.2, dropout 5.2%, distorção 21.9%, 70% ACT.',
    progress: 0,
    tags: ['comissão-sed', 'fase-a', 'diagnóstico'],
    subtasks: [],
  },
  {
    id: 'task-etp-estudo-preliminar',
    title: 'Fase B — Estudo Técnico Preliminar (ETP) (Dias 5-30)',
    description:
      'Elaborar o ETP com: mapa de riscos, avaliação TRL (componentes em TRL 3-5, plataforma IBEF em TRL 7-8), análise make-or-buy, modelo contratual recomendado. Apresentar 34 deliverables técnicos organizados nas 5 camadas arquiteturais.',
    status: 'nao_iniciada',
    priority: 'critica',
    departmentId: 'santa_catarina',
    assigneeIds: [],
    dueDate: '2026-04-28',
    createdAt: '2026-03-20',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-diagnostico-validacao'],
    notes:
      'ETP com 34 deliverables técnicos em 5 camadas: L1 Acesso, L2 Dados, L3 Integração, L4 IA, L5 Transferência.',
    progress: 0,
    tags: ['comissão-sed', 'fase-b', 'etp', 'trl'],
    subtasks: [],
  },
  {
    id: 'task-pesquisa-mercado',
    title: 'Fase C — Pesquisa de Mercado e Precificação (Dias 15-35)',
    description:
      'Realizar pesquisa de mercado e composição de preços para o ETEC. Elaborar RFI/consulta pública. Precificar Fase 1 (R&D para PoC). Benchmarking com ETECs similares no Brasil.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'santa_catarina',
    assigneeIds: [],
    dueDate: '2026-04-30',
    createdAt: '2026-03-20',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-etp-estudo-preliminar'],
    notes:
      'RFI/consulta pública. Precificação da Fase 1. Benchmarking com ETECs brasileiras.',
    progress: 0,
    tags: ['comissão-sed', 'fase-c', 'precificação', 'pesquisa-mercado'],
    subtasks: [],
  },
  {
    id: 'task-minuta-contrato',
    title: 'Fase D — Elaboração da Minuta de Contrato ETEC (Dias 30-45)',
    description:
      'Elaborar: Edital/Termo de Referência, Minuta de Contrato com Matriz de Risco, modelo de remuneração (5 modelos possíveis pelo Art. 29 §1º do Decreto 9.283/2018). Obter parecer jurídico.',
    status: 'nao_iniciada',
    priority: 'critica',
    departmentId: 'juridico',
    assigneeIds: ['pessoa-mercia', 'pessoa-emerson'],
    dueDate: '2026-04-28',
    createdAt: '2026-03-20',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-pesquisa-mercado'],
    notes:
      'Art. 29 §1º do Decreto 9.283/2018 - 5 modelos de remuneração possíveis. Obter parecer jurídico.',
    progress: 0,
    tags: ['comissão-sed', 'fase-d', 'contrato', 'decreto-9283'],
    subtasks: [],
  },
  {
    id: 'task-universidade-gratuita-modulo',
    title: 'Módulo Universidade Gratuita SC (S34)',
    description:
      'Integração e melhoria do sistema de gestão do programa Universidade Gratuita (LC 831/2023, alterada por LC 866/2025). Resolver achados TCE-SC: inconsistências em 18.383 beneficiários e divergências patrimoniais em 15.281 registros. Validação automática de elegibilidade cruzando DIRPF, CadÚnico, CNIS.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'santa_catarina',
    assigneeIds: [],
    dueDate: '2027-12-31',
    createdAt: '2026-03-20',
    completedAt: null,
    phaseId: 'phase-3',
    dependencies: [],
    notes:
      'LC 831/2023 alterada por LC 866/2025. TCE-SC achados: 18.383 beneficiários com inconsistências, 15.281 divergências patrimoniais.',
    progress: 0,
    tags: ['universidade-gratuita', 'tce-sc', 'elegibilidade', 'auditoria'],
    subtasks: [],
  },

  // =========================================================================
  // PEDAGÓGICO
  // =========================================================================
  {
    id: 'task-ped-01',
    title: 'Alinhamento curricular BNCC',
    description:
      'Mapear competências e habilidades da BNCC relevantes para a plataforma, organizando a estrutura curricular que será base para o conteúdo e a IA.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'pedagogico',
    assigneeIds: [],
    dueDate: '2026-06-30',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-1',
    dependencies: [],
    notes:
      'Priorizar Ensino Fundamental II e Ensino Médio para a PoC. Considerar currículo de SC (Currículo Base do Território Catarinense).',
    progress: 0,
    tags: ['bncc', 'curriculo', 'conteudo'],
    subtasks: [],
  },
  {
    id: 'task-ped-02',
    title: 'Design do programa de formação de professores',
    description:
      'Projetar programa de capacitação para professores que utilizarão a plataforma, incluindo módulos online e presenciais.',
    status: 'nao_iniciada',
    priority: 'media',
    departmentId: 'pedagogico',
    assigneeIds: [],
    dueDate: '2026-08-31',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-1',
    dependencies: ['task-ped-01'],
    notes:
      'Formação deve cobrir: uso da plataforma, metodologias ativas, interpretação de dados de aprendizagem e personalização do ensino.',
    progress: 0,
    tags: ['formacao', 'professores', 'capacitacao'],
    subtasks: [],
  },
  {
    id: 'task-ped-03',
    title: 'Definir critérios de seleção de escolas piloto',
    description:
      'Estabelecer critérios objetivos para seleção das escolas que participarão do piloto controlado, considerando diversidade e representatividade.',
    status: 'nao_iniciada',
    priority: 'media',
    departmentId: 'pedagogico',
    assigneeIds: [],
    dueDate: '2026-07-31',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-1',
    dependencies: ['task-ops-04'],
    notes:
      'Critérios: infraestrutura mínima, engajamento da gestão escolar, diversidade regional (litoral/serra/oeste), diferentes portes de escola.',
    progress: 0,
    tags: ['escolas', 'piloto', 'selecao', 'criterios'],
    subtasks: [],
  },
  {
    id: 'task-ped-04',
    title: 'Elaborar framework de avaliação de impacto',
    description:
      'Definir métricas, indicadores e metodologia para medir o impacto pedagógico da plataforma nos resultados de aprendizagem.',
    status: 'nao_iniciada',
    priority: 'media',
    departmentId: 'pedagogico',
    assigneeIds: [],
    dueDate: '2026-08-31',
    createdAt: '2026-03-10',
    completedAt: null,
    phaseId: 'phase-1',
    dependencies: ['task-ped-01'],
    notes:
      'Deve incluir: métricas quantitativas (notas, frequência, engajamento), qualitativas (percepção de professores/alunos) e grupo de controle.',
    progress: 0,
    tags: ['avaliacao', 'impacto', 'metricas'],
    subtasks: [],
  },
  {
    id: 'task-multiplicadores-regionais',
    title: 'Recrutar e Capacitar 74 Multiplicadores Regionais (S30)',
    description:
      'Selecionar 2 multiplicadores por CRE (37 CREs = 74 total) em conjunto com as CREs. Critérios IBEF/SED-SC. Capacitação: 40 horas (módulos presenciais + prática supervisionada). Certificação pela Escola de Formação de Professores SC (Programa Qualifica SC).',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'pedagogico',
    assigneeIds: [],
    dueDate: '2027-03-31',
    createdAt: '2026-03-20',
    completedAt: null,
    phaseId: 'phase-2',
    dependencies: [],
    notes:
      '37 CREs × 2 = 74 multiplicadores. Capacitação 40h. Certificação Programa Qualifica SC.',
    progress: 0,
    tags: ['multiplicadores', 'cres', 'formação', 'capacitação'],
    subtasks: [],
  },
  {
    id: 'task-modulo-formacao-basico',
    title: 'Módulo de Formação Básico — 80% do Corpo Docente',
    description:
      'Desenvolver e executar Módulo I: operação da interface unificada, navegação, entrada de dados, funcionalidades básicas. Meta: 80% do corpo docente. Articular com Escola de Formação de Professores SC.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'pedagogico',
    assigneeIds: [],
    dueDate: '2027-06-30',
    createdAt: '2026-03-20',
    completedAt: null,
    phaseId: 'phase-2',
    dependencies: ['task-multiplicadores-regionais'],
    notes:
      'Meta: 80% do corpo docente capacitado no Módulo I. Articular com Escola de Formação SC.',
    progress: 0,
    tags: ['formação', 'professores', 'módulo-básico'],
    subtasks: [],
  },

  // =========================================================================
  // ADMINISTRATIVO E FINANCEIRO
  // =========================================================================
  {
    id: 'task-adm-01',
    title: 'Planejamento financeiro geral',
    description:
      'Elaborar planejamento financeiro completo do projeto ETEC incluindo projeções de receita, custos operacionais e fluxo de caixa para 24 meses.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'administrativo_financeiro',
    assigneeIds: ['pessoa-enio'],
    dueDate: '2026-04-30',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-jur-03'],
    notes:
      'Depende do CNPJ para abertura de conta bancária. Orçamento total estimado: R$ 4.65M ao longo de 24 meses.',
    progress: 0,
    tags: ['financeiro', 'planejamento', 'orcamento'],
    subtasks: [],
  },
  {
    id: 'task-adm-02',
    title: 'Alocação orçamentária por fase',
    description:
      'Detalhar a alocação orçamentária para cada fase do projeto, com rubricas específicas e reserva de contingência.',
    status: 'nao_iniciada',
    priority: 'media',
    departmentId: 'administrativo_financeiro',
    assigneeIds: ['pessoa-enio'],
    dueDate: '2026-05-15',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-adm-01'],
    notes:
      'Fase 0: R$150k | Fase 1: R$800k | Fase 2: R$2.5M | Fase 3: R$1.2M. Incluir 10% de contingência em cada fase.',
    progress: 0,
    tags: ['orcamento', 'fases', 'alocacao'],
    subtasks: [],
  },
  {
    id: 'task-adm-03',
    title: 'Setup de compliance e prestação de contas',
    description:
      'Implementar processos e sistemas para compliance com regras de licitação pública, prestação de contas ao TCU e transparência.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'administrativo_financeiro',
    assigneeIds: ['pessoa-enio'],
    dueDate: '2026-05-31',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-jur-03'],
    notes:
      'Essencial para contrato com governo. Deve atender requisitos de transparência, auditabilidade e prestação de contas periódica.',
    progress: 0,
    tags: ['compliance', 'tcu', 'transparencia', 'prestacao-contas'],
    subtasks: [],
  },
  {
    id: 'task-adm-04',
    title: 'Abertura de conta bancária institucional',
    description:
      'Abrir conta bancária em nome do Instituto i10 para movimentação de recursos do projeto.',
    status: 'nao_iniciada',
    priority: 'alta',
    departmentId: 'administrativo_financeiro',
    assigneeIds: ['pessoa-enio'],
    dueDate: '2026-04-20',
    createdAt: '2026-03-10',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-jur-03'],
    notes:
      'Depende do CNPJ atualizado. Priorizar banco com experiência em contas de organizações do terceiro setor.',
    progress: 0,
    tags: ['banco', 'conta', 'financeiro'],
    subtasks: [],
  },
];

// ---------------------------------------------------------------------------
// Associate Companies
// ---------------------------------------------------------------------------

export const companies: AssociateCompany[] = [
  {
    id: 'empresa-jinso',
    name: 'Jinso',
    type: 'tech',
    description:
      'Parceiro tecnológico para desenvolvimento de plataformas digitais e soluções de engenharia de software.',
    contactPerson: null,
    website: null,
    departmentIds: ['tecnologia'],
  },
  {
    id: 'empresa-sprix',
    name: 'Sprix',
    type: 'tech',
    description:
      'Parceiro tecnológico com expertise em soluções educacionais e tecnologias de aprendizagem.',
    contactPerson: null,
    website: null,
    departmentIds: ['tecnologia'],
  },
  {
    id: 'empresa-madeinweb',
    name: 'MadeinWEB',
    type: 'tech',
    description:
      'Parceiro tecnológico especializado em desenvolvimento web, aplicativos e soluções digitais.',
    contactPerson: null,
    website: null,
    departmentIds: ['tecnologia'],
  },
  {
    id: 'empresa-gestorial',
    name: 'Gestorial',
    type: 'administrative',
    description:
      'Parceiro de serviços administrativos e contábeis. Responsável pelo suporte contábil e fiscal do Instituto i10.',
    contactPerson: null,
    website: null,
    departmentIds: ['administrativo_financeiro'],
  },
];

// ---------------------------------------------------------------------------
// Milestones
// ---------------------------------------------------------------------------

export const milestones: Milestone[] = [
  {
    id: 'marco-01',
    title: 'Registro do Estatuto do Instituto i10',
    description:
      'Registro formal do estatuto social do Instituto i10 em cartório. Prazo crítico e inegociável - sem este registro, a organização não existe juridicamente.',
    targetDate: '2026-03-18',
    status: 'em_andamento',
    phaseId: 'phase-0',
    isCritical: true,
    departmentIds: ['juridico'],
  },
  {
    id: 'marco-02',
    title: 'Primeira Assembleia de Fundação',
    description:
      'Assembleia geral de fundação do Instituto i10 com todos os fundadores. Formaliza a criação da organização, elege a diretoria e aprova o plano de trabalho.',
    targetDate: '2026-04-05',
    status: 'pendente',
    phaseId: 'phase-0',
    isCritical: true,
    departmentIds: ['juridico', 'administrativo_financeiro'],
  },
  {
    id: 'marco-03',
    title: 'CNPJ Ativo e Regular',
    description:
      'CNPJ do Instituto i10 atualizado e regular na Receita Federal, habilitando a organização para operações financeiras e contratos.',
    targetDate: '2026-04-10',
    status: 'pendente',
    phaseId: 'phase-0',
    isCritical: true,
    departmentIds: ['juridico', 'administrativo_financeiro'],
  },
  {
    id: 'marco-04',
    title: 'Assinatura do Contrato ETEC',
    description:
      'Assinatura formal do contrato de Encomenda Tecnológica entre o Estado de Santa Catarina e o Instituto i10 / consórcio ICT.',
    targetDate: '2026-07-15',
    status: 'pendente',
    phaseId: 'phase-0',
    isCritical: true,
    departmentIds: ['santa_catarina', 'juridico', 'relacoes_publicas'],
  },
  {
    id: 'marco-05',
    title: 'Início da PoC',
    description:
      'Início oficial do desenvolvimento da Prova de Conceito com primeiros sprints de desenvolvimento e equipe completa.',
    targetDate: '2026-06-01',
    status: 'pendente',
    phaseId: 'phase-1',
    isCritical: false,
    departmentIds: ['tecnologia', 'pedagogico'],
  },
  {
    id: 'marco-06',
    title: 'PoC Entregue e Validada',
    description:
      'Prova de Conceito concluída, testada com escolas selecionadas e validada pelos stakeholders (SED/SC, professores, gestores).',
    targetDate: '2026-09-30',
    status: 'pendente',
    phaseId: 'phase-1',
    isCritical: true,
    departmentIds: ['tecnologia', 'pedagogico', 'santa_catarina'],
  },
  {
    id: 'marco-07',
    title: 'Início do Piloto Controlado',
    description:
      'Lançamento do piloto controlado em escolas selecionadas de SC com plataforma funcional e equipe de campo operante.',
    targetDate: '2026-10-01',
    status: 'pendente',
    phaseId: 'phase-2',
    isCritical: true,
    departmentIds: ['tecnologia', 'pedagogico', 'operacoes_locais'],
  },
  {
    id: 'marco-08',
    title: 'Relatório de Impacto do Piloto',
    description:
      'Publicação do relatório de impacto pedagógico do piloto controlado com dados quantitativos e qualitativos.',
    targetDate: '2027-05-31',
    status: 'pendente',
    phaseId: 'phase-2',
    isCritical: false,
    departmentIds: ['pedagogico', 'tecnologia'],
  },
  {
    id: 'marco-09',
    title: 'Transferência de Tecnologia Concluída',
    description:
      'Conclusão da transferência de tecnologia para SED/SC com documentação completa e equipe do estado capacitada.',
    targetDate: '2028-03-31',
    status: 'pendente',
    phaseId: 'phase-3',
    isCritical: true,
    departmentIds: ['tecnologia', 'santa_catarina', 'pedagogico'],
  },
  {
    id: 'milestone-estatuto-cartorio',
    title: 'Dar entrada no Estatuto no Cartório',
    description:
      'Protocolar o estatuto do Instituto i10 no cartório de registro civil de pessoas jurídicas para formalização legal',
    targetDate: '2026-03-26',
    status: 'pendente',
    phaseId: 'phase-0',
    isCritical: true,
    departmentIds: ['juridico'],
  },
  {
    id: 'milestone-etec-assinatura',
    title: 'Assinatura Contrato ETEC Fase 1 — SED/SC',
    description:
      'Assinatura formal da Encomenda Tecnológica com a Secretaria de Estado da Educação de Santa Catarina. Meta: último dia de abril de 2026.',
    targetDate: '2026-04-30',
    status: 'pendente',
    phaseId: 'phase-0',
    isCritical: true,
    departmentIds: ['juridico', 'santa_catarina', 'administrativo_financeiro'],
  },
  {
    id: 'milestone-escritorio-sapiens',
    title: 'Instalação do Escritório — Sapiens Park',
    description:
      'Escritório i10 operacional no Edifício Corporativo Softplan, Sapiens Park, Av. Luiz Boiteux Piazza, 1302, Canasvieiras, Florianópolis/SC',
    targetDate: '2026-04-01',
    status: 'em_andamento',
    phaseId: 'phase-0',
    isCritical: false,
    departmentIds: ['operacoes_locais', 'administrativo_financeiro'],
  },
  {
    id: 'milestone-portaria-comissao',
    title: 'Publicação da Portaria da Comissão Técnica — SED/SC',
    description:
      'Publicação da portaria que institui a Comissão de Planejamento da Solução e Contratação na SED/SC. Inicia o prazo de 45 dias úteis para as Fases A-D.',
    targetDate: '2026-04-05',
    status: 'pendente',
    phaseId: 'phase-0',
    isCritical: true,
    departmentIds: ['juridico', 'santa_catarina'],
  },
];

// ---------------------------------------------------------------------------
// Hiring Positions
// ---------------------------------------------------------------------------

export const hiring: HiringPosition[] = [
  {
    id: 'vaga-01',
    title: 'Gerente Pedagógico',
    departmentId: 'pedagogico',
    description:
      'Líder da área pedagógica responsável pelo alinhamento curricular BNCC, design instrucional, formação de professores e avaliação de impacto. Experiência em educação pública e tecnologia educacional.',
    status: 'aberta',
    priority: 'critica',
    openedAt: '2026-03-10',
    filledAt: null,
    filledBy: null,
    deadlineDate: '2026-04-30',
  },
  {
    id: 'vaga-02',
    title: 'Desenvolvedor(a) Full-Stack Sênior',
    departmentId: 'tecnologia',
    description:
      'Desenvolvedor(a) sênior para a plataforma educacional. Stack: TypeScript, React/Next.js, Node.js, PostgreSQL. Experiência com microsserviços e APIs RESTful.',
    status: 'aberta',
    priority: 'alta',
    openedAt: '2026-03-10',
    filledAt: null,
    filledBy: null,
    deadlineDate: '2026-05-15',
  },
  {
    id: 'vaga-03',
    title: 'Desenvolvedor(a) Full-Stack Pleno',
    departmentId: 'tecnologia',
    description:
      'Desenvolvedor(a) pleno para apoiar o desenvolvimento da plataforma. Conhecimento em React, Node.js e bancos relacionais.',
    status: 'aberta',
    priority: 'alta',
    openedAt: '2026-03-10',
    filledAt: null,
    filledBy: null,
    deadlineDate: '2026-05-31',
  },
  {
    id: 'vaga-04',
    title: 'Cientista de Dados / ML Engineer',
    departmentId: 'tecnologia',
    description:
      'Profissional para desenvolver modelos de IA para personalização de aprendizagem. Experiência com Python, TensorFlow/PyTorch, NLP e dados educacionais.',
    status: 'aberta',
    priority: 'media',
    openedAt: '2026-03-10',
    filledAt: null,
    filledBy: null,
    deadlineDate: '2026-06-30',
  },
  {
    id: 'vaga-05',
    title: 'Coordenador(a) de Campo - SC',
    departmentId: 'operacoes_locais',
    description:
      'Coordenador(a) baseado(a) em Florianópolis para gestão da equipe de campo, relação com escolas e logística de implantação.',
    status: 'aberta',
    priority: 'media',
    openedAt: '2026-03-10',
    filledAt: null,
    filledBy: null,
    deadlineDate: '2026-06-15',
  },
  {
    id: 'vaga-06',
    title: 'Analista de Dados Educacionais',
    departmentId: 'tecnologia',
    description:
      'Analista para processar e interpretar dados educacionais, criar dashboards e relatórios de acompanhamento para gestores e professores.',
    status: 'aberta',
    priority: 'media',
    openedAt: '2026-03-10',
    filledAt: null,
    filledBy: null,
    deadlineDate: '2026-07-15',
  },
];

// ---------------------------------------------------------------------------
// Countdown Targets
// ---------------------------------------------------------------------------

export const countdowns: CountdownTarget[] = [
  {
    id: 'countdown-estatuto',
    label: 'Entrada do Estatuto no Cartório',
    targetDate: '2026-03-26',
    isCritical: true,
    context:
      'Protocolar o estatuto do Instituto i10. Levar documentos de todos os fundadores.',
  },
  {
    id: 'countdown-assembleia',
    label: 'Primeira Assembleia',
    targetDate: '2026-04-05',
    isCritical: true,
    context:
      'Assembleia de fundação com todos os 7 fundadores. Depende do registro do estatuto.',
  },
  {
    id: 'countdown-cnpj',
    label: 'CNPJ Ativo',
    targetDate: '2026-04-10',
    isCritical: true,
    context:
      'CNPJ atualizado para operações financeiras, contratos e conta bancária.',
  },
  {
    id: 'countdown-etec-assinatura',
    label: 'Assinatura ETEC — SED/SC',
    targetDate: '2026-04-30',
    isCritical: true,
    context:
      'Meta de assinatura do contrato de Encomenda Tecnológica com a SED/SC.',
  },
  {
    id: 'countdown-contrato-etec',
    label: 'Assinatura Contrato ETEC (fallback)',
    targetDate: '2026-07-15',
    isCritical: true,
    context:
      'Prazo máximo para assinatura do contrato ETEC com o Estado de SC. Marco formal do projeto.',
  },
  {
    id: 'countdown-poc-inicio',
    label: 'Início da PoC',
    targetDate: '2026-06-01',
    isCritical: false,
    context:
      'Início do desenvolvimento da Prova de Conceito com equipe técnica completa.',
  },
  {
    id: 'countdown-poc-entrega',
    label: 'Entrega da PoC',
    targetDate: '2026-09-30',
    isCritical: true,
    context:
      'PoC concluída e validada. Decisão go/no-go para o piloto controlado.',
  },
  {
    id: 'countdown-piloto',
    label: 'Início do Piloto Controlado',
    targetDate: '2026-10-01',
    isCritical: true,
    context:
      'Lançamento do piloto em escolas selecionadas de SC.',
  },
];

// ---------------------------------------------------------------------------
// Aggregate: ProjectData
// ---------------------------------------------------------------------------

export const projectData: ProjectData = {
  phases,
  departments,
  tasks,
  people,
  companies,
  milestones,
  hiring,
  countdowns,
};

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Compute days remaining until a target date from a reference date.
 * Returns negative values for past dates.
 */
export function daysUntil(targetDate: string, from: Date = new Date()): number {
  const target = new Date(targetDate + 'T00:00:00');
  const diff = target.getTime() - from.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Get tasks for a specific department.
 */
export function getTasksByDepartment(departmentId: string): Task[] {
  return tasks.filter((t) => t.departmentId === departmentId);
}

/**
 * Get tasks assigned to a specific person.
 */
export function getTasksByAssignee(personId: string): Task[] {
  return tasks.filter((t) => t.assigneeIds.includes(personId));
}

/**
 * Get tasks for a specific phase.
 */
export function getTasksByPhase(phaseId: string): Task[] {
  return tasks.filter((t) => t.phaseId === phaseId);
}

/**
 * Get overdue tasks (past due date, not completed).
 */
export function getOverdueTasks(referenceDate: Date = new Date()): Task[] {
  return tasks.filter((t) => {
    if (!t.dueDate || t.status === 'concluida' || t.status === 'cancelada') {
      return false;
    }
    return new Date(t.dueDate + 'T23:59:59') < referenceDate;
  });
}

/**
 * Get critical tasks (priority = critica and not done).
 */
export function getCriticalTasks(): Task[] {
  return tasks.filter(
    (t) => t.priority === 'critica' && t.status !== 'concluida' && t.status !== 'cancelada'
  );
}

/**
 * Get the currently active phase.
 */
export function getActivePhase(): Phase | null {
  return phases.find((p) => p.status === 'em_andamento') ?? null;
}

/**
 * Get the next upcoming milestone that is not yet completed.
 */
export function getNextMilestone(referenceDate: Date = new Date()): Milestone | null {
  const upcoming = milestones
    .filter((m) => m.status !== 'concluido')
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());

  return upcoming.length > 0 ? upcoming[0] : null;
}

/**
 * Compute overall project progress based on phase weights and completion.
 */
export function computeOverallProgress(): number {
  const totalBudget = phases.reduce((sum, p) => sum + (p.budgetBRL ?? 0), 0);
  if (totalBudget === 0) {
    // Fallback: equal weight per phase
    const avg = phases.reduce((sum, p) => sum + p.progress, 0) / phases.length;
    return Math.round(avg);
  }
  const weighted = phases.reduce((sum, p) => {
    const weight = (p.budgetBRL ?? 0) / totalBudget;
    return sum + p.progress * weight;
  }, 0);
  return Math.round(weighted);
}

/**
 * Build a complete dashboard summary.
 */
export function getDashboardSummary(referenceDate: Date = new Date()): DashboardSummary {
  const overdue = getOverdueTasks(referenceDate);
  const critical = getCriticalTasks();
  const completed = tasks.filter((t) => t.status === 'concluida');
  const activePhase = getActivePhase();
  const nextMilestone = getNextMilestone(referenceDate);

  return {
    totalTasks: tasks.length,
    completedTasks: completed.length,
    overdueTasks: overdue.length,
    criticalTasks: critical.length,
    activePhase,
    nextMilestone,
    daysUntilNextMilestone: nextMilestone
      ? daysUntil(nextMilestone.targetDate, referenceDate)
      : null,
    overallProgress: computeOverallProgress(),
  };
}

/**
 * Get department progress as a percentage based on its tasks.
 */
export function getDepartmentProgress(departmentId: string): number {
  const deptTasks = getTasksByDepartment(departmentId);
  if (deptTasks.length === 0) return 0;
  const avg = deptTasks.reduce((sum, t) => sum + t.progress, 0) / deptTasks.length;
  return Math.round(avg);
}

/**
 * Get a person by their ID.
 */
export function getPersonById(id: string): Person | undefined {
  return people.find((p) => p.id === id);
}

/**
 * Get all founders (for assembleia view).
 */
export function getFounders(): Person[] {
  return people.filter((p) => p.role === 'fundador');
}

/**
 * Get all advisory invitees.
 */
export function getAdvisoryInvitees(): Person[] {
  return people.filter((p) => p.role === 'convidado');
}

/**
 * Get countdown targets sorted by date (nearest first).
 */
export function getSortedCountdowns(): CountdownTarget[] {
  return [...countdowns].sort(
    (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );
}

/**
 * Get tasks grouped by status for kanban-style views.
 */
export function getTasksByStatus(): Record<string, Task[]> {
  const grouped: Record<string, Task[]> = {
    nao_iniciada: [],
    em_andamento: [],
    concluida: [],
    bloqueada: [],
    atrasada: [],
    cancelada: [],
  };
  for (const task of tasks) {
    grouped[task.status].push(task);
  }
  return grouped;
}

/**
 * Get phase timeline data for chart rendering.
 */
export function getPhaseTimeline(): Array<{
  id: string;
  title: string;
  number: number;
  startDate: string;
  endDate: string;
  progress: number;
  status: string;
  durationDays: number;
}> {
  return phases.map((p) => {
    const start = new Date(p.startDate);
    const end = new Date(p.endDate);
    const durationDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      id: p.id,
      title: p.title,
      number: p.number,
      startDate: p.startDate,
      endDate: p.endDate,
      progress: p.progress,
      status: p.status,
      durationDays,
    };
  });
}
