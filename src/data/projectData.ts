// =============================================================================
// IBEF Project Control - Project Data
// Instituto Brasileiro pela Educacao do Futuro
// Encomenda Tecnologica (ETEC) - Santa Catarina
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
    title: 'Alinhamento e Imersao',
    description:
      'Fase preparatoria de alinhamento institucional, formalizacao juridica do IBEF, imersao no contexto educacional de Santa Catarina e preparacao da estrutura organizacional para a Encomenda Tecnologica.',
    status: 'em_andamento',
    startDate: '2026-04-01',
    endDate: '2026-05-31',
    progress: 15,
    deliverables: [
      'Registro do Estatuto do IBEF',
      'CNPJ atualizado e regular',
      'Primeira Assembleia de fundacao realizada',
      'Mapeamento de stakeholders SED/SC',
      'Diagnostico inicial da infraestrutura educacional SC',
      'Contrato de parceria com provedores tecnologicos',
      'Plano de trabalho detalhado para PoC',
    ],
    budgetBRL: 150000,
  },
  {
    id: 'phase-1',
    number: 1,
    title: 'Prova de Conceito - PoC',
    description:
      'Desenvolvimento e validacao da prova de conceito da plataforma educacional, incluindo integracao com sistemas legados de SC, modelos de IA para personalizacao e primeiros testes com escolas selecionadas.',
    status: 'planejada',
    startDate: '2026-05-01',
    endDate: '2026-09-30',
    progress: 0,
    deliverables: [
      'Arquitetura da plataforma definida e documentada',
      'APIs de integracao com sistemas SED/SC mapeadas',
      'Prototipo funcional da plataforma',
      'Modelo de IA treinado com dados curriculares BNCC',
      'Relatorio de validacao da PoC com metricas',
      'Feedback de professores e gestores piloto',
    ],
    budgetBRL: 800000,
  },
  {
    id: 'phase-2',
    number: 2,
    title: 'Piloto Controlado',
    description:
      'Implantacao piloto em escolas selecionadas de Santa Catarina com monitoramento rigoroso de resultados, ajustes iterativos e preparacao para escalabilidade.',
    status: 'planejada',
    startDate: '2026-10-01',
    endDate: '2027-06-30',
    progress: 0,
    deliverables: [
      'Plataforma implantada em escolas piloto',
      'Programa de capacitacao de professores executado',
      'Dados de aprendizagem coletados e analisados',
      'Relatorio de impacto pedagogico',
      'Ajustes na plataforma baseados em feedback',
      'Plano de escalabilidade validado',
    ],
    budgetBRL: 2500000,
  },
  {
    id: 'phase-3',
    number: 3,
    title: 'Validacao e Transferencia',
    description:
      'Validacao final dos resultados, documentacao completa da solucao, transferencia de tecnologia para SED/SC e preparacao para expansao estadual.',
    status: 'planejada',
    startDate: '2027-07-01',
    endDate: '2028-03-31',
    progress: 0,
    deliverables: [
      'Relatorio final de validacao com evidencias',
      'Documentacao tecnica completa da plataforma',
      'Transferencia de tecnologia para SED/SC',
      'Manual de operacao e manutencao',
      'Plano de expansao estadual aprovado',
      'Relatorio de prestacao de contas ao TCU',
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
    role: 'fundador',
    title: 'Project Leader / Diretor Executivo Presidente',
    departmentIds: ['tecnologia', 'administrativo_financeiro'],
    email: null,
    notes:
      'Lider geral do projeto ETEC. Responsavel pela visao estrategica, relacao com SED/SC e coordenacao entre todas as areas.',
    avatarUrl: null,
    assembleiaConfirmed: true,
  },
  {
    id: 'pessoa-bruno-almeida',
    name: 'Bruno Almeida',
    role: 'fundador',
    title: 'Gerencia de Tecnologia',
    departmentIds: ['tecnologia'],
    email: null,
    notes:
      'Lider tecnico responsavel pela arquitetura da plataforma, integracoes e equipe de desenvolvimento.',
    avatarUrl: null,
    assembleiaConfirmed: true,
  },
  {
    id: 'pessoa-bruno-quick',
    name: 'Bruno Quick',
    role: 'fundador',
    title: 'Relacoes Publicas e Parcerias Governamentais',
    departmentIds: ['relacoes_publicas'],
    email: null,
    notes:
      'Responsavel pelas relacoes com governo de SC, articulacao politica e comunicacao institucional.',
    avatarUrl: null,
    assembleiaConfirmed: true,
  },
  {
    id: 'pessoa-mercia',
    name: 'Mercia',
    role: 'fundador',
    title: 'Assessoria Juridica (co-lider)',
    departmentIds: ['juridico'],
    email: null,
    notes:
      'Co-lider juridica. Responsavel pelo registro do estatuto, conformidade legal e contratos de parceria.',
    avatarUrl: null,
    assembleiaConfirmed: true,
  },
  {
    id: 'pessoa-emerson',
    name: 'Emerson',
    role: 'fundador',
    title: 'Assessoria Juridica (co-lider)',
    departmentIds: ['juridico'],
    email: null,
    notes:
      'Co-lider juridico. Atua junto com Mercia na estruturacao juridica do IBEF e conformidade regulatoria.',
    avatarUrl: null,
    assembleiaConfirmed: true,
  },
  {
    id: 'pessoa-gustavo',
    name: 'Gustavo',
    role: 'fundador',
    title: 'Operacoes e Provedores Locais',
    departmentIds: ['operacoes_locais'],
    email: null,
    notes:
      'Responsavel pela operacao em Santa Catarina, rede de provedores locais e logistica de campo.',
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
      'Co-lider da area administrativa e financeira. Planejamento orcamentario e compliance.',
    avatarUrl: null,
    assembleiaConfirmed: true,
  },

  // --- Convidados (Advisory / Executive Board - a definir) ---
  {
    id: 'pessoa-daniel-aguado',
    name: 'Daniel Aguado',
    role: 'convidado',
    title: 'Marketing Director - FDC (Fundacao Dom Cabral)',
    departmentIds: [],
    email: null,
    notes:
      'Diretor de Marketing na FDC. Potencial membro do conselho consultivo para estrategia de posicionamento e relacionamento institucional.',
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
      'Diretor Geral da FAAP. Potencial conselheiro com experiencia em gestao de instituicoes de ensino superior.',
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
      'Empreendedor no segmento de educacao basica (K12). Experiencia pratica com escolas e mercado educacional.',
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
      'Experiencia no Ministerio da Educacao e no FUNDEB. Conhecimento profundo de politicas publicas educacionais e financiamento.',
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
    name: 'Juridico',
    description:
      'Assessoria juridica responsavel pela formalizacao do IBEF, contratos, conformidade regulatoria e LGPD.',
    leadIds: ['pessoa-mercia', 'pessoa-emerson'],
    color: '#6366F1',
    icon: 'Scale',
    taskIds: [
      'task-jur-01',
      'task-jur-02',
      'task-jur-03',
      'task-jur-04',
      'task-jur-05',
    ],
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia',
    description:
      'Desenvolvimento da plataforma educacional, integracoes com sistemas legados, IA e infraestrutura tecnica.',
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
    ],
  },
  {
    id: 'relacoes_publicas',
    name: 'Relacoes Publicas e Parcerias',
    description:
      'Relacoes governamentais, comunicacao institucional, parcerias estrategicas e articulacao politica com SC.',
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
    name: 'Operacoes Locais',
    description:
      'Operacao em campo em Santa Catarina, rede de provedores, escritorio local e coordenacao de equipes.',
    leadIds: ['pessoa-gustavo'],
    color: '#EF4444',
    icon: 'MapPin',
    taskIds: [
      'task-ops-01',
      'task-ops-02',
      'task-ops-03',
      'task-ops-04',
    ],
  },
  {
    id: 'santa_catarina',
    name: 'Santa Catarina (SED/SC)',
    description:
      'Acompanhamento das acoes que a Secretaria de Educacao de SC (SED/SC) precisa executar para viabilizar a ETEC. Segue diretrizes do TCU e Guia InovaGovSC.',
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
    ],
  },
  {
    id: 'pedagogico',
    name: 'Pedagogico',
    description:
      'Alinhamento curricular BNCC, design do programa de formacao de professores, criterios de selecao de escolas piloto.',
    leadIds: [],
    color: '#EC4899',
    icon: 'GraduationCap',
    taskIds: [
      'task-ped-01',
      'task-ped-02',
      'task-ped-03',
      'task-ped-04',
    ],
  },
  {
    id: 'administrativo_financeiro',
    name: 'Administrativo e Financeiro',
    description:
      'Planejamento financeiro, alocacao orcamentaria por fase, compliance e prestacao de contas.',
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
    title: 'Registrar Estatuto do IBEF',
    description:
      'Finalizar e protocolar o estatuto social do IBEF no cartorio competente. Prazo critico: quarta-feira 18/03/2026. Necessario para existencia juridica da organizacao.',
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
      'URGENTE - Prazo iminente. Sem o registro do estatuto, o IBEF nao existe juridicamente e nenhuma outra acao formal pode prosseguir. Bloqueia CNPJ, assembleia e contratos.',
    progress: 60,
    tags: ['urgente', 'bloqueante', 'fundacao'],
  },
  {
    id: 'task-jur-02',
    title: 'Registrar IBEF em Santa Catarina',
    description:
      'Efetuar o registro do IBEF junto aos orgaos competentes do estado de Santa Catarina para operacao local.',
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
      'Depende do registro do estatuto. Necessario para operar formalmente em SC e firmar contratos com o governo estadual.',
    progress: 0,
    tags: ['fundacao', 'sc'],
  },
  {
    id: 'task-jur-03',
    title: 'Atualizar CNPJ',
    description:
      'Obter ou atualizar o CNPJ do IBEF junto a Receita Federal com as informacoes do novo estatuto.',
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
      'Depende do registro do estatuto. CNPJ necessario para abertura de conta bancaria, contratos e notas fiscais.',
    progress: 0,
    tags: ['fundacao', 'bloqueante'],
  },
  {
    id: 'task-jur-04',
    title: 'Elaborar contratos de parceria',
    description:
      'Preparar minutas de contratos de parceria com empresas associadas (Jinso, Sprix, MadeinWEB, Gestorial) e eventuais termos de cooperacao com SED/SC.',
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
      'Contratos devem prever termos de propriedade intelectual, confidencialidade e escopo de atuacao de cada parceiro.',
    progress: 0,
    tags: ['contratos', 'parcerias'],
  },
  {
    id: 'task-jur-05',
    title: 'Preparacao de conformidade LGPD',
    description:
      'Desenvolver politica de privacidade, termos de uso e procedimentos de tratamento de dados pessoais conforme a LGPD, especialmente para dados de alunos menores.',
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
      'Critico para a plataforma educacional que lidara com dados de menores de idade. Deve estar pronto antes do inicio da PoC com escolas.',
    progress: 0,
    tags: ['lgpd', 'compliance', 'dados'],
  },

  // =========================================================================
  // TECNOLOGIA
  // =========================================================================
  {
    id: 'task-tech-01',
    title: 'Definir arquitetura de integracao da plataforma',
    description:
      'Projetar a arquitetura tecnica da plataforma educacional, incluindo microsservicos, banco de dados, APIs e pontos de integracao com sistemas existentes da SED/SC.',
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
      'Deve considerar sistemas legados de SC (SISGESC, Professor Online, etc). Arquitetura precisa ser escalavel para expansao estadual.',
    progress: 25,
    tags: ['arquitetura', 'integracao', 'plataforma'],
  },
  {
    id: 'task-tech-02',
    title: 'Mapeamento de APIs de sistemas legados SC',
    description:
      'Identificar e documentar todas as APIs disponiveis dos sistemas educacionais de Santa Catarina (SISGESC, SIGEF, Professor Online, entre outros).',
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
      'Depende de acesso concedido pela SED/SC. Bruno Quick esta articulando junto ao governo.',
    progress: 10,
    tags: ['apis', 'legado', 'sc', 'integracao'],
  },
  {
    id: 'task-tech-03',
    title: 'Desenvolvimento da PoC',
    description:
      'Construir a prova de conceito da plataforma educacional com funcionalidades core: gestao de conteudo alinhado a BNCC, dashboard do professor e modulo de aprendizagem adaptativa.',
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
      'PoC deve demonstrar valor suficiente para justificar o investimento completo no piloto. Meta: 3 escolas testando ate setembro/2026.',
    progress: 0,
    tags: ['poc', 'desenvolvimento', 'plataforma'],
  },
  {
    id: 'task-tech-04',
    title: 'Treinamento de modelos de IA',
    description:
      'Desenvolver e treinar modelos de inteligencia artificial para personalizacao de aprendizagem, identificacao de gaps de conhecimento e recomendacao de conteudo baseado na BNCC.',
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
      'Depende do alinhamento curricular BNCC do time pedagogico. Modelos iniciais podem usar dados sinteticos ate dados reais estarem disponiveis.',
    progress: 0,
    tags: ['ia', 'machine-learning', 'bncc', 'personalizacao'],
  },
  {
    id: 'task-tech-05',
    title: 'Setup de infraestrutura cloud e CI/CD',
    description:
      'Configurar ambiente de nuvem (AWS/GCP), pipelines de CI/CD, monitoramento, logs e ambientes de desenvolvimento, staging e producao.',
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
      'Deve considerar requisitos de soberania de dados (dados educacionais brasileiros). Verificar se ha exigencia de datacenter nacional.',
    progress: 0,
    tags: ['infraestrutura', 'devops', 'cloud'],
  },
  {
    id: 'task-tech-06',
    title: 'Definir stack tecnologico e padroes',
    description:
      'Documentar decisoes de stack (linguagens, frameworks, banco de dados), padroes de codigo, guidelines de contribuicao e ferramentas de desenvolvimento.',
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
      'Alinhamento com parceiros tecnologicos (Jinso, Sprix, MadeinWEB) sobre capacidades e preferencias tecnicas.',
    progress: 30,
    tags: ['stack', 'padroes', 'documentacao'],
  },

  // =========================================================================
  // RELACOES PUBLICAS E PARCERIAS
  // =========================================================================
  {
    id: 'task-rp-01',
    title: 'Articulacao com governo de SC',
    description:
      'Manter e aprofundar o relacionamento com a SED/SC, Gabinete do Governador e demais orgaos relevantes para viabilizar a ETEC.',
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
      'Atividade continua. Fundamental para o sucesso do projeto. Inclui reunioes periodicas, alinhamento de expectativas e suporte politico.',
    progress: 30,
    tags: ['governo', 'sc', 'relacionamento'],
  },
  {
    id: 'task-rp-02',
    title: 'Comunicacao com stakeholders',
    description:
      'Desenvolver estrategia de comunicacao institucional e manter stakeholders informados sobre progresso do projeto ETEC.',
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
      'Inclui newsletter mensal, relatorios de progresso para investidores e comunicacao com comunidade educacional.',
    progress: 0,
    tags: ['comunicacao', 'stakeholders'],
  },
  {
    id: 'task-rp-03',
    title: 'Acordos de parceria publica',
    description:
      'Negociar e formalizar acordos de parceria publica com orgaos governamentais de SC, incluindo termos de cooperacao tecnica.',
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
      'Depende da existencia juridica do IBEF (estatuto registrado e IBEF registrado em SC).',
    progress: 0,
    tags: ['parcerias', 'governo', 'acordos'],
  },
  {
    id: 'task-rp-04',
    title: 'Convite e engajamento do conselho consultivo',
    description:
      'Formalizar convites para Daniel Aguado (FDC), Franco (FAAP), Daniel Mendes e Mariza (ex-MEC) para o conselho consultivo do IBEF.',
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
      'Convites devem ser formalizados apos registro do estatuto. Preparar material institucional e proposta de valor para cada convidado.',
    progress: 0,
    tags: ['conselho', 'advisory', 'convites'],
  },

  // =========================================================================
  // OPERACOES LOCAIS
  // =========================================================================
  {
    id: 'task-ops-01',
    title: 'Estruturar rede de provedores locais',
    description:
      'Mapear, avaliar e contratar provedores de servicos locais em SC (internet, hardware, suporte tecnico) para suportar a implantacao nas escolas.',
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
      'Considerar cobertura geografica de SC, diversidade de regioes (litoral, serra, oeste) e diferentes necessidades de infraestrutura.',
    progress: 0,
    tags: ['provedores', 'infraestrutura', 'sc'],
  },
  {
    id: 'task-ops-02',
    title: 'Montar escritorio em SC',
    description:
      'Identificar local, negociar aluguel e montar escritorio operacional em Florianopolis para a equipe de campo do IBEF.',
    status: 'nao_iniciada',
    priority: 'media',
    departmentId: 'operacoes_locais',
    assigneeIds: ['pessoa-gustavo'],
    dueDate: '2026-05-31',
    createdAt: '2026-03-01',
    completedAt: null,
    phaseId: 'phase-0',
    dependencies: ['task-jur-03'],
    notes:
      'Depende do CNPJ para contrato de aluguel. Considerar coworking como opcao temporaria.',
    progress: 0,
    tags: ['escritorio', 'florianopolis', 'infraestrutura'],
  },
  {
    id: 'task-ops-03',
    title: 'Coordenacao de equipe de campo',
    description:
      'Definir processos de coordenacao para equipe de campo que atuara nas escolas piloto, incluindo logistica, comunicacao e relatorios.',
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
      'Processos devem estar prontos antes do inicio do piloto controlado em outubro/2026.',
    progress: 0,
    tags: ['equipe', 'campo', 'processos'],
  },
  {
    id: 'task-ops-04',
    title: 'Levantamento de infraestrutura escolar',
    description:
      'Realizar diagnostico da infraestrutura tecnologica (internet, equipamentos, rede eletrica) das escolas candidatas ao piloto em SC.',
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
      'Trabalho conjunto com SED/SC para acesso as escolas. Resultado alimenta criterios de selecao do time pedagogico.',
    progress: 0,
    tags: ['diagnostico', 'escolas', 'infraestrutura'],
  },

  // =========================================================================
  // SANTA CATARINA (SED/SC) - Acoes que o governo deve executar
  // =========================================================================
  {
    id: 'task-sc-01',
    title: 'Concluir documento de Planejamento e Diagnostico',
    description:
      'SED/SC deve elaborar o documento de Planejamento e Diagnostico que justifica a necessidade da ETEC, conforme diretrizes do TCU e Guia InovaGovSC.',
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
      'Documento fundamental conforme TCU. Deve conter analise do problema, justificativa da ETEC vs. outras modalidades de contratacao, e diagnostico da situacao atual.',
    progress: 40,
    tags: ['sed', 'tcu', 'inovagovsc', 'documento'],
  },
  {
    id: 'task-sc-02',
    title: 'Concluir ETP (Estudo Tecnico Preliminar)',
    description:
      'SED/SC deve elaborar o Estudo Tecnico Preliminar detalhando viabilidade tecnica e economica da ETEC.',
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
      'Conforme Guia InovaGovSC. Deve incluir analise de risco tecnologico, estimativa de custos e cronograma preliminar.',
    progress: 0,
    tags: ['sed', 'etp', 'inovagovsc'],
  },
  {
    id: 'task-sc-03',
    title: 'Publicar Portaria criando comissao ETEC',
    description:
      'Governo de SC deve publicar Portaria oficial criando a comissao responsavel pela conducao do processo de ETEC.',
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
      'Portaria deve designar membros da comissao com representantes da SED, CIASC e areas tecnicas do governo.',
    progress: 0,
    tags: ['sed', 'portaria', 'comissao'],
  },
  {
    id: 'task-sc-04',
    title: 'Elaborar Termo de Referencia',
    description:
      'Comissao ETEC deve elaborar o Termo de Referencia com especificacoes tecnicas, criterios de selecao da ICT e metricas de avaliacao.',
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
      'Deve definir claramente: problema a ser resolvido, requisitos tecnicos, marcos contratuais, propriedade intelectual e metricas de sucesso.',
    progress: 0,
    tags: ['sed', 'termo-referencia', 'especificacoes'],
  },
  {
    id: 'task-sc-05',
    title: 'Submeter a PGE/SC para parecer juridico',
    description:
      'Encaminhar toda a documentacao para a Procuradoria Geral do Estado de SC para parecer juridico sobre a legalidade e conformidade do processo.',
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
      'PGE deve atestar legalidade do processo. Tempo medio de parecer: 15-30 dias. Pode haver pedidos de esclarecimento.',
    progress: 0,
    tags: ['sed', 'pge', 'parecer-juridico'],
  },
  {
    id: 'task-sc-06',
    title: 'Publicar Chamamento / Selecao de ICT',
    description:
      'Publicar edital de chamamento publico ou processo de selecao para escolha da Instituicao Cientifica e Tecnologica (ICT) que executara a ETEC.',
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
      'Conforme Lei de Inovacao e regulamentacao estadual. IBEF deve estar preparado para apresentar proposta tecnica e financeira.',
    progress: 0,
    tags: ['sed', 'chamamento', 'ict', 'selecao'],
  },
  {
    id: 'task-sc-07',
    title: 'Assinar contrato ETEC',
    description:
      'Assinatura formal do contrato de Encomenda Tecnologica entre o Estado de Santa Catarina e a ICT selecionada.',
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
      'Marco fundamental do projeto. Apos assinatura, inicia-se oficialmente a execucao da ETEC com recursos do estado.',
    progress: 0,
    tags: ['sed', 'contrato', 'etec', 'marco'],
  },

  // =========================================================================
  // PEDAGOGICO
  // =========================================================================
  {
    id: 'task-ped-01',
    title: 'Alinhamento curricular BNCC',
    description:
      'Mapear competencias e habilidades da BNCC relevantes para a plataforma, organizando a estrutura curricular que sera base para o conteudo e a IA.',
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
      'Priorizar Ensino Fundamental II e Ensino Medio para a PoC. Considerar curriculo de SC (Curriculo Base do Territorio Catarinense).',
    progress: 0,
    tags: ['bncc', 'curriculo', 'conteudo'],
  },
  {
    id: 'task-ped-02',
    title: 'Design do programa de formacao de professores',
    description:
      'Projetar programa de capacitacao para professores que utilizarao a plataforma, incluindo modulos online e presenciais.',
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
      'Formacao deve cobrir: uso da plataforma, metodologias ativas, interpretacao de dados de aprendizagem e personalicao do ensino.',
    progress: 0,
    tags: ['formacao', 'professores', 'capacitacao'],
  },
  {
    id: 'task-ped-03',
    title: 'Definir criterios de selecao de escolas piloto',
    description:
      'Estabelecer criterios objetivos para selecao das escolas que participarao do piloto controlado, considerando diversidade e representatividade.',
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
      'Criterios: infraestrutura minima, engajamento da gestao escolar, diversidade regional (litoral/serra/oeste), diferentes portes de escola.',
    progress: 0,
    tags: ['escolas', 'piloto', 'selecao', 'criterios'],
  },
  {
    id: 'task-ped-04',
    title: 'Elaborar framework de avaliacao de impacto',
    description:
      'Definir metricas, indicadores e metodologia para medir o impacto pedagogico da plataforma nos resultados de aprendizagem.',
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
      'Deve incluir: metricas quantitativas (notas, frequencia, engajamento), qualitativas (percepcao de professores/alunos) e grupo de controle.',
    progress: 0,
    tags: ['avaliacao', 'impacto', 'metricas'],
  },

  // =========================================================================
  // ADMINISTRATIVO E FINANCEIRO
  // =========================================================================
  {
    id: 'task-adm-01',
    title: 'Planejamento financeiro geral',
    description:
      'Elaborar planejamento financeiro completo do projeto ETEC incluindo projecoes de receita, custos operacionais e fluxo de caixa para 24 meses.',
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
      'Depende do CNPJ para abertura de conta bancaria. Orcamento total estimado: R$ 4.65M ao longo de 24 meses.',
    progress: 0,
    tags: ['financeiro', 'planejamento', 'orcamento'],
  },
  {
    id: 'task-adm-02',
    title: 'Alocacao orcamentaria por fase',
    description:
      'Detalhar a alocacao orcamentaria para cada fase do projeto, com rubricas especificas e reserva de contingencia.',
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
      'Fase 0: R$150k | Fase 1: R$800k | Fase 2: R$2.5M | Fase 3: R$1.2M. Incluir 10% de contingencia em cada fase.',
    progress: 0,
    tags: ['orcamento', 'fases', 'alocacao'],
  },
  {
    id: 'task-adm-03',
    title: 'Setup de compliance e prestacao de contas',
    description:
      'Implementar processos e sistemas para compliance com regras de licitacao publica, prestacao de contas ao TCU e transparencia.',
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
      'Essencial para contrato com governo. Deve atender requisitos de transparencia, auditabilidade e prestacao de contas periodica.',
    progress: 0,
    tags: ['compliance', 'tcu', 'transparencia', 'prestacao-contas'],
  },
  {
    id: 'task-adm-04',
    title: 'Abertura de conta bancaria institucional',
    description:
      'Abrir conta bancaria em nome do IBEF para movimentacao de recursos do projeto.',
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
      'Depende do CNPJ atualizado. Priorizar banco com experiencia em contas de organizacoes do terceiro setor.',
    progress: 0,
    tags: ['banco', 'conta', 'financeiro'],
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
      'Parceiro tecnologico para desenvolvimento de plataformas digitais e solucoes de engenharia de software.',
    contactPerson: null,
    website: null,
    departmentIds: ['tecnologia'],
  },
  {
    id: 'empresa-sprix',
    name: 'Sprix',
    type: 'tech',
    description:
      'Parceiro tecnologico com expertise em solucoes educacionais e tecnologias de aprendizagem.',
    contactPerson: null,
    website: null,
    departmentIds: ['tecnologia'],
  },
  {
    id: 'empresa-madeinweb',
    name: 'MadeinWEB',
    type: 'tech',
    description:
      'Parceiro tecnologico especializado em desenvolvimento web, aplicativos e solucoes digitais.',
    contactPerson: null,
    website: null,
    departmentIds: ['tecnologia'],
  },
  {
    id: 'empresa-gestorial',
    name: 'Gestorial',
    type: 'administrative',
    description:
      'Parceiro de servicos administrativos e contabeis. Responsavel pelo suporte contabil e fiscal do IBEF.',
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
    title: 'Registro do Estatuto do IBEF',
    description:
      'Registro formal do estatuto social do IBEF em cartorio. Prazo critico e inegociavel - sem este registro, a organizacao nao existe juridicamente.',
    targetDate: '2026-03-18',
    status: 'em_andamento',
    phaseId: 'phase-0',
    isCritical: true,
    departmentIds: ['juridico'],
  },
  {
    id: 'marco-02',
    title: 'Primeira Assembleia de Fundacao',
    description:
      'Assembleia geral de fundacao do IBEF com todos os fundadores. Formaliza a criacao da organizacao, elege a diretoria e aprova o plano de trabalho.',
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
      'CNPJ do IBEF atualizado e regular na Receita Federal, habilitando a organizacao para operacoes financeiras e contratos.',
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
      'Assinatura formal do contrato de Encomenda Tecnologica entre o Estado de Santa Catarina e o IBEF / consorcio ICT.',
    targetDate: '2026-07-15',
    status: 'pendente',
    phaseId: 'phase-0',
    isCritical: true,
    departmentIds: ['santa_catarina', 'juridico', 'relacoes_publicas'],
  },
  {
    id: 'marco-05',
    title: 'Inicio da PoC',
    description:
      'Inicio oficial do desenvolvimento da Prova de Conceito com primeiros sprints de desenvolvimento e equipe completa.',
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
      'Prova de Conceito concluida, testada com escolas selecionadas e validada pelos stakeholders (SED/SC, professores, gestores).',
    targetDate: '2026-09-30',
    status: 'pendente',
    phaseId: 'phase-1',
    isCritical: true,
    departmentIds: ['tecnologia', 'pedagogico', 'santa_catarina'],
  },
  {
    id: 'marco-07',
    title: 'Inicio do Piloto Controlado',
    description:
      'Lancamento do piloto controlado em escolas selecionadas de SC com plataforma funcional e equipe de campo operante.',
    targetDate: '2026-10-01',
    status: 'pendente',
    phaseId: 'phase-2',
    isCritical: true,
    departmentIds: ['tecnologia', 'pedagogico', 'operacoes_locais'],
  },
  {
    id: 'marco-08',
    title: 'Relatorio de Impacto do Piloto',
    description:
      'Publicacao do relatorio de impacto pedagogico do piloto controlado com dados quantitativos e qualitativos.',
    targetDate: '2027-05-31',
    status: 'pendente',
    phaseId: 'phase-2',
    isCritical: false,
    departmentIds: ['pedagogico', 'tecnologia'],
  },
  {
    id: 'marco-09',
    title: 'Transferencia de Tecnologia Concluida',
    description:
      'Conclusao da transferencia de tecnologia para SED/SC com documentacao completa e equipe do estado capacitada.',
    targetDate: '2028-03-31',
    status: 'pendente',
    phaseId: 'phase-3',
    isCritical: true,
    departmentIds: ['tecnologia', 'santa_catarina', 'pedagogico'],
  },
];

