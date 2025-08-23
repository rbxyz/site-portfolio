"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { Button } from "@/app/_components/ui/button";

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  link?: string;
  github?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "AllProtect",
    description: "Sistema de segurança digital avançado para proteger usuários contra estelionato online com detecção inteligente de ameaças.",
    imageUrl: "/allprotect.png",
    technologies: ["Java", "Firebase", "Javascript"],
    link: "",
  },
  {
    id: 2,
    title: "AZap",
    description: "Plataforma completa de automação de vendas e cobranças pelo WhatsApp com dashboard analítico em tempo real.",
    imageUrl: "/azap.png",
    technologies: ["ReactJS", "TailwindCSS", "Typescript"],
    link: "",
  },
  {
    id: 3,
    title: "AllPines",
    description: "Website corporativo moderno para empresa de tecnologia com portfólio de projetos e serviços integrados.",
    imageUrl: "/allpines.png",
    technologies: ["NextJS", "TailwindCSS", "Typescript"],
    link: "https://www.allpines.com.br/",
  },
  {
    id: 4,
    title: "MarcaAi | Agendamentos Inteligentes",
    description: "Plataforma Saas para prestadores de serviços.",
    imageUrl: "/",
    technologies: ["NextJS", "TailwindCSS", "TypeScript", "Drizzle"],
    link: "https://marcaaii.vercel.app/",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export function ProjetosSection() {
  return (
    <section id="projects" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Projetos em Destaque
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Uma seleção dos meus projetos mais impactantes, desenvolvidos com as mais modernas tecnologias e melhores práticas do mercado.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Overlay buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.link && (
                    <Button
                      size="sm"
                      className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 shadow-lg"
                      asChild
                    >
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {project.github && (
                    <Button
                      size="sm"
                      className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 shadow-lg"
                      asChild
                    >
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex-shrink-0">
                    {project.link ? (
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" title="Disponível" />
                    ) : (
                      <div className="h-2 w-2 bg-orange-500 rounded-full" title="Em desenvolvimento" />
                    )}
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  {project.link ? (
                    <Button
                      variant="ghost"
                      className="w-full group/btn hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      asChild
                    >
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <span className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                          Visualizar Projeto
                          <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </span>
                      </a>
                    </Button>
                  ) : (
                    <div className="text-center py-2">
                      <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                        🚧 Em desenvolvimento
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative gradient */}
              <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
            asChild
          >
            <Link href="/pages/projects">
              Ver Todos os Projetos
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Mais de 10 projetos desenvolvidos com tecnologias modernas
          </p>
        </motion.div>
      </div>
    </section>
  );
}