'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';

/* ============================================
   Pexels images — Brazilian education context
   ============================================ */

const IMAGES = {
  hero: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  classroom: 'https://images.pexels.com/photos/5905497/pexels-photo-5905497.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  students: 'https://images.pexels.com/photos/8612990/pexels-photo-8612990.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  teacher: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
  technology: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  legacy: 'https://images.pexels.com/photos/8613070/pexels-photo-8613070.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  science: 'https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
};

/* ============================================
   Data
   ============================================ */

const stats = [
  { value: '1.038', label: 'Escolas' },
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

const pillars = [
  {
    num: '01',
    title: 'Ciência',
    description: 'Metodologia baseada em evidências. Produção de conhecimento científico, documentação de aprendizados e avaliação de impacto de intervenções em contextos educacionais reais.',
    image: IMAGES.science,
    accent: '#00E5A0',
  },
  {
    num: '02',
    title: 'Tecnologia',
    description: 'Alicerce escalável. Infraestrutura de nuvem, IA preditiva e generativa, e engenharia de dados capaz de suportar redes com 1.038 escolas, 50 mil docentes e 550 mil alunos em 37 CREs.',
    image: IMAGES.technology,
    accent: '#00B4D8',
  },
  {
    num: '03',
    title: 'Inovação',
    description: 'Orquestração e ecossistema. Capacidade de articular parcerias intersetoriais, unindo o setor público, o privado e o terceiro setor para solucionar desafios educacionais complexos.',
    image: IMAGES.teacher,
    accent: '#00E5A0',
  },
];

const partners = [
  { name: 'Better EdTech', role: 'Tecnologia Educacional e Inovação', url: 'https://www.betteredtech.com.br/' },
  { name: 'Jinso', role: 'Desenvolvimento de Software', url: 'https://www.jinso.com/' },
  { name: 'Sprix', role: 'Tecnologia Educacional', url: 'https://sprixportal.jp/' },
  { name: 'MadeinWEB', role: 'Desenvolvimento Web', url: 'https://madeinweb.com.br/' },
  { name: 'Gestorial', role: 'Gestão Administrativa e Contábil', url: null },
];

/* ============================================
   Animation presets
   ============================================ */

const ease = [0.35, 0.35, 0, 1] as [number, number, number, number];

const fadeUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.9, ease },
};

const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 1.2, ease },
};

