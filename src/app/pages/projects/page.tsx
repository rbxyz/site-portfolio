"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { NavBar } from "@/app/_components/nav-bar";
import { motion } from "framer-motion";
import { ExternalLink, Github, Star } from "lucide-react";
import { CanvasMouseEffect } from "@/app/_components/canvas-mouse-effect";

// Definindo o tipo do projeto
interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string | null;
  imageUrl: string | null;
  technologies: string[];
  link: string | null;
  github: string | null;
  type: string;
  featured: boolean;
  year: string;
  status: string;
  stars: number;
  forks: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = (await response.json()) as Project[];
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchProjects();
  }, []);

  // Filtrando os projetos com base no status selecionado
  const filteredProjects = projects.filter(
    (project) => selectedStatus === "All" || project.status === selectedStatus
  );

  // Separando projetos em destaque e outros
  const featuredProjects = filteredProjects.filter((project) => project.featured);
  const otherProjects = filteredProjects.filter((project) => !project.featured);

  // Ordenando os projetos: primeiro os em destaque, depois os outros
  const sortedProjects = [...featuredProjects, ...otherProjects].sort((a, b) => {
    return parseInt(b.year) - parseInt(a.year);
  });

  const filterButtons = [
    { key: "All", label: "ALL" },
    { key: "shipped", label: "SHIPPED" },
    { key: "in-progress", label: "IN-PROGRESS" },
    { key: "archived", label: "ARCHIVED" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">
        <div className="text-primary-500 font-mono">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">
        <div className="text-red-500 font-mono">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <CanvasMouseEffect />
      <NavBar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="text-primary-500 font-mono text-sm md:text-base uppercase tracking-wider mb-4">
              ARTIFACTS
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Open Source</span>
              <br />
              <span className="text-primary-500">Projects</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap gap-4">
            {filterButtons.map((button) => (
              <button
                key={button.key}
                onClick={() => setSelectedStatus(button.key)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  selectedStatus === button.key
                    ? "bg-primary-500 text-dark-bg"
                    : "bg-dark-card border border-dark-border text-accent-gray hover:border-primary-500/50 hover:text-primary-500"
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {sortedProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-accent-gray text-lg">No projects found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  featured={project.featured}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Componente ProjectCard
function ProjectCard({
  project,
  index: _index,
  featured = false,
}: {
  project: Project;
  index: number;
  featured?: boolean;
}) {
  const imageUrl = project.imageUrl ?? "/placeholder.png";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shipped":
        return "bg-green-500";
      case "in-progress":
        return "bg-yellow-500";
      case "archived":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className={`group relative bg-dark-card border rounded-lg overflow-hidden transition-all duration-300 ${
        featured
          ? "border-primary-500/50 md:col-span-2 lg:col-span-1"
          : "border-dark-border hover:border-primary-500/50"
      }`}
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-primary-500 text-dark-bg px-3 py-1 rounded-full text-xs font-semibold">
          <Star className="h-3 w-3 fill-current" />
          FEATURED
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${getStatusColor(project.status)}`}
        />
        <span className="text-xs text-accent-gray uppercase font-mono">
          {project.status}
        </span>
      </div>

      {/* Project Image */}
      <div className={`relative overflow-hidden ${featured ? "h-64" : "h-48"} bg-dark-surface`}>
        {imageUrl && imageUrl !== "/placeholder.png" ? (
          <Image
            src={imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-dark-surface">
            <div className="text-accent-gray/30">
              <svg
                className="w-16 h-16"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="text-xs text-accent-gray font-mono mb-2">
            {project.year}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-500 transition-colors">
          {project.title}
        </h3>

        <p className="text-accent-gray mb-4 text-sm leading-relaxed">
          {featured && project.longDescription
            ? project.longDescription
            : project.description}
        </p>

        {/* Stats */}
        {(project.stars > 0 || project.forks > 0) && (
          <div className="flex items-center gap-4 mb-4 text-sm text-accent-gray">
            {project.stars > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>{project.stars}</span>
              </div>
            )}
            {project.forks > 0 && (
              <div className="flex items-center gap-1">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                </svg>
                <span>{project.forks}</span>
              </div>
            )}
          </div>
        )}

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, featured ? 5 : 3).map((tech, techIndex) => (
            <span
              key={techIndex}
              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-dark-surface border border-dark-border text-accent-gray hover:border-primary-500/50 hover:text-primary-500 transition-colors cursor-pointer"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > (featured ? 5 : 3) && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-dark-surface border border-dark-border text-accent-gray">
              +{project.technologies.length - (featured ? 5 : 3)}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 pt-4 border-t border-dark-border">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-accent-gray hover:text-primary-500 transition-colors text-sm"
            >
              <Github className="h-4 w-4" />
              <span>source</span>
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary-500 hover:text-primary-400 transition-colors text-sm font-semibold"
            >
              <ExternalLink className="h-4 w-4" />
              <span>live</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
