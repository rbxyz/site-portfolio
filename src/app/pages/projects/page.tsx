"use client";

import { useState } from "react";
import Image from "next/image";
import { NavBar } from "@/app/_components/nav-bar";

// Definindo o tipo do projeto
interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  link?: string;
  type: string
}

// Array de projetos
const allProjects: Project[] = [
  {
    id: 1,
    title: "AllProtect | Software",
    description: "Um sistema de segurança digital para proteger usuários contra estelionato online.",
    imageUrl: "/allprotect.png",
    technologies: ["Java", "Firebase", "Javascript"],
    link: "",
    type: "Software",
  },
  {
    id: 2,
    title: "AZap | Web application",
    description: "Plataforma de automação de vendas e cobranças pelo WhatsApp.",
    imageUrl: "/azap.png",
    technologies: ["ReactJS", "TailwindCSS", "Typescript"],
    link: "",
    type: "Web",
  },
  {
    id: 3,
    title: "AllPines | Web site",
    description: "Web site para a empresa AllPines, contendo projetos e serviços.",
    imageUrl: "/allpines.png",
    technologies: ["NextJS", "TailwindCSS", "Typescript"],
    link: "https://www.allpines.com.br/",
    type: "Web",
  },
  {
    id: 4,
    title: "Another Software | Software",
    description: "Um sistema inovador para otimizar a gestão de dados.",
    imageUrl: "/another-software.png",
    technologies: ["Python", "Django", "PostgreSQL"],
    link: "",
    type: "Software",
  },
  // Adicione mais projetos aqui
];

export default function ProjectsPage() {
  const [selectedType, setSelectedType] = useState<string>("All");

  // Filtrando os projetos com base no tipo selecionado
  const filteredProjects =
    selectedType === "All"
      ? allProjects
      : allProjects.filter((project) => project.type === selectedType);

  return (
    <div className="min-h-screen bg-background text-foreground">
            <NavBar />
      <div className="container mx-auto px-4 md:px-6 py-20">
        <h1 className="text-4xl font-bold text-center mb-8">Todos os Projetos</h1>

        {/* Filtro por tipo de projeto */}
        <div className="mb-6 text-center">
          <button
            onClick={() => setSelectedType("All")}
            className={`px-4 py-2 rounded-lg mr-4 ${selectedType === "All" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} transition`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedType("Web")}
            className={`px-4 py-2 rounded-lg mr-4 ${selectedType === "Web" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} transition`}
          >
            Web
          </button>
          <button
            onClick={() => setSelectedType("Software")}
            className={`px-4 py-2 rounded-lg ${selectedType === "Software" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} transition`}
          >
            Software
          </button>
        </div>

        {/* Lista de projetos filtrados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-gray-700 rounded-lg shadow-lg overflow-hidden">
              <Image
                src={project.imageUrl}
                alt={project.title}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-100">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="inline-block bg-gray-600 text-gray-200 rounded px-2 py-1 text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 transition duration-300"
                    >
                      Ver o Projeto
                    </a>
                  ) : (
                    <span className="text-gray-500">Em breve</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}