// ---------------------------------------------------------------------------
// Hiring Positions
// ---------------------------------------------------------------------------

export const hiring: HiringPosition[] = [
  {
    id: 'vaga-01',
    title: 'Gerente Pedagogico',
    departmentId: 'pedagogico',
    description:
      'Lider da area pedagogica responsavel pelo alinhamento curricular BNCC, design instrucional, formacao de professores e avaliacao de impacto. Experiencia em educacao publica e tecnologia educacional.',
    status: 'aberta',
    priority: 'critica',
    openedAt: '2026-03-10',
    filledAt: null,
    filledBy: null,
  },
  {
    id: 'vaga-02',
    title: 'Desenvolvedor(a) Full-Stack Senior',
    departmentId: 'tecnologia',
    description:
      'Desenvolvedor(a) senior para a plataforma educacional. Stack: TypeScript, React/Next.js, Node.js, PostgreSQL. Experiencia com microsservicos e APIs RESTful.',
    status: 'aberta',
    priority: 'alta',
    openedAt: '2026-03-10',
    filledAt: null,
    filledBy: null,
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
  },
  {
    id: 'vaga-04',
    title: 'Cientista de Dados / ML Engineer',
    departmentId: 'tecnologia',
    description:
      'Profissional para desenvolver modelos de IA para personalizacao de aprendizagem. Experiencia com Python, TensorFlow/PyTorch, NLP e dados educacionais.',
    status: 'aberta',
    priority: 'media',
    openedAt: '2026-03-10',
    filledAt: null,
    filledBy: null,
  },
  {
    id: 'vaga-05',
    title: 'Coordenador(a) de Campo - SC',
    departmentId: 'operacoes_locais',
    description:
      'Coordenador(a) baseado(a) em Florianopolis para gestao da equipe de campo, relacao com escolas e logistica de implantacao.',
    status: 'aberta',
    priority: 'media',
    openedAt: '2026-03-10',
    filledAt: null,
    filledBy: null,
  },
  {
    id: 'vaga-06',
    title: 'Analista de Dados Educacionais',
    departmentId: 'tecnologia',
    description:
      'Analista para processar e interpretar dados educacionais, criar dashboards e relatorios de acompanhamento para gestores e professores.',
    status: 'aberta',
    priority: 'media',
    openedAt: '2026-03-10',
    filledAt: null,
    filledBy: null,
  },
];

