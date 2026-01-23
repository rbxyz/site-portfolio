"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { NavBar } from "@/app/_components/nav-bar";
import { Button } from "@/app/_components/ui/button";
import { Code, Laptop, TrendingUp, Award, Coffee, Sparkles } from "lucide-react";
import { GlassCardEffect } from "@/app/_components/glass-card-effect";
import { ProfileCanvasEffect } from "@/app/_components/profile-canvas-effect";
import { useState, useEffect } from "react";

const skills = [
  { 
    name: "Frontend", 
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"], 
    icon: Code,
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400"
  },
  { 
    name: "Backend", 
    technologies: ["Node.js", "Python", "Java", "Firebase"], 
    icon: Laptop,
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400"
  },
  { 
    name: "Marketing Digital", 
    technologies: ["Google Ads", "Facebook Ads", "Analytics", "SEO"], 
    icon: TrendingUp,
    color: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-400"
  },
  { 
    name: "Ferramentas", 
    technologies: ["Git", "Figma", "Photoshop", "Prisma"], 
    icon: Award,
    color: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-400"
  },
];

const experiences = [
  {
    title: "Especialista em Tráfego Pago",
    positions: [
      {
        company: "Projetos diversos",
        period: "2021 - 2024",
        description: "Gestão de campanhas de tráfego pago com foco em ROI e conversões para diferentes nichos de mercado.",
      },
      {
        company: "CantuStange | Zada",
        period: "2024 - Presente",
        description: "Gestão estratégica de campanhas de tráfego pago e otimização de conversões.",
      },
    ],
  },
  {
    title: "Desenvolvedor Full Stack & Growth Hacker",
    positions: [
      {
        company: "Projetos diversos",
        period: `2023 - ${new Date().getFullYear()}`,
        description: "Desenvolvimento de soluções web completas e estratégias de crescimento digital para diversos clientes.",
      },
    ],
  },
  {
    title: "Desenvolvedor Full Stack & Analista de dados",
    positions: [
      {
        company: "Box Distribuidor",
        period: `2025 - ${new Date().getFullYear()}`,
        description: "Desenvolvimento de sistemas e análise de dados para otimização de processos.",
      },
    ],
  },
];

const startups = [
  {
    name: "MarcaAI | Agendamentos Inteligentes",
    year: "2025",
    description: "Plataforma SaaS para agendamentos inteligentes com IA",
  },
  {
    name: "Ethos | Gestão de projetos",
    year: "2026",
    description: "Sistema completo de gestão de projetos e tempo",
  },
  {
    name: "???",
    year: "???",
    description: "Em breve...",
  },
];

// Calcular anos de experiência dinamicamente
const startYear = 2022;
const currentYear = new Date().getFullYear();
const yearsOfExperience = currentYear - startYear;

const stats = [
  { number: "20+", label: "Projetos Concluídos" },
  { number: `${yearsOfExperience}+`, label: "Anos de Experiência" },
  { number: "15+", label: "Clientes Satisfeitos" },
  { number: "5+", label: "Tecnologias Dominadas" },
];

