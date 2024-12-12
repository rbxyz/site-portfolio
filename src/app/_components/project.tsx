"use client";

import Image from "next/image";

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  link?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "AllProtect | Software",
    description: "Um sistema de segurança digital para proteger usuários contra estelionato online.",
    imageUrl: "/allprotect.png",
    technologies: ["Java", "Firebase", "Javascript"],
    link: "",
  },
  {
    id: 2,
    title: "AZap | Web application",
    description: "Plataforma de automação de vendas e cobranças pelo WhatsApp.",
    imageUrl: "/azap.png",
    technologies: ["ReactJS", "TailwindCSS", "Typescript"],
    link: "",
  },
  {
    id: 3,
    title: "AllPines | Web site",
    description: "Web site para a empresa AllPines, contendo projetos e serviços.", 
    imageUrl: "/allpines.png",
    technologies: ["NextJS", "TailwindCSS", "Typescript"],
    link: "https://www.allpines.com.br/", 
  },
];

export function ProjetosSection() {
  return (
    <section className="py-20 bg-gray-800 text-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Projetos em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-700 rounded-lg shadow-lg overflow-hidden"
            >
              <Image
                src={project.imageUrl}
                alt={project.title}
                width={600}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-100">
                  {project.title}
                </h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-600 text-gray-200 rounded px-2 py-1 text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  {/* Condicional para verificar se há link */}
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
    </section>
  );
}
