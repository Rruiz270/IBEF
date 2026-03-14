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
} from 'lucide-react';

/* ============================================
   Data
   ============================================ */

const valores = [
  'Inovação com propósito',
  'Transparência e prestação de contas',
  'Colaboração público-privada',
  'Compromisso com resultados mensuráveis',
  'Respeito à diversidade regional',
];

const oQueFazemos = [
  {
    icon: Sparkles,
    title: 'Inteligência Artificial Educacional',
    description:
      'Desenvolvemos plataformas de IA que personalizam a aprendizagem, adaptando conteúdos e metodologias ao ritmo de cada aluno.',
  },
  {
    icon: HandshakeIcon,
    title: 'Parcerias com Governos',
    description:
      'Articulamos parcerias estratégicas com secretarias estaduais de educação para implementar soluções em larga escala na rede pública.',
  },
  {
    icon: Briefcase,
    title: 'Gestão de Projetos Educacionais',
    description:
      'Gerenciamos projetos complexos de tecnologia educacional, da concepção à implementação, com foco em resultados mensuráveis.',
  },
  {
    icon: Globe,
    title: 'Pesquisa e Inovação',
    description:
      'Investimos em pesquisa aplicada para criar soluções baseadas em evidências que melhorem os indicadores educacionais do país.',
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
      'Encomenda Tecnológica para desenvolvimento de plataforma educacional com IA para a rede pública estadual.',
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
            IBEF
          </motion.h1>

          <motion.p
            className="mt-4 text-lg sm:text-xl md:text-2xl text-[#0A2463]/70 font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Instituto Brasileiro pela Educação do Futuro
          </motion.p>

          <motion.p
            className="mt-6 text-sm sm:text-base md:text-lg text-[#64748B] max-w-2xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Transformando a educação pública brasileira por meio da tecnologia,
            inteligência artificial e inovação pedagógica.
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

      {/* ========== SOBRE NÓS ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0A2463]/10 bg-[#0A2463]/5 mb-6">
              <BookOpen size={14} className="text-[#0A2463]" />
              <span className="text-xs text-[#0A2463] font-medium uppercase tracking-wider">Sobre Nós</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
              Quem Somos
            </h2>
            <p className="mt-8 text-[#64748B] text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
              O IBEF — Instituto Brasileiro pela Educação do Futuro — é uma organização
              dedicada a transformar a educação pública brasileira por meio da inovação
              tecnológica, inteligência artificial e parcerias estratégicas com governos
              estaduais. Acreditamos que a tecnologia, quando aplicada com propósito e
              rigor científico, pode personalizar a aprendizagem e garantir que cada
              estudante alcance seu potencial máximo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========== MISSÃO, VISÃO E VALORES ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
              Missão, Visão e Valores
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
            {...staggerContainer}
          >
            <motion.div
              {...staggerItem}
              className="relative rounded-2xl bg-white border border-[#E2E8F0] p-8 shadow-sm hover:shadow-md hover:border-[#00B4D8]/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0A2463]/5 flex items-center justify-center mb-5">
                <Target size={24} className="text-[#0A2463]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Missão</h3>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                Desenvolver e implementar soluções tecnológicas inovadoras que personalizem
                o processo de aprendizagem, elevando os indicadores educacionais da rede
                pública brasileira.
              </p>
            </motion.div>

            <motion.div
              {...staggerItem}
              className="relative rounded-2xl bg-white border border-[#E2E8F0] p-8 shadow-sm hover:shadow-md hover:border-[#00B4D8]/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#00B4D8]/10 flex items-center justify-center mb-5">
                <Eye size={24} className="text-[#00B4D8]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Visão</h3>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                Ser referência nacional na aplicação de inteligência artificial para
                educação pública, promovendo equidade e excelência no ensino em todo o
                território brasileiro.
              </p>
            </motion.div>

            <motion.div
              {...staggerItem}
              className="relative rounded-2xl bg-white border border-[#E2E8F0] p-8 shadow-sm hover:shadow-md hover:border-[#00B4D8]/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#00E5A0]/10 flex items-center justify-center mb-5">
                <Heart size={24} className="text-[#00E5A0]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Valores</h3>
              <ul className="space-y-2">
                {valores.map((valor) => (
                  <li key={valor} className="flex items-start gap-2 text-sm sm:text-base text-[#64748B]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00E5A0] shrink-0" />
                    {valor}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========== O QUE FAZEMOS ========== */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00B4D8]/15 bg-[#00B4D8]/5 mb-6">
              <Sparkles size={14} className="text-[#00B4D8]" />
              <span className="text-xs text-[#00B4D8] font-medium uppercase tracking-wider">Atuação</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
              O Que Fazemos
            </h2>
            <p className="mt-4 text-[#64748B] text-base sm:text-lg max-w-2xl mx-auto">
              Nossas áreas de atuação combinam tecnologia de ponta com impacto social na educação.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            {...staggerContainer}
          >
            {oQueFazemos.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  {...staggerItem}
                  className="rounded-2xl bg-white border border-[#E2E8F0] p-8 shadow-sm hover:shadow-md hover:border-[#00B4D8]/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#00B4D8]/10 flex items-center justify-center mb-5">
                    <Icon size={24} className="text-[#00B4D8]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                    {item.description}
                  </p>
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
              Governos e instituições que confiam no IBEF para transformar a educação.
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

      {/* ========== FOOTER ========== */}
      <footer className="relative py-16 px-4 sm:px-6 bg-[#0A2463] text-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">IBEF</p>
              <p className="text-xs text-white/60">Instituto Brasileiro pela Educação do Futuro</p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-[#00B4D8] hover:text-[#00E5A0] transition-colors font-medium"
          >
            Acessar Painel de Controle
            <ArrowRight size={16} />
          </Link>

          <p className="text-xs text-white/40 mt-4">
            &copy; 2026 IBEF. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
