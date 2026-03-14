'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Target,
  Eye,
  Heart,
  BookOpen,
  Building2,
  GraduationCap,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Briefcase,
  Globe,
  Sparkles,
  HandshakeIcon,
  Brain,
  Users,
  School,
  BarChart3,
  Shield,
  Lightbulb,
  Layers,
  Monitor,
  Search,
  Route,
  Zap,
} from 'lucide-react';

/* ============================================
   Data
   ============================================ */

const valores = [
  {
    letter: 'E',
    title: 'Excelência Científica',
    description: 'Cada projeto, publicação e solução busca o padrão de excelência que transcende o ordinário. O impacto real do conhecimento.',
  },
  {
    letter: 'M',
    title: 'Impacto Mensurável',
    description: 'Compromisso com resultados documentados, metodologias validadas e transparência algorítmica. Dados representam alunos.',
  },
  {
    letter: 'I',
    title: 'Inovação com Propósito',
    description: 'Tecnologia a serviço da educação pública. Cada decisão técnica serve a um objetivo pedagógico. IA é ferramenta, não fim.',
  },
  {
    letter: 'C',
    title: 'Colaboração Institucional',
    description: 'Articulação entre setor público, acadêmico e privado, orquestrando competências complementares para transformação em escala.',
  },
];

const pilares = [
  {
    icon: Lightbulb,
    title: 'Inovação',
    subtitle: 'Orquestração e Ecossistema',
    description:
      'Capacidade de articular parcerias intersetoriais, unindo o setor público, o privado e o terceiro setor para solucionar desafios educacionais complexos.',
    color: '#C2703E',
  },
  {
    icon: Layers,
    title: 'Tecnologia',
    subtitle: 'Alicerce Escalável',
    description:
      'Infraestrutura de nuvem, IA preditiva e generativa, e engenharia de dados capaz de suportar redes com mais de 1.000 escolas, 50 mil docentes e 550 mil alunos.',
    color: '#2E5A88',
  },
  {
    icon: BookOpen,
    title: 'Ciência',
    subtitle: 'Metodologia Baseada em Evidências',
    description:
      'Produção de conhecimento científico, documentação de aprendizados e avaliação de impacto de intervenções em contextos educacionais.',
    color: '#1A3A5C',
  },
];

const ecossistema = [
  {
    icon: GraduationCap,
    title: 'Eixo Discente',
    subtitle: 'Centro',
    description:
      'Personalização do percurso, engajamento interativo e foco na redução do abandono escolar.',
    color: '#C2703E',
  },
  {
    icon: Users,
    title: 'Eixo Docente',
    subtitle: 'Empoderamento',
    description:
      'Empoderamento do professor como mediador, liberação de tempo burocrático e suporte com IA.',
    color: '#2E5A88',
  },
  {
    icon: Building2,
    title: 'Eixo Institucional',
    subtitle: 'Infraestrutura',
    description:
      'Simplificação administrativa e estruturação de infraestrutura para aprendizagem digital.',
    color: '#1A3A5C',
  },
  {
    icon: BarChart3,
    title: 'Convergência Sistêmica',
    subtitle: 'Anel Externo',
    description:
      'Repositório unificado de dados transformando registros administrativos e pedagógicos em inteligência acionável.',
    color: '#64748B',
  },
];

const jornadaDocente = [
  {
    icon: Monitor,
    title: 'Simplificação Operacional',
    description: 'Redução de até 30% do tempo em tarefas burocráticas através de interface unificada.',
  },
  {
    icon: School,
    title: 'Capacitação Pedagógica',
    description: 'Trilhas formativas alinhadas à Escola de Formação.',
  },
  {
    icon: BookOpen,
    title: 'Planejamento Pedagógico',
    description: 'Criação de aulas alinhadas à BNCC com suporte inteligente.',
  },
  {
    icon: Zap,
    title: 'Execução Digital',
    description: 'Aulas em ambiente interativo com coleta de dados em tempo real.',
  },
  {
    icon: Brain,
    title: 'IA como Suporte',
    description: 'Co-piloto de IA generativa para sugerir intervenções e roteiros adaptados à turma.',
  },
];

