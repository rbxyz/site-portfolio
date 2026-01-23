"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { Button } from "@/app/_components/ui/button";

interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string | null;
  imageUrl: string | null;
  technologies: string[];
  link: string | null;
  github: string | null;
  featured: boolean;
}

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects?featured=true");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = (await response.json()) as Project[];
        // Pegar apenas os 3 primeiros projetos em destaque
        setProjects(data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-24 bg-dark-bg relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center text-primary-500 font-mono">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 bg-dark-bg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="text-primary-500 font-mono text-sm md:text-base uppercase tracking-wider mb-4">
            PORTFOLIO
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Projetos em</span>{" "}
            <span className="text-primary-500">Destaque</span>
          </h2>
          <p className="text-lg text-accent-gray max-w-2xl mx-auto">
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
              className="group relative bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all duration-500"
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden bg-dark-surface">
                {project.imageUrl && project.imageUrl !== "/" ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-accent-gray/30">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Overlay buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.link && (
                    <Button
                      size="sm"
                      className="bg-dark-card/90 hover:bg-dark-card border border-dark-border text-white rounded-full p-2 shadow-lg"
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
                      className="bg-dark-card/90 hover:bg-dark-card border border-dark-border text-white rounded-full p-2 shadow-lg"
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
                  <h3 className="text-xl font-bold text-white group-hover:text-primary-500 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex-shrink-0">
                    {project.link ? (
                      <div className="h-2 w-2 bg-primary-500 rounded-full animate-pulse" title="Disponível" />
                    ) : (
                      <div className="h-2 w-2 bg-yellow-500 rounded-full" title="Em desenvolvimento" />
                    )}
                  </div>
                </div>

                <p className="text-accent-gray mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-dark-surface border border-dark-border text-accent-gray hover:border-primary-500/50 hover:text-primary-500 transition-colors cursor-pointer"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-dark-surface border border-dark-border text-accent-gray">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                {/* Action Button */}
                <div className="pt-2 border-t border-dark-border">
                  {project.link ? (
                    <Button
                      variant="ghost"
                      className="w-full group/btn hover:bg-dark-surface"
                      asChild
                    >
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <span className="flex items-center justify-center gap-2 text-primary-500">
                          Visualizar Projeto
                          <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </span>
                      </a>
                    </Button>
                  ) : (
                    <div className="text-center py-2">
                      <span className="text-sm text-yellow-500 font-medium">
                        🚧 Em desenvolvimento
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative gradient */}
              <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
            className="bg-transparent border-2 border-primary-500 text-white hover:bg-primary-500 hover:text-dark-bg px-8 py-4 rounded-lg font-semibold transition-all duration-300 group"
            asChild
          >
            <Link href="/pages/projects">
              Ver Todos os Projetos
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-accent-gray">
            Mais de 10 projetos desenvolvidos com tecnologias modernas
          </p>
        </motion.div>
      </div>
    </section>
  );
}
