"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { NavBar } from "@/app/_components/nav-bar";
import { Button } from "@/app/_components/ui/button";
import { Code, Laptop, TrendingUp, Award, Coffee, Sparkles } from "lucide-react";
import { GlassCardEffect } from "@/app/_components/glass-card-effect";

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

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <NavBar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 bg-dark-bg">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-primary-500 font-mono text-sm md:text-base uppercase tracking-wider mb-4">
                  BIO
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="text-white">Sobre</span>{" "}
                  <span className="text-primary-500">Mim</span>
                </h1>
                <div className="space-y-4 text-lg text-accent-gray">
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
              
              {/* Glass Card com efeito de scroll */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center"
              >
                <GlassCardEffect>
                  <div className="h-64 w-64 mx-auto">
                    <div className="h-full w-full overflow-hidden rounded-xl border-2 border-primary-500/50">
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
        <section className="py-16 bg-dark-bg">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
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
                  <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-accent-gray text-sm md:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Skills Section - Redesenhado */}
        <section className="py-20 bg-dark-bg">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="text-primary-500 font-mono text-sm md:text-base uppercase tracking-wider mb-4">
                SKILLS
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-white">Minhas</span>{" "}
                <span className="text-primary-500">Especialidades</span>
              </h2>
              <p className="text-lg text-accent-gray max-w-2xl mx-auto">
                Tecnologias e ferramentas que domino para criar soluções completas e eficazes
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <section className="py-20 bg-dark-bg">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="text-primary-500 font-mono text-sm md:text-base uppercase tracking-wider mb-4">
                EXPERIENCE
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-white">Experiência</span>{" "}
                <span className="text-primary-500">Profissional</span>
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-8">
              {experiences.map((experience, expIndex) => (
                <motion.div
                  key={expIndex}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: expIndex * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300">
                    <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                      {experience.title}
                    </h3>
                    <div className="space-y-4">
                      {experience.positions.map((position, posIndex) => (
                        <motion.div
                          key={posIndex}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: posIndex * 0.1 }}
                          viewport={{ once: true }}
                          className="pl-4 border-l-2 border-primary-500/30"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                            <span className="text-primary-500 font-semibold">{position.company}</span>
                            <span className="text-sm text-accent-gray font-mono">{position.period}</span>
                          </div>
                          <p className="text-accent-gray text-sm">{position.description}</p>
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
        <section className="py-20 bg-dark-card border-t border-dark-border">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Vamos Trabalhar Juntos?
              </h2>
              <p className="text-xl text-accent-gray mb-8">
                Estou sempre aberto a novos desafios e oportunidades interessantes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