const aprendizagemAluno = [
  {
    icon: Search,
    title: 'Diagnóstico de Competências',
    description: 'Identificação precisa de lacunas de aprendizagem em tempo real.',
  },
  {
    icon: Route,
    title: 'Percursos Adaptativos',
    description:
      'O motor de IA prescreve trilhas de recuperação estruturadas conforme o perfil individual do aluno.',
  },
  {
    icon: Zap,
    title: 'Engajamento Constante',
    description:
      'Retorno formativo imediato, mantendo o aluno no centro de seu próprio desenvolvimento educacional.',
  },
];

const governanca = [
  {
    icon: Users,
    title: 'Conselho Consultivo & Diretoria',
    description:
      'Governança estratégica pro bono, garantindo independência, ética e alinhamento inabalável aos interesses públicos.',
  },
  {
    icon: BookOpen,
    title: 'Coordenação Científica',
    description:
      'Supervisão rigorosa de metodologias, validando a eficácia pedagógica de todas as intervenções tecnológicas implantadas.',
  },
  {
    icon: Shield,
    title: 'Segurança e LGPD',
    description:
      'Proteção absoluta de dados de menores de idade, com arquitetura criptografada, DPO próprio e Relatórios de Impacto contínuos.',
  },
];

const partners = [
  {
    name: 'Better EdTech',
    description: 'Tecnologia Educacional e Inovação',
    url: 'https://www.betteredtech.com.br/',
  },
  {
    name: 'Jinso',
    description: 'Desenvolvimento de Software',
    url: null,
  },
  {
    name: 'Sprix',
    description: 'Tecnologia Educacional',
    url: null,
  },
  {
    name: 'MadeinWEB',
    description: 'Desenvolvimento Web',
    url: null,
  },
  {
    name: 'Gestorial',
    description: 'Gestão Administrativa e Contábil',
    url: null,
  },
];

const clientes = [
  {
    name: 'Estado de Santa Catarina',
    detail: 'Secretaria de Estado da Educação (SED/SC)',
    description:
      'Encomenda Tecnológica para desenvolvimento de plataforma educacional com IA para a rede pública estadual — mais de 1.000 escolas, 50 mil docentes e 550 mil alunos.',
  },
];

/* ============================================
   Animations
   ============================================ */

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

const staggerContainer = {
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true },
};

const staggerItem = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

/* ============================================
   Landing Page Component
   ============================================ */

