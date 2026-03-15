'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, ExternalLink, FlaskConical, Cpu, Lightbulb, ShieldCheck, GraduationCap, Lock } from 'lucide-react';

/* ============================================
   Data
   ============================================ */

const stats = [
  { value: '1.000+', label: 'Escolas' },
  { value: '50 mil', label: 'Docentes' },
  { value: '550 mil', label: 'Alunos' },
  { value: '1', label: 'Estado Parceiro' },
];

const valores = [
  {
    letter: 'E',
    title: 'Excelência Científica',
    description: 'Cada projeto e solução busca o padrão de excelência que transcende o ordinário.',
  },
  {
    letter: 'M',
    title: 'Impacto Mensurável',
    description: 'Resultados documentados, metodologias validadas e transparência algorítmica.',
  },
  {
    letter: 'I',
    title: 'Inovação com Propósito',
    description: 'Tecnologia a serviço da educação. Cada decisão técnica serve a um objetivo pedagógico.',
  },
  {
    letter: 'C',
    title: 'Colaboração Institucional',
    description: 'Articulação entre setor público, acadêmico e privado para transformação em escala.',
  },
];

const partners = [
  { name: 'Better EdTech', role: 'Tecnologia Educacional e Inovação', url: 'https://www.betteredtech.com.br/' },
  { name: 'Jinso', role: 'Desenvolvimento de Software', url: null },
  { name: 'Sprix', role: 'Tecnologia Educacional', url: null },
  { name: 'MadeinWEB', role: 'Desenvolvimento Web', url: null },
  { name: 'Gestorial', role: 'Gestão Administrativa e Contábil', url: null },
];

/* ============================================
   Animation helpers
   ============================================ */

const fadeIn = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

/* ============================================
   Reusable: Gradient Divider
   ============================================ */

function GradientDivider() {
  return <div className="gradient-divider" />;
}

/* ============================================
   Reusable: Hex Mesh Overlay
   ============================================ */