// Componente de typing diferente - palavras aparecendo uma por vez
function WordTypingText({ 
  words, 
  className 
}: { 
  words: string[]; 
  className?: string;
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedWord, setDisplayedWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentWord = words[currentWordIndex] ?? "";
    const typingSpeed = isDeleting ? 30 : 80; // Mais rápido ao deletar
    const pauseTime = isDeleting ? 300 : 1500; // Pausa após completar palavra

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentWord.length) {
        // Digitando palavra
        setDisplayedWord(currentWord.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (!isDeleting && charIndex === currentWord.length) {
        // Palavra completa, aguardar antes de deletar
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && charIndex > 0) {
        // Deletando palavra
        setDisplayedWord(currentWord.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (isDeleting && charIndex === 0) {
        // Palavra deletada, ir para próxima
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setDisplayedWord("");
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentWordIndex, words]);

  return (
    <span className={className}>
      {displayedWord}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <NavBar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 md:py-20 bg-dark-bg">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <div className="text-primary-500 font-mono text-xs sm:text-sm md:text-base uppercase tracking-wider mb-3 sm:mb-4">
                  BIO
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                  <span className="text-white">Sobre</span>{" "}
                  <span className="text-primary-500">
                    <WordTypingText 
                      words={["Mim", "Desenvolvimento", "Tecnologia", "Inovação"]} 
                    />
                  </span>
                </h1>
                <div className="space-y-3 sm:space-y-4 text-base sm:text-lg text-accent-gray">
                  <p>
                    Olá! Sou <strong className="text-primary-500">Ruan Bueno</strong>, 
                    um desenvolvedor apaixonado por tecnologia e por criar soluções que fazem a diferença.
                  </p>
                  <p>
                    Combino habilidades técnicas de desenvolvimento web com expertise em marketing digital, 
                    oferecendo uma perspectiva única que conecta tecnologia e negócios.
                  </p>
                  <p>
                    Minha missão é transformar ideias em produtos digitais que não apenas funcionam perfeitamente, 
                    mas também geram resultados reais para meus clientes.
                  </p>
                </div>
              </motion.div>
              
              {/* Glass Card com efeito de scroll e Canvas */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center order-first lg:order-last mb-8 lg:mb-0"
              >
                <GlassCardEffect>
                  <div className="relative h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 mx-auto">
                    {/* Canvas Effect */}
                    <ProfileCanvasEffect />
                    <div className="relative h-full w-full overflow-hidden rounded-xl border-2 sm:border-4 border-primary-500/50 z-20">
                      <Image
                        src="/Foto_Perfil.jpg"
                        alt="Ruan Bueno"
                        width={300}
                        height={300}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="flex justify-center gap-3">
                      <Coffee className="h-5 w-5 text-primary-500" />
                      <span className="text-sm text-accent-gray">
                        Powered by coffee ☕
                      </span>
                    </div>
                  </div>
                </GlassCardEffect>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 sm:py-16 bg-dark-bg">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-500 mb-1 sm:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-accent-gray text-xs sm:text-sm md:text-base px-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Skills Section - Redesenhado */}
        <section className="py-12 sm:py-16 md:py-20 bg-dark-bg">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12"
            >
              <div className="text-primary-500 font-mono text-xs sm:text-sm md:text-base uppercase tracking-wider mb-3 sm:mb-4">
                SKILLS
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                <span className="text-white">Minhas</span>{" "}
                <span className="text-primary-500">Especialidades</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-accent-gray max-w-2xl mx-auto px-2">
                Tecnologias e ferramentas que domino para criar soluções completas e eficazes
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300 overflow-hidden"
                >
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Sparkle effect */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className={`h-4 w-4 ${skill.iconColor} animate-pulse`} />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${skill.color} border border-primary-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <skill.icon className={`h-6 w-6 ${skill.iconColor}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-white ml-3">{skill.name}</h3>
                    </div>
                    <div className="space-y-2">
                      {skill.technologies.map((tech, techIndex) => (
                        <motion.div
                          key={techIndex}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                          viewport={{ once: true }}
                          className="text-sm text-accent-gray bg-dark-surface border border-dark-border px-3 py-1 rounded-full inline-block mr-2 mb-2 hover:border-primary-500/50 hover:text-primary-500 transition-colors cursor-pointer group-hover:bg-dark-card"
                        >
                          {tech}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section - Redesenhado */}
        <section className="py-12 sm:py-16 md:py-20 bg-dark-bg">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-12"
            >
              <div className="text-primary-500 font-mono text-xs sm:text-sm md:text-base uppercase tracking-wider mb-3 sm:mb-4">
                EXPERIENCE
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                <span className="text-white">Experiência</span>{" "}
                <span className="text-primary-500">Profissional</span>
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
              {experiences.map((experience, expIndex) => (
                <motion.div
                  key={expIndex}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: expIndex * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-dark-card border border-dark-border rounded-xl p-4 sm:p-6 hover:border-primary-500/50 transition-all duration-300">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse flex-shrink-0" />
                      <span>{experience.title}</span>
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {experience.positions.map((position, posIndex) => (
                        <motion.div
                          key={posIndex}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: posIndex * 0.1 }}
                          viewport={{ once: true }}
                          className="pl-3 sm:pl-4 border-l-2 border-primary-500/30"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 sm:mb-2 gap-1">
                            <span className="text-primary-500 font-semibold text-sm sm:text-base">{position.company}</span>
                            <span className="text-xs sm:text-sm text-accent-gray font-mono">{position.period}</span>
                          </div>
                          <p className="text-accent-gray text-xs sm:text-sm">{position.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Startups Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300">
                  <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary-500" />
                    Startupeiro
                  </h3>
                  <div className="text-primary-500 font-mono text-sm mb-4">Lançamentos:</div>
                  <div className="space-y-3">
                    {startups.map((startup, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-between p-3 bg-dark-surface rounded-lg border border-dark-border hover:border-primary-500/50 transition-colors"
                      >
                        <div>
                          <div className="text-white font-semibold">{startup.name}</div>
                          <div className="text-accent-gray text-sm">{startup.description}</div>
                        </div>
                        <div className="text-primary-500 font-mono text-sm">{startup.year}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-dark-card border-t border-dark-border">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                Vamos Trabalhar Juntos?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-accent-gray mb-6 sm:mb-8 px-2">
                Estou sempre aberto a novos desafios e oportunidades interessantes
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button size="lg" className="bg-transparent border-2 border-primary-500 text-white hover:bg-primary-500 hover:text-dark-bg">
                  <a href="/contato">Entre em Contato</a>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border border-dark-border text-accent-gray hover:border-primary-500/50 hover:text-primary-500">
                  <a href="/cv.pdf" download>Download CV</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