/* ============================================
   Hero — Cinematic full-bleed with parallax
   ============================================ */

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -80]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} className="relative h-[110vh] overflow-hidden">
      {/* Background image with parallax + scale */}
      <motion.div className="absolute inset-0" style={{ y: imgY, scale }}>
        <Image
          src={IMAGES.hero}
          alt="Estudantes em ambiente de aprendizagem"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Brandbook: navy overlay 65-75% */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030B1A]/60 via-[#0A2463]/70 to-[#030B1A]" />
      </motion.div>

      {/* Noise texture */}
      <div className="absolute inset-0 noise pointer-events-none" />

      {/* Hex mesh — subtle tech texture */}
      <div className="absolute inset-0 hex-mesh opacity-[0.04] pointer-events-none" />

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <motion.p
          className="text-[#00E5A0] text-xs sm:text-sm font-medium tracking-[0.4em] uppercase mb-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease }}
        >
          Educação · Tecnologia · Inovação
        </motion.p>

        <motion.h1
          className="font-serif text-6xl sm:text-8xl lg:text-[9rem] font-light text-white leading-[0.85] tracking-tight"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.2, ease }}
        >
          Instituto
          <br />
          <span className="text-[#00B4D8] glow-text font-normal">i10</span>
        </motion.h1>

        <motion.p
          className="mt-8 text-base sm:text-lg text-white/60 max-w-lg leading-relaxed font-light tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          Orquestrando o futuro da educação pública brasileira através de
          pesquisa, inteligência artificial e parcerias estratégicas com governos.
        </motion.p>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#00B4D8] text-[#030B1A] font-semibold text-sm tracking-wide uppercase
                       hover:bg-[#00E5A0] transition-all duration-500 rounded-none"
          >
            Acessar Painel de Controle
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats — pinned to bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1.0 }}
      >
        <div className="gradient-divider" />
        <div className="bg-[#030B1A]/80 backdrop-blur-md py-8 px-6 sm:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center min-w-[100px]">
                <p className="text-3xl sm:text-4xl font-serif font-light text-[#00B4D8]">{s.value}</p>
                <p className="text-[10px] text-white/40 mt-1 tracking-[0.2em] uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ============================================
   Landing Page
   ============================================ */

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden bg-[#030B1A]">
      <Hero />

      {/* ========== MANIFESTO ========== */}
      <section className="relative overflow-hidden">
        {/* Full-bleed image band */}
        <div className="relative h-[50vh] sm:h-[60vh]">
          <Image
            src={IMAGES.classroom}
            alt="Equipe trabalhando com tecnologia educacional"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030B1A] via-[#0A2463]/70 to-[#030B1A]" />
          <div className="absolute inset-0 noise pointer-events-none" />
          {/* Centered label over image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.p
              {...fadeIn}
              className="text-[#00B4D8] text-xs font-medium tracking-[0.4em] uppercase"
            >
              Quem Somos
            </motion.p>
          </div>
        </div>

        {/* Text content — overlapping the image bottom */}
        <div className="relative bg-[#030B1A] px-6 sm:px-12 lg:px-20 pb-32 sm:pb-48 -mt-20">
          <div className="absolute inset-0 noise pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <motion.h2
              {...fadeUp}
              className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.05] tracking-tight mb-16"
            >
              Não somos apenas desenvolvedores de software.
            </motion.h2>

            <motion.div
              {...fadeUp}
              className="grid grid-cols-1 sm:grid-cols-2 gap-12"
            >
              <p className="text-white/60 text-lg leading-relaxed font-serif">
                Somos orquestradores da transformação educacional. O Instituto i10 é uma
                Instituição Científica, Tecnológica e de Inovação (ICT) que atua como
                catalisador — articulando competências do setor público, acadêmico e
                privado em projetos de inovação educacional de grande escala.
              </p>
              <p className="text-white/60 text-lg leading-relaxed font-serif">
                Nossa tecnologia não substitui o humano. Ela o liberta das amarras
                burocráticas para que possa focar no que realmente importa: a aprendizagem.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== MISSÃO — Dramatic color inversion ========== */}
      <section className="relative py-40 sm:py-56 px-6 overflow-hidden bg-[#00B4D8]">
        <div className="absolute inset-0 noise pointer-events-none opacity-60" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.p
            {...fadeIn}
            className="text-[#030B1A]/60 text-xs font-medium tracking-[0.3em] uppercase mb-8"
          >
            Nossa Missão
          </motion.p>
          <motion.blockquote
            {...fadeUp}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#030B1A] leading-[1.2] italic"
          >
            Transformar a educação pública brasileira através de pesquisa,
            desenvolvimento e inovação em Inteligência Artificial, gerando
            impacto mensurável na qualidade de ensino e na equidade de oportunidades.
          </motion.blockquote>
        </div>
      </section>

      {/* ========== VALORES EMIC ========== */}
      <section className="relative py-32 sm:py-48 px-6 sm:px-12 lg:px-20 bg-[#030B1A] overflow-hidden">
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] translate-x-1/4 translate-y-1/4 bg-[#00E5A0]/[0.03] blur-[180px] rounded-full" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="mb-24">
            <p className="text-[#00E5A0] text-xs font-medium tracking-[0.3em] uppercase mb-6">
              Nossos Valores
            </p>
            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.05] tracking-tight">
              O que nos define.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.06]">
            {valores.map((v, i) => (
              <motion.div
                key={v.letter}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15, ease }}
                className="group relative bg-[#030B1A] p-10 sm:p-14 hover:bg-[#0A2463]/30 transition-all duration-700"
              >
                <span className="absolute top-6 right-8 font-serif text-[8rem] sm:text-[10rem] font-light leading-none text-white/[0.02] group-hover:text-[#00B4D8]/[0.08] transition-colors duration-700 select-none">
                  {v.letter}
                </span>
                <div className="relative z-10">
                  <span className="inline-block w-8 h-px bg-[#00B4D8] mb-8 group-hover:w-16 transition-all duration-500" />
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 tracking-tight">{v.title}</h3>
                  <p className="text-white/50 leading-relaxed text-sm sm:text-base">{v.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* ========== TRÊS PILARES — Stacked immersive sections ========== */}
      <section className="relative bg-[#030B1A]">
        {pillars.map((pillar, i) => (
          <div key={pillar.num} className="relative">
            {/* Full-bleed image row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
              {/* Image side */}
              <motion.div
                {...fadeIn}
                className={`relative min-h-[50vh] lg:min-h-0 overflow-hidden ${i % 2 === 1 ? 'lg:order-2' : ''}`}
              >
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-[#0A2463]/70" />
                <div className="absolute inset-0 hex-mesh opacity-[0.05] mix-blend-overlay" />
                {/* Giant number */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="font-serif text-[12rem] sm:text-[16rem] font-light leading-none select-none"
                    style={{ color: `${pillar.accent}10` }}
                  >
                    {pillar.num}
                  </span>
                </div>
              </motion.div>

              {/* Content side */}
              <motion.div
                {...fadeUp}
                className={`flex flex-col justify-center p-12 sm:p-16 lg:p-24 ${i % 2 === 1 ? 'lg:order-1' : ''}`}
              >
                <p
                  className="text-xs font-medium tracking-[0.3em] uppercase mb-6"
                  style={{ color: pillar.accent }}
                >
                  Pilar {pillar.num}
                </p>
                <h3 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight mb-8">
                  {pillar.title}
                </h3>
                <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-lg">
                  {pillar.description}
                </p>
              </motion.div>
            </div>
          </div>
        ))}
      </section>

      <div className="gradient-divider" />

      {/* ========== ECOSSISTEMA ========== */}
      <section className="relative py-32 sm:py-48 px-6 sm:px-12 lg:px-20 bg-[#030B1A] overflow-hidden">
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[400px] bg-[#00B4D8]/[0.02] blur-[200px] rounded-full" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-24">
            <p className="text-[#00B4D8] text-xs font-medium tracking-[0.3em] uppercase mb-6">
              Ecossistema Integrado
            </p>
            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.05] tracking-tight">
              Quem transformamos.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Professor card */}
            <motion.div
              {...fadeUp}
              className="group relative overflow-hidden glass rounded-2xl hover:border-[#00B4D8]/20 transition-all duration-700"
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={IMAGES.teacher}
                  alt="Professor utilizando tecnologia em sala de aula"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030B1A] via-[#0A2463]/60 to-transparent" />
              </div>
              <div className="relative p-8 sm:p-10 -mt-12 z-10">
                <p className="text-[#00B4D8] text-xs font-medium tracking-[0.25em] uppercase mb-3">
                  Eixo Docente
                </p>
                <h3 className="text-2xl sm:text-3xl font-serif font-light text-white mb-4">
                  O professor como protagonista
                </h3>
                <p className="text-white/50 leading-relaxed text-sm">
                  Redução de até 30% do tempo burocrático. Trilhas formativas,
                  planejamento alinhado à BNCC e um co-piloto de IA generativa que
                  sugere intervenções e roteiros adaptados a cada turma.
                </p>
              </div>
            </motion.div>

            {/* Aluno card */}
            <motion.div
              {...fadeUp}
              className="group relative overflow-hidden glass rounded-2xl hover:border-[#00E5A0]/20 transition-all duration-700"
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={IMAGES.students}
                  alt="Estudantes engajados na aprendizagem"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030B1A] via-[#0A2463]/60 to-transparent" />
              </div>
              <div className="relative p-8 sm:p-10 -mt-12 z-10">
                <p className="text-[#00E5A0] text-xs font-medium tracking-[0.25em] uppercase mb-3">
                  Eixo Discente
                </p>
                <h3 className="text-2xl sm:text-3xl font-serif font-light text-white mb-4">
                  Aprendizagem personalizada
                </h3>
                <p className="text-white/50 leading-relaxed text-sm">
                  Diagnóstico de competências em tempo real, percursos adaptativos
                  prescritos por IA e retorno formativo imediato — mantendo cada aluno
                  no centro do seu próprio desenvolvimento.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== GOVERNANÇA — Full-bleed with glass cards ========== */}
      <section className="relative py-32 sm:py-48 px-6 sm:px-12 lg:px-20 overflow-hidden">
        {/* Background image */}
        <Image
          src={IMAGES.technology}
          alt="Equipe colaborando em ambiente tecnológico"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0A2463]/80" />
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="absolute inset-0 hex-mesh opacity-[0.04] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-20">
            <p className="text-[#00B4D8] text-xs font-medium tracking-[0.3em] uppercase mb-6">
              Governança e Transparência
            </p>
            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.05] tracking-tight">
              A fundação da confiança.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Conselho Consultivo & Diretoria',
                text: 'Governança estratégica pro bono, garantindo independência, ética e alinhamento inabalável aos interesses públicos.',
                accent: '#00B4D8',
              },
              {
                num: '02',
                title: 'Coordenação Científica',
                text: 'Supervisão rigorosa de metodologias, validando a eficácia pedagógica de todas as intervenções tecnológicas implantadas.',
                accent: '#00E5A0',
              },
              {
                num: '03',
                title: 'Segurança e LGPD',
                text: 'Proteção absoluta de dados de menores de idade, com arquitetura criptografada, DPO próprio e Relatórios de Impacto contínuos.',
                accent: '#00B4D8',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15, ease }}
                className="glass rounded-2xl p-8 sm:p-10 hover:bg-white/[0.08] transition-all duration-500"
              >
                <span className="font-serif text-5xl font-light leading-none block mb-6" style={{ color: `${item.accent}30` }}>
                  {item.num}
                </span>
                <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SANTA CATARINA ========== */}
      <section className="relative py-32 sm:py-48 px-6 sm:px-12 lg:px-20 bg-[#0A2463] overflow-hidden">
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="absolute inset-0 hex-mesh opacity-[0.04] pointer-events-none" />
        {/* Ambient glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00B4D8]/[0.04] blur-[200px] rounded-full" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <p className="text-[#00B4D8] text-xs font-medium tracking-[0.3em] uppercase mb-6">
              Projeto Ativo
            </p>
            <h2 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light text-white leading-[0.9] tracking-tight mb-8">
              Santa Catarina
            </h2>
            <p className="text-lg sm:text-xl text-white/50 font-light max-w-3xl mx-auto leading-relaxed mb-20">
              Encomenda Tecnológica com a Secretaria de Estado da Educação (SED/SC) para
              desenvolvimento de plataforma educacional com IA para toda a rede pública estadual.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease }}
                className="glass-light rounded-xl py-8 px-4"
              >
                <p className="text-4xl sm:text-5xl font-serif font-light text-[#00B4D8] glow-text">{s.value}</p>
                <p className="text-[10px] text-white/40 mt-3 tracking-[0.2em] uppercase font-medium">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* ========== PARCEIROS ========== */}
      <section className="relative py-28 sm:py-40 px-6 sm:px-12 lg:px-20 bg-[#030B1A] overflow-hidden">
        <div className="absolute inset-0 noise pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-20">
            <p className="text-[#00B4D8] text-xs font-medium tracking-[0.3em] uppercase mb-6">
              Parceiros
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-white tracking-tight">
              Empresas Parceiras
            </h2>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            {partners.map((p) => {
              const inner = (
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#0A2463] flex items-center justify-center shrink-0">
                    <span className="text-[#00B4D8] font-semibold text-sm">{p.name.charAt(0)}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{p.name}</p>
                    <p className="text-xs text-white/30">{p.role}</p>
                  </div>
                  {p.url && <ExternalLink size={12} className="text-[#00B4D8]/60 ml-1 shrink-0" />}
                </div>
              );

              const cls =
                'px-6 py-4 glass-light rounded-xl hover:border-[#00B4D8]/20 transition-all duration-500';

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

      {/* ========== LEGADO — Cinematic closing ========== */}
      <section className="relative py-40 sm:py-56 px-6 overflow-hidden">
        <Image
          src={IMAGES.legacy}
          alt="Crianças em ambiente de aprendizagem"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030B1A] via-[#0A2463]/75 to-[#030B1A]/60" />
        <div className="absolute inset-0 noise pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h2
            {...fadeUp}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white leading-tight mb-10"
          >
            O nosso verdadeiro legado
          </motion.h2>
          <motion.p
            {...fadeUp}
            className="text-lg sm:text-xl text-white/60 leading-relaxed max-w-3xl mx-auto mb-14 font-serif italic"
          >
            O Instituto i10 não entrega apenas um artefato tecnológico — nós transferimos
            capacidade institucional permanente. Ao final de nossos ciclos, as redes de
            ensino alcançam autonomia plena para operar, analisar e evoluir seus sistemas.
          </motion.p>
          <motion.p
            {...fadeUp}
            className="text-2xl sm:text-3xl font-serif font-light text-[#00E5A0] glow-text-green"
          >
            A Inteligência a Serviço do Humano.
          </motion.p>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="relative bg-[#030B1A] text-white">
        <div className="gradient-divider" />
        <div className="py-20 px-6 sm:px-12 lg:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-16">
              <div>
                <p className="font-serif text-3xl font-light tracking-tight">
                  Instituto <span className="text-[#00B4D8] glow-text">i10</span>
                </p>
                <p className="text-xs text-white/30 mt-2 tracking-[0.2em] uppercase">Educação · Tecnologia · Inovação</p>
              </div>
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-3 px-7 py-3 bg-transparent border border-white/10 text-xs font-medium tracking-[0.15em] uppercase
                           hover:bg-[#00B4D8] hover:border-[#00B4D8] hover:text-[#030B1A] transition-all duration-500"
              >
                Painel de Controle
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="h-px bg-white/[0.06] mb-10" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-white/20 tracking-wide">
              <div className="flex flex-wrap gap-x-8 gap-y-1">
                <span>Sapiens Park, Florianópolis, SC — Brasil</span>
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