// ---------------------------------------------------------------------------
// Countdown Targets
// ---------------------------------------------------------------------------

export const countdowns: CountdownTarget[] = [
  {
    id: 'countdown-estatuto',
    label: 'Registro do Estatuto',
    targetDate: '2026-03-18',
    isCritical: true,
    context:
      'Prazo CRITICO - Quarta-feira. Sem registro, IBEF nao existe juridicamente. Bloqueia todas as demais acoes.',
  },
  {
    id: 'countdown-assembleia',
    label: 'Primeira Assembleia',
    targetDate: '2026-04-05',
    isCritical: true,
    context:
      'Assembleia de fundacao com todos os 7 fundadores. Depende do registro do estatuto.',
  },
  {
    id: 'countdown-cnpj',
    label: 'CNPJ Ativo',
    targetDate: '2026-04-10',
    isCritical: true,
    context:
      'CNPJ atualizado para operacoes financeiras, contratos e conta bancaria.',
  },
  {
    id: 'countdown-contrato-etec',
    label: 'Assinatura Contrato ETEC',
    targetDate: '2026-07-15',
    isCritical: true,
    context:
      'Assinatura do contrato de Encomenda Tecnologica com o Estado de SC. Marco formal do projeto.',
  },
  {
    id: 'countdown-poc-inicio',
    label: 'Inicio da PoC',
    targetDate: '2026-06-01',
    isCritical: false,
    context:
      'Inicio do desenvolvimento da Prova de Conceito com equipe tecnica completa.',
  },
  {
    id: 'countdown-poc-entrega',
    label: 'Entrega da PoC',
    targetDate: '2026-09-30',
    isCritical: true,
    context:
      'PoC concluida e validada. Decisao go/no-go para o piloto controlado.',
  },
  {
    id: 'countdown-piloto',
    label: 'Inicio do Piloto Controlado',
    targetDate: '2026-10-01',
    isCritical: true,
    context:
      'Lancamento do piloto em escolas selecionadas de SC.',
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
