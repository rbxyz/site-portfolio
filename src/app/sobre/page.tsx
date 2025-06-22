"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { NavBar } from "@/app/_components/nav-bar";
import { Button } from "@/app/_components/ui/button";
import { Code, Laptop, TrendingUp, Award, Coffee } from "lucide-react";

const skills = [
  { name: "Frontend", technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"], icon: Code },
  { name: "Backend", technologies: ["Node.js", "Python", "Java", "Firebase"], icon: Laptop },
  { name: "Marketing Digital", technologies: ["Google Ads", "Facebook Ads", "Analytics", "SEO"], icon: TrendingUp },
  { name: "Ferramentas", technologies: ["Git", "Figma", "Photoshop", "Prisma"], icon: Award },
];

const experiences = [
  {
    title: "Desenvolvedor Full Stack & Growth Hacker",
    company: "Freelancer",
    period: "2022 - Presente",
    description: "Desenvolvimento de soluções web completas e estratégias de crescimento digital para diversos clientes.",
  },
  {
    title: "Especialista em Tráfego Pago",
    company: "Projetos Diversos",
    period: "2021 - Presente",
    description: "Gestão de campanhas de tráfego pago com foco em ROI e conversões para diferentes nichos de mercado.",
  },
];

const stats = [
  { number: "20+", label: "Projetos Concluídos" },
  { number: "3+", label: "Anos de Experiência" },
  { number: "15+", label: "Clientes Satisfeitos" },
  { number: "5+", label: "Tecnologias Dominadas" },
];

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Sobre Mim
                  </span>
                </h1>
                <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300">
                  <p>
                    Olá! Sou <strong className="text-blue-600 dark:text-blue-400">Ruan Bueno</strong>, 
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
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-600 rounded-2xl blur opacity-30 animate-pulse"></div>
                  <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                    <div className="h-64 w-64 mx-auto">
                      <Image
                        src="/Foto_Perfil.jpg"
                        alt="Ruan Bueno"
                        width={300}
                        height={300}
                        className="h-full w-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <div className="flex justify-center gap-3">
                        <Coffee className="h-5 w-5 text-amber-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Powered by coffee ☕
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Minhas Especialidades
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
                  className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4">
                    <skill.icon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                    <h3 className="text-lg font-semibold">{skill.name}</h3>
                  </div>
                  <div className="space-y-2">
                    {skill.technologies.map((tech, techIndex) => (
                      <div
                        key={techIndex}
                        className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full inline-block mr-2 mb-2"
                      >
                        {tech}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Experiência Profissional
                </span>
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              {experiences.map((experience, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative pl-8 pb-8 border-l-2 border-blue-200 dark:border-blue-800 last:border-l-0"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2">{experience.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">{experience.company}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{experience.period}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{experience.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
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
              <p className="text-xl text-blue-100 mb-8">
                Estou sempre aberto a novos desafios e oportunidades interessantes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <a href="/contato">Entre em Contato</a>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
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