function HexMeshOverlay({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 hex-mesh pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}

/* ============================================
   Parallax Hero component
   ============================================ */

function ParallaxHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-[#0A2463]">
      {/* Hex mesh background */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <HexMeshOverlay />
        {/* Radial glow accents */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#00B4D8]/[0.06] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#00E5A0]/[0.04] blur-[100px]" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col justify-end pb-20 sm:pb-28 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto"
        style={{ opacity }}
      >
        <motion.p
          className="text-[#00E5A0] text-sm sm:text-base font-medium tracking-[0.3em] uppercase mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Educação · Tecnologia · Inovação
        </motion.p>

        <motion.h1
          className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight max-w-4xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          Instituto
          <br />
          <span className="text-[#00B4D8] glow-text">i10</span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg sm:text-xl text-white/70 max-w-xl leading-relaxed font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Orquestrando o futuro da educação pública brasileira através de
          pesquisa, inteligência artificial e parcerias estratégicas com governos.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00B4D8] to-[#00E5A0] text-[#0A2463] font-semibold text-sm rounded-full
                       hover:shadow-[0_0_30px_rgba(0,180,216,0.4)] transition-all duration-300"
          >
            Acessar Painel de Controle
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="mt-16 flex flex-wrap gap-8 sm:gap-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-black text-[#00B4D8]">{s.value}</p>
              <p className="text-sm text-white/50 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ============================================
   Landing Page
   ============================================ */

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden bg-[#0A2463]">
      <ParallaxHero />
      <GradientDivider />

      {/* ========== MANIFESTO ========== */}
      <section className="relative py-28 sm:py-40 px-6 sm:px-12 lg:px-20 bg-[#0A2463] overflow-hidden">
        <HexMeshOverlay />
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeIn}>
            <p className="text-[#00B4D8] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              Quem Somos
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
              Não somos apenas desenvolvedores de software.
            </h2>
            <div className="mt-8 space-y-6 text-white/70 text-base sm:text-lg leading-relaxed font-serif italic">
              <p>
                Somos orquestradores da transformação educacional. O Instituto i10 é uma
                Instituição Científica, Tecnológica e de Inovação (ICT) que atua como
                catalisador — articulando competências do setor público, acadêmico e
                privado em projetos de inovação educacional de grande escala.
              </p>
              <p>
                Nossa tecnologia não substitui o humano. Ela o liberta das amarras
                burocráticas para que possa focar no que realmente importa: a aprendizagem.
              </p>
            </div>
          </motion.div>
          <motion.div
            {...fadeIn}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#061742] border border-[#142D5C]"
          >
            <HexMeshOverlay />
            {/* Decorative glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-[#00B4D8]/10 blur-[60px]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[#00B4D8]/20 text-9xl font-black select-none">i10</div>
            </div>
          </motion.div>
        </div>
      </section>
      <GradientDivider />

      {/* ========== MISSÃO (full-bleed dark) ========== */}
      <section className="relative py-32 sm:py-44 px-6 overflow-hidden bg-[#061742]">
        <HexMeshOverlay />
        <div className="absolute inset-0 bg-[#0A2463]/70" />
        {/* Decorative radial glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00B4D8]/[0.04] blur-[120px] rounded-full" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.p
            {...fadeIn}
            className="text-[#00E5A0] text-xs font-semibold tracking-[0.25em] uppercase mb-6"
          >
            Nossa Missão
          </motion.p>
          <motion.blockquote
            {...fadeIn}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug font-serif italic"
          >
            Transformar a educação pública brasileira através de pesquisa,
            desenvolvimento e inovação em Inteligência Artificial, gerando
            impacto mensurável na qualidade de ensino e na equidade de oportunidades.
          </motion.blockquote>
        </div>
      </section>
      <GradientDivider />

      {/* ========== VALORES EMIC ========== */}
      <section className="relative py-28 sm:py-40 px-6 sm:px-12 lg:px-20 bg-[#0A2463] overflow-hidden">
        <HexMeshOverlay />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div {...fadeIn} className="mb-20">
            <p className="text-[#00B4D8] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              Nossos Valores
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
              O que nos define.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-t border-l border-[#142D5C]">
            {valores.map((v, i) => (
              <motion.div
                key={v.letter}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border-b border-r border-[#142D5C] p-8 sm:p-12 group hover:bg-[#061742] transition-colors duration-300"
              >
                <span className="text-6xl sm:text-7xl font-black text-[#00B4D8]/[0.1] group-hover:text-[#00B4D8]/30 glow-hover transition-colors duration-500 leading-none block mb-4">
                  {v.letter}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{v.title}</h3>
                <p className="text-white/60 leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <GradientDivider />

      {/* ========== TRÊS PILARES (split layout) ========== */}
      <section className="relative bg-[#0A2463] text-white overflow-hidden">
        <HexMeshOverlay />

        {/* Pilar 1 — Ciência */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
          <motion.div
            {...fadeIn}
            className="p-12 sm:p-20 flex flex-col justify-center"
          >
            <p className="text-[#00E5A0] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              Pilar 01
            </p>
            <h3 className="text-3xl sm:text-4xl font-black leading-tight mb-6">
              Ciência
            </h3>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-lg">
              Metodologia baseada em evidências. Produção de conhecimento científico,
              documentação de aprendizados e avaliação de impacto de intervenções
              em contextos educacionais reais.
            </p>
          </motion.div>
          <div className="relative min-h-[400px] lg:min-h-0 bg-[#061742] border-l border-[#142D5C]">
            <HexMeshOverlay />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 w-24 h-24 rounded-full bg-[#00E5A0]/10 blur-[40px]" />
                <FlaskConical size={64} className="text-[#00E5A0]/40 relative z-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Pilar 2 — Tecnologia */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[400px] lg:min-h-0 order-2 lg:order-1 bg-[#061742] border-r border-[#142D5C]">
            <HexMeshOverlay />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 w-24 h-24 rounded-full bg-[#00B4D8]/10 blur-[40px]" />
                <Cpu size={64} className="text-[#00B4D8]/40 relative z-10" />
              </div>
            </div>
          </div>
          <motion.div
            {...fadeIn}
            className="p-12 sm:p-20 flex flex-col justify-center order-1 lg:order-2"
          >
            <p className="text-[#00B4D8] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              Pilar 02
            </p>
            <h3 className="text-3xl sm:text-4xl font-black leading-tight mb-6">
              Tecnologia
            </h3>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-lg">
              Alicerce escalável. Infraestrutura de nuvem, IA preditiva e generativa,
              e engenharia de dados capaz de suportar redes com mais de 1.000 escolas,
              50 mil docentes e 550 mil alunos.
            </p>
          </motion.div>
        </div>

        {/* Pilar 3 — Inovação */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
          <motion.div
            {...fadeIn}
            className="p-12 sm:p-20 flex flex-col justify-center"
          >
            <p className="text-[#00E5A0] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              Pilar 03
            </p>
            <h3 className="text-3xl sm:text-4xl font-black leading-tight mb-6">
              Inovação
            </h3>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-lg">
              Orquestração e ecossistema. Capacidade de articular parcerias intersetoriais,
              unindo o setor público, o privado e o terceiro setor para solucionar
              desafios educacionais complexos.
            </p>
          </motion.div>
          <div className="relative min-h-[400px] lg:min-h-0 bg-[#061742] border-l border-[#142D5C]">
            <HexMeshOverlay />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 w-24 h-24 rounded-full bg-[#00E5A0]/10 blur-[40px]" />
                <Lightbulb size={64} className="text-[#00E5A0]/40 relative z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <GradientDivider />

      {/* ========== ECOSSISTEMA (professor + aluno side by side) ========== */}
      <section className="relative py-28 sm:py-40 px-6 sm:px-12 lg:px-20 bg-[#0A2463] overflow-hidden">
        <HexMeshOverlay />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-20">
            <p className="text-[#00B4D8] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              Ecossistema Integrado
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
              Quem transformamos.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Professor */}
            <motion.div
              {...fadeIn}
              className="group relative rounded-2xl overflow-hidden bg-[#061742] border border-[#142D5C] hover:border-[#00B4D8]/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,180,216,0.1)]"
            >
              <div className="relative h-64 sm:h-80 bg-[#0A2463]">
                <HexMeshOverlay />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 w-20 h-20 rounded-full bg-[#00B4D8]/10 blur-[40px]" />
                    <GraduationCap size={56} className="text-[#00B4D8]/30 relative z-10" />
                  </div>
                </div>
              </div>
              <div className="p-8 sm:p-10">
                <p className="text-[#00B4D8] text-xs font-semibold tracking-[0.25em] uppercase mb-3">
                  Eixo Docente
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
                  O professor como protagonista
                </h3>
                <p className="text-white/60 leading-relaxed">
                  Redução de até 30% do tempo burocrático. Trilhas formativas,
                  planejamento alinhado à BNCC e um co-piloto de IA generativa que
                  sugere intervenções e roteiros adaptados a cada turma.
                </p>
              </div>
            </motion.div>

            {/* Aluno */}
            <motion.div
              {...fadeIn}
              className="group relative rounded-2xl overflow-hidden bg-[#061742] border border-[#142D5C] hover:border-[#00E5A0]/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,229,160,0.1)]"
            >
              <div className="relative h-64 sm:h-80 bg-[#0A2463]">
                <HexMeshOverlay />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 w-20 h-20 rounded-full bg-[#00E5A0]/10 blur-[40px]" />
                    <Cpu size={56} className="text-[#00E5A0]/30 relative z-10" />
                  </div>
                </div>
              </div>
              <div className="p-8 sm:p-10">
                <p className="text-[#00E5A0] text-xs font-semibold tracking-[0.25em] uppercase mb-3">
                  Eixo Discente
                </p>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-4">
                  Aprendizagem personalizada
                </h3>
                <p className="text-white/60 leading-relaxed">
                  Diagnóstico de competências em tempo real, percursos adaptativos
                  prescritos por IA e retorno formativo imediato — mantendo cada aluno
                  no centro do seu próprio desenvolvimento.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <GradientDivider />

      {/* ========== GOVERNANÇA ========== */}
      <section className="relative py-28 sm:py-40 px-6 sm:px-12 lg:px-20 bg-[#061742] overflow-hidden">
        <HexMeshOverlay />
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeIn}>
            <p className="text-[#00B4D8] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              Governança e Transparência
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.05] tracking-tight mb-8">
              A fundação da confiança.
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Conselho Consultivo & Diretoria</h3>
                <p className="text-white/60 leading-relaxed">
                  Governança estratégica pro bono, garantindo independência, ética e
                  alinhamento inabalável aos interesses públicos.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Coordenação Científica</h3>
                <p className="text-white/60 leading-relaxed">
                  Supervisão rigorosa de metodologias, validando a eficácia pedagógica
                  de todas as intervenções tecnológicas implantadas.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Segurança e LGPD</h3>
                <p className="text-white/60 leading-relaxed">
                  Proteção absoluta de dados de menores de idade, com arquitetura
                  criptografada, DPO próprio e Relatórios de Impacto contínuos.
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            {...fadeIn}
            className="relative aspect-square rounded-2xl overflow-hidden bg-[#0A2463] border border-[#142D5C]"
          >
            <HexMeshOverlay />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-8 rounded-full bg-[#00B4D8]/[0.08] blur-[50px]" />
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <ShieldCheck size={72} className="text-[#00B4D8]/30" />
                  <Lock size={40} className="text-[#00E5A0]/25" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <GradientDivider />

      {/* ========== CLIENTE / SANTA CATARINA ========== */}
      <section className="relative py-28 sm:py-40 px-6 sm:px-12 lg:px-20 bg-[#0A2463] overflow-hidden">
        <HexMeshOverlay />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <p className="text-[#00B4D8] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              Projeto Ativo
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6">
              Santa Catarina
            </h2>
            <p className="text-xl sm:text-2xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed mb-12">
              Encomenda Tecnológica com a Secretaria de Estado da Educação (SED/SC) para
              desenvolvimento de plataforma educacional com IA para toda a rede pública estadual.
            </p>
          </motion.div>

          <motion.div
            {...fadeIn}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8"
          >
            {stats.map((s) => (
              <div key={s.label} className="py-6">
                <p className="text-4xl sm:text-5xl font-black text-[#00B4D8] glow-text">{s.value}</p>
                <p className="text-sm text-white/50 mt-2 font-medium">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      <GradientDivider />

      {/* ========== PARCEIROS ========== */}
      <section className="relative py-20 sm:py-28 px-6 sm:px-12 lg:px-20 bg-[#061742] overflow-hidden">
        <HexMeshOverlay />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-16">
            <p className="text-[#00B4D8] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              Parceiros
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Empresas Parceiras
            </h2>
          </motion.div>

          <motion.div
            {...fadeIn}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-8"
          >
            {partners.map((p) => {
              const inner = (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0A2463] border border-[#142D5C] flex items-center justify-center shrink-0">
                    <span className="text-[#00B4D8] font-bold text-sm">{p.name.charAt(0)}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">{p.name}</p>
                    <p className="text-xs text-white/40">{p.role}</p>
                  </div>
                  {p.url && <ExternalLink size={12} className="text-[#00B4D8] ml-1 shrink-0" />}
                </div>
              );

              const cls =
                'px-5 py-3 rounded-full bg-[#0A2463] border border-[#142D5C] hover:border-[#00B4D8]/40 hover:shadow-[0_0_20px_rgba(0,180,216,0.1)] transition-all duration-300';

              return p.url ? (
                <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className={cls}>
                  {inner}
                </a>
              ) : (
                <div key={p.name} className={cls}>
                  {inner}
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>
      <GradientDivider />

      {/* ========== LEGADO (full-bleed closing) ========== */}
      <section className="relative py-36 sm:py-48 px-6 overflow-hidden bg-[#061742]">
        <HexMeshOverlay />
        <div className="absolute inset-0 bg-[#0A2463]/75" />
        {/* Decorative glows */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[#00B4D8]/[0.03] blur-[150px] rounded-full" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h2
            {...fadeIn}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-8"
          >
            O nosso verdadeiro legado
          </motion.h2>
          <motion.p
            {...fadeIn}
            className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-3xl mx-auto mb-12 font-serif italic"
          >
            O Instituto i10 não entrega apenas um artefato tecnológico — nós transferimos
            capacidade institucional permanente. Ao final de nossos ciclos, as redes de
            ensino alcançam autonomia plena para operar, analisar e evoluir seus sistemas.
          </motion.p>
          <motion.p
            {...fadeIn}
            className="text-2xl sm:text-3xl font-bold text-[#00E5A0] glow-text-green"
          >
            A Inteligência a Serviço do Humano.
          </motion.p>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="relative bg-[#030B1A] text-white">
        <GradientDivider />
        <div className="py-16 px-6 sm:px-12 lg:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-12">
              <div>
                <p className="text-2xl font-black tracking-tight">
                  Instituto <span className="text-[#00B4D8] glow-text">i10</span>
                </p>
                <p className="text-sm text-white/40 mt-1">Educação · Tecnologia · Inovação</p>
              </div>
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-sm font-medium
                           hover:bg-gradient-to-r hover:from-[#00B4D8] hover:to-[#00E5A0] hover:text-[#0A2463] hover:border-transparent transition-all duration-300"
              >
                Painel de Controle
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="h-px bg-white/10 mb-8" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/30">
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                <span>Florianópolis, SC — Brasil</span>
                <span>CNPJ: 05.124.602/0001-74</span>
              </div>
              <p>&copy; 2026 Instituto i10. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
