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
  type: string;
}

// Array de projetos
const allProjects: Project[] = [
  {
    id: 1,
    title: "AllProtect | Software",
    description:
      "Um sistema de segurança digital para proteger usuários contra estelionato online.",
    imageUrl: "/allprotect.png",
    technologies: ["Java", "Firebase", "Javascript"],
    link: "",
    type: "Software",
  },
  {
    id: 2,
    title: "AZap | Website",
    description: "Plataforma de automação de vendas e cobranças pelo WhatsApp.",
    imageUrl: "/azap.png",
    technologies: ["ReactJS", "TailwindCSS", "Typescript"],
    link: "",
    type: "Web",
  },
  {
    id: 3,
    title: "AllPines | Website",
    description:
      "Website para a empresa AllPines, contendo projetos e serviços.",
    imageUrl: "/allpines.png",
    technologies: ["NextJS", "TailwindCSS", "Typescript"],
    link: "https://www.allpines.com.br/",
    type: "Web",
  },
  {
    id: 4,
    title: "LuxWatch | Website",
    description:
      "Website para empresas de Relojoarias, contendo itens e coleções.",
    imageUrl: "/luxwatch.png",
    technologies: ["NextJS", "TailwindCSS", "Typescript"],
    link: "https://watchwebpage.netlify.app/",
    type: "Web",
  },
  {
    id: 5,
    title: "Law and Order | Website",
    description:
      "Website para empresas de advocacia ou advogados, contendo um formulário de contato e descrições.",
    imageUrl: "/lawandorder.png",
    technologies: ["ReactJs", "TailwindCSS", "Typescript"],
    link: "",
    type: "Web",
  },
  /*
  {
    id: 6,
    title: "Rubik | Blog",
    description:
      "Website para inscrição de editais, contendo um formulário de inscrição e descrições.",
    imageUrl: "/RubikD3v.png",
    technologies: ["ReactNative", "TailwindCSS", "Typescript"],
    link: "",
    type: "Web",
  },
  */
];

export default function ProjectsPage() {
  const [selectedType, setSelectedType] = useState<string>("All");

  // Filtrando os projetos com base no tipo selecionado
  const filteredProjects =
    selectedType === "All"
      ? allProjects
      : allProjects.filter((project) => project.type === selectedType);

  // Ordenando os projetos: primeiro os disponíveis, depois os não disponíveis
  const sortedProjects = filteredProjects.sort((a, b) => {
    if (a.link && !b.link) {
      return -1; // Coloca 'a' antes de 'b' se 'a' tiver link e 'b' não tiver
    }
    if (!a.link && b.link) {
      return 1; // Coloca 'b' antes de 'a' se 'b' tiver link e 'a' não tiver
    }
    return 0; // Se ambos tiverem ou não link, não altera a ordem
  });

  return (
    <div className="bg-background text-foreground min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 py-20 md:px-6">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Todos os Projetos
        </h1>

        {/* Filtro por tipo de projeto */}
        <div className="mb-6 text-center">
          <button
            onClick={() => setSelectedType("All")}
            className={`mr-4 rounded-lg px-4 py-2 ${selectedType === "All" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} transition`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedType("Web")}
            className={`mr-4 rounded-lg px-4 py-2 ${selectedType === "Web" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} transition`}
          >
            Web
          </button>
          <button
            onClick={() => setSelectedType("Software")}
            className={`rounded-lg px-4 py-2 ${selectedType === "Software" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"} transition`}
          >
            Software
          </button>
        </div>

        {/* Lista de projetos filtrados e ordenados */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedProjects.map((project) => (
            <div
              key={project.id}
              className="overflow-hidden rounded-lg bg-gray-700 shadow-lg"
            >
              <Image
                src={project.imageUrl}
                alt={project.title}
                width={600}
                height={400}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold text-gray-100">
                  {project.title}
                </h3>
                <p className="mb-4 text-gray-300">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-block rounded bg-gray-600 px-2 py-1 text-sm text-gray-200"
                    >
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
                      className="text-blue-500 transition duration-300 hover:text-blue-700"
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