export default function LandingPage() {
  return (
    <div className="relative overflow-x-hidden bg-white">

      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#00B4D8]/[0.05] blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#0A2463]/[0.04] blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(#0A2463 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <motion.div
          className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' as const }}
        >
          <motion.div
            className="mb-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0A2463] to-[#00B4D8] flex items-center justify-center shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <GraduationCap size={32} className="text-white" />
          </motion.div>

          <motion.h1
            className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none text-[#0A2463]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            i10
          </motion.h1>

          <motion.p
            className="mt-3 text-xl sm:text-2xl md:text-3xl text-[#0A2463]/80 font-semibold tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            Instituto i10
          </motion.p>

          <motion.p
            className="mt-2 text-base sm:text-lg md:text-xl text-[#00B4D8] font-medium tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Educação · Tecnologia · Inovação
          </motion.p>

          <motion.p
            className="mt-4 text-lg sm:text-xl md:text-2xl text-[#0A2463]/70 font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            Orquestrando o Futuro da Educação Pública
          </motion.p>

          <motion.p
            className="mt-6 text-sm sm:text-base md:text-lg text-[#64748B] max-w-2xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Não somos apenas desenvolvedores de software — somos orquestradores
            da transformação educacional. Nossa tecnologia não substitui o humano;
            ela o liberta para focar no que realmente importa: a aprendizagem.
          </motion.p>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base
                         bg-[#0A2463] text-white
                         hover:bg-[#0A2463]/90 hover:shadow-lg hover:shadow-[#0A2463]/20 transition-all duration-300"
            >
              Acessar Painel de Controle
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
          >
            <ChevronRight size={24} className="rotate-90 text-[#94A3B8]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ========== O MANIFESTO ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0A2463]/10 bg-[#0A2463]/5 mb-6">
              <BookOpen size={14} className="text-[#0A2463]" />
              <span className="text-xs text-[#0A2463] font-medium uppercase tracking-wider">Manifesto</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
              Quem Somos
            </h2>
            <p className="mt-8 text-[#64748B] text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
              O Instituto i10 é uma Instituição Científica, Tecnológica e de Inovação (ICT)
              Orquestradora, que atua na intersecção entre a pesquisa metodológica, o
              desenvolvimento tecnológico e a efetividade das políticas públicas educacionais.
              Como ICT Coordenadora e Orquestradora, articulamos competências do setor público,
              acadêmico e privado para gerar transformação em escala.
            </p>
            <p className="mt-6 text-[#64748B] text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
              Transformar a educação pública brasileira através de pesquisa, desenvolvimento
              e inovação em Inteligência Artificial, gerando impacto mensurável na qualidade
              de ensino e na equidade de oportunidades. Operamos projetos de risco tecnológico
              (Encomendas Tecnológicas) através do programa Educação do Futuro, nossa face
              pública junto ao governo e à sociedade.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========== MISSÃO, VISÃO E VALORES ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
              O Propósito Que Nos Move
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
            {...staggerContainer}
          >
            <motion.div
              {...staggerItem}
              className="relative rounded-2xl bg-white border border-[#E2E8F0] p-8 shadow-sm hover:shadow-md hover:border-[#C2703E]/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#C2703E]/10 flex items-center justify-center mb-5">
                <Target size={24} className="text-[#C2703E]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Missão</h3>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                Transformar a educação pública brasileira através de pesquisa,
                desenvolvimento e inovação em Inteligência Artificial, gerando
                impacto mensurável na qualidade de ensino e na equidade de oportunidades.
              </p>
            </motion.div>

            <motion.div
              {...staggerItem}
              className="relative rounded-2xl bg-white border border-[#E2E8F0] p-8 shadow-sm hover:shadow-md hover:border-[#2E5A88]/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#2E5A88]/10 flex items-center justify-center mb-5">
                <Eye size={24} className="text-[#2E5A88]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Visão</h3>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                Ser o centro de inteligência orquestrador que consolida uma
                capacidade institucional permanente no Estado, transformando redes
                de ensino em ecossistemas baseados em evidências.
              </p>
            </motion.div>

            <motion.div
              {...staggerItem}
              className="relative rounded-2xl bg-white border border-[#E2E8F0] p-8 shadow-sm hover:shadow-md hover:border-[#00E5A0]/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#00E5A0]/10 flex items-center justify-center mb-5">
                <Heart size={24} className="text-[#00E5A0]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-1">Valores</h3>
              <p className="text-xs font-semibold text-[#00E5A0] tracking-wider mb-3">E · M · I · C</p>
              <ul className="space-y-3">
                {valores.map((valor) => (
                  <li key={valor.title}>
                    <span className="text-sm font-semibold text-[#0F172A]">
                      <span className="text-[#00E5A0] font-bold mr-1">{valor.letter}</span>
                      {valor.title}
                    </span>
                    <p className="text-sm text-[#64748B] mt-0.5">{valor.description}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========== OS TRÊS PILARES ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0A2463]/10 bg-[#0A2463]/5 mb-6">
              <Layers size={14} className="text-[#0A2463]" />
              <span className="text-xs text-[#0A2463] font-medium uppercase tracking-wider">Fundamentos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
              Os Três Pilares
            </h2>
            <p className="mt-4 text-[#64748B] text-base sm:text-lg max-w-2xl mx-auto">
              Nossa atuação se sustenta sobre três pilares que, juntos, garantem soluções robustas e de impacto real.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
            {...staggerContainer}
          >
            {pilares.map((pilar) => {
              const Icon = pilar.icon;
              return (
                <motion.div
                  key={pilar.title}
                  {...staggerItem}
                  className="relative rounded-2xl bg-white border border-[#E2E8F0] p-8 shadow-sm hover:shadow-md transition-all duration-300"
                  style={{ '--hover-color': pilar.color } as React.CSSProperties}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: `${pilar.color}15` }}
                  >
                    <Icon size={24} style={{ color: pilar.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">{pilar.title}</h3>
                  <p className="text-xs font-medium uppercase tracking-wider mt-1 mb-3" style={{ color: pilar.color }}>
                    {pilar.subtitle}
                  </p>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    {pilar.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ========== ECOSSISTEMA INTEGRADO ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00B4D8]/15 bg-[#00B4D8]/5 mb-6">
              <Globe size={14} className="text-[#00B4D8]" />
              <span className="text-xs text-[#00B4D8] font-medium uppercase tracking-wider">Ecossistema</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
              Visão Integrada
            </h2>
            <p className="mt-4 text-[#64748B] text-base sm:text-lg max-w-3xl mx-auto">
              Um ecossistema completo que conecta alunos, professores, gestores e dados
              em uma plataforma coesa de transformação educacional.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            {...staggerContainer}
          >
            {ecossistema.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  {...staggerItem}
                  className="rounded-2xl bg-white border border-[#E2E8F0] p-8 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Icon size={20} style={{ color: item.color }} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0F172A]">{item.title}</h3>
                      <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: item.color }}>
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ========== JORNADA DO PROFESSOR ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2E5A88]/15 bg-[#2E5A88]/5 mb-6">
              <Users size={14} className="text-[#2E5A88]" />
              <span className="text-xs text-[#2E5A88] font-medium uppercase tracking-wider">Eixo Docente</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
              A Jornada de Empoderamento
            </h2>
            <p className="mt-4 text-[#64748B] text-base sm:text-lg max-w-2xl mx-auto">
              O sistema não substitui a mediação do professor — ele a potencializa.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
            {...staggerContainer}
          >
            {jornadaDocente.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  {...staggerItem}
                  className="relative rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-[#2E5A88]/40">{String(index + 1).padStart(2, '0')}</span>
                    <div className="w-8 h-8 rounded-lg bg-[#2E5A88]/10 flex items-center justify-center">
                      <Icon size={16} className="text-[#2E5A88]" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-[#0F172A] mb-1.5">{step.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{step.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ========== APRENDIZAGEM DO ALUNO ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C2703E]/15 bg-[#C2703E]/5 mb-6">
              <GraduationCap size={14} className="text-[#C2703E]" />
              <span className="text-xs text-[#C2703E] font-medium uppercase tracking-wider">Eixo Discente</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
              Aprendizagem Personalizada
            </h2>
            <p className="mt-4 text-[#64748B] text-base sm:text-lg max-w-2xl mx-auto">
              O aluno acessa um ambiente digital interativo, gerando dados sistemáticos
              sobre seu desempenho que alimentam intervenções cada vez mais precisas.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            {...staggerContainer}
          >
            {aprendizagemAluno.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  {...staggerItem}
                  className="rounded-2xl bg-white border border-[#E2E8F0] p-8 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#C2703E]/10 flex items-center justify-center mb-5">
                    <Icon size={24} className="text-[#C2703E]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ========== GOVERNANÇA ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0A2463]/10 bg-[#0A2463]/5 mb-6">
              <Shield size={14} className="text-[#0A2463]" />
              <span className="text-xs text-[#0A2463] font-medium uppercase tracking-wider">Governança</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
              A Fundação da Confiança
            </h2>
            <p className="mt-4 text-[#64748B] text-base sm:text-lg max-w-2xl mx-auto">
              Governança, transparência e proteção de dados como pilares inegociáveis.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
            {...staggerContainer}
          >
            {governanca.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  {...staggerItem}
                  className="rounded-2xl bg-white border border-[#E2E8F0] p-8 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0A2463]/5 flex items-center justify-center mb-5">
                    <Icon size={24} className="text-[#0A2463]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ========== CLIENTES ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0A2463]/10 bg-[#0A2463]/5 mb-6">
              <Building2 size={14} className="text-[#0A2463]" />
              <span className="text-xs text-[#0A2463] font-medium uppercase tracking-wider">Clientes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A]">
              Nossos Clientes
            </h2>
            <p className="mt-4 text-[#64748B] text-base sm:text-lg max-w-2xl mx-auto">
              Governos e instituições que confiam no Instituto i10 para transformar a educação.
            </p>
          </motion.div>

          {clientes.map((cliente) => (
            <motion.div
              key={cliente.name}
              {...fadeInUp}
              className="rounded-2xl bg-gradient-to-br from-[#0A2463] to-[#0A2463]/90 p-8 sm:p-10 text-white shadow-xl"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Building2 size={24} className="text-[#00B4D8]" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">{cliente.name}</h3>
                  <p className="text-sm text-[#90E0EF] mt-0.5">{cliente.detail}</p>
                </div>
              </div>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                {cliente.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== EMPRESAS PARCEIRAS ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00B4D8]/15 bg-[#00B4D8]/5 mb-6">
              <HandshakeIcon size={14} className="text-[#00B4D8]" />
              <span className="text-xs text-[#00B4D8] font-medium uppercase tracking-wider">Parceiros</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A]">
              Empresas Parceiras
            </h2>
            <p className="mt-4 text-[#64748B] text-base sm:text-lg max-w-2xl mx-auto">
              Empresas que contribuem com expertise e tecnologia para o sucesso dos nossos projetos.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6"
            {...staggerContainer}
          >
            {partners.map((partner) => {
              const content = (
                <>
                  <div className="w-14 h-14 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0]
                                  flex items-center justify-center mb-4 group-hover:bg-[#00B4D8]/5 group-hover:border-[#00B4D8]/20 transition-colors">
                    <Building2 size={24} className="text-[#0A2463] group-hover:text-[#00B4D8] transition-colors" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">{partner.name}</h3>
                  <p className="mt-1 text-xs text-[#64748B]">{partner.description}</p>
                  {partner.url && (
                    <span className="mt-3 inline-flex items-center gap-1 text-xs text-[#00B4D8] font-medium">
                      Visitar site
                      <ExternalLink size={10} />
                    </span>
                  )}
                </>
              );

              const className =
                'group relative rounded-2xl bg-white border border-[#E2E8F0] p-6 hover:shadow-md hover:border-[#00B4D8]/30 transition-all duration-300 flex flex-col items-center text-center';

              return partner.url ? (
                <motion.a
                  key={partner.name}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...staggerItem}
                  className={className}
                >
                  {content}
                </motion.a>
              ) : (
                <motion.div
                  key={partner.name}
                  {...staggerItem}
                  className={className}
                >
                  {content}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ========== LEGADO ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight mb-8">
              O Nosso Verdadeiro Legado
            </h2>
            <p className="text-[#64748B] text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
              O Instituto i10 não entrega apenas um artefato tecnológico — nós transferimos
              capacidade institucional permanente. Ao final de nossos ciclos de
              Encomenda Tecnológica, as redes de ensino alcançam autonomia plena para
              operar, analisar e evoluir seus sistemas.
            </p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#C2703E] mt-2 shrink-0" />
                <p className="text-sm text-[#64748B]">
                  A sala de aula transformada em ambiente integrado de pesquisa e inovação.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#2E5A88] mt-2 shrink-0" />
                <p className="text-sm text-[#64748B]">
                  Políticas públicas orientadas por dados em tempo real.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#1A3A5C] mt-2 shrink-0" />
                <p className="text-sm text-[#64748B]">
                  Um Estado capacitado para orquestrar continuamente o futuro da educação.
                </p>
              </div>
            </div>
            <p className="mt-12 text-xl sm:text-2xl font-bold text-[#0A2463]">
              Instituto i10 — A Inteligência a Serviço do Humano.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="relative py-16 px-4 sm:px-6 bg-[#0A2463] text-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">Instituto i10</p>
              <p className="text-xs text-white/60">Educação · Tecnologia · Inovação</p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-[#00B4D8] hover:text-[#00E5A0] transition-colors font-medium"
          >
            Acessar Painel de Controle
            <ArrowRight size={16} />
          </Link>

          <div className="text-xs text-white/40 mt-4 space-y-1">
            <p>Sede: Florianópolis, SC — Brasil</p>
            <p>CNPJ: 05.124.602/0001-74</p>
            <p>&copy; 2026 Instituto i10. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
