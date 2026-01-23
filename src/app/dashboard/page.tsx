"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { NavBar } from "@/app/_components/nav-bar";
import { Button } from "@/app/_components/ui/button";
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon, Link as LinkIcon, Github, Star } from "lucide-react";
import Image from "next/image";

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

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    description: "",
    longDescription: "",
    imageUrl: "",
    technologies: [],
    link: "",
    github: "",
    type: "shipped",
    featured: false,
    year: new Date().getFullYear().toString(),
    status: "in-progress",
    stars: 0,
    forks: 0,
  });
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProjects();
    }
  }, [status]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      ...project,
      technologies: [...project.technologies],
    });
    setTechInput("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({
      title: "",
      description: "",
      longDescription: "",
      imageUrl: "",
      technologies: [],
      link: "",
      github: "",
      type: "shipped",
      featured: false,
      year: new Date().getFullYear().toString(),
      status: "in-progress",
      stars: 0,
      forks: 0,
    });
    setTechInput("");
  };

  const handleSave = async () => {
    try {
      const url = isCreating ? "/api/projects" : `/api/projects/${editingId}`;
      const method = isCreating ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          technologies: JSON.stringify(formData.technologies || []),
        }),
      });

      if (response.ok) {
        await fetchProjects();
        handleCancel();
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error || "Falha ao salvar projeto"}`);
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Erro ao salvar projeto");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchProjects();
      } else {
        alert("Erro ao excluir projeto");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Erro ao excluir projeto");
    }
  };

  const addTechnology = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), techInput.trim()],
      });
      setTechInput("");
    }
  };

  const removeTechnology = (index: number) => {
    const newTechs = [...(formData.technologies || [])];
    newTechs.splice(index, 1);
    setFormData({ ...formData, technologies: newTechs });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">
        <div className="text-primary-500 font-mono">Carregando...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <NavBar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-white">Gestão de</span>{" "}
              <span className="text-primary-500">Projetos</span>
            </h1>
            <p className="text-accent-gray">
              Gerencie seus projetos do portfólio
            </p>
          </div>

          <div className="mb-6">
            <Button
              onClick={() => {
                setIsCreating(true);
                setEditingId(null);
                setFormData({
                  title: "",
                  description: "",
                  longDescription: "",
                  imageUrl: "",
                  technologies: [],
                  link: "",
                  github: "",
                  type: "shipped",
                  featured: false,
                  year: new Date().getFullYear().toString(),
                  status: "in-progress",
                  stars: 0,
                  forks: 0,
                });
              }}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </div>

          {/* Formulário de criação/edição */}
          {(isCreating || editingId !== null) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-card border border-dark-border rounded-xl p-6 mb-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-white">
                {isCreating ? "Novo Projeto" : "Editar Projeto"}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Ano *
                  </label>
                  <input
                    type="text"
                    value={formData.year || ""}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Descrição *
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Descrição Longa
                  </label>
                  <textarea
                    value={formData.longDescription || ""}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    URL da Imagem
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl || ""}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Link do Projeto
                  </label>
                  <input
                    type="text"
                    value={formData.link || ""}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Link do GitHub
                  </label>
                  <input
                    type="text"
                    value={formData.github || ""}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Tipo
                  </label>
                  <select
                    value={formData.type || "shipped"}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="shipped">Shipped</option>
                    <option value="in-progress">In Progress</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Status
                  </label>
                  <select
                    value={formData.status || "in-progress"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="shipped">Shipped</option>
                    <option value="in-progress">In Progress</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured || false}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-dark-border bg-dark-surface text-primary-500 focus:ring-primary-500"
                    />
                    <span>Projeto em Destaque</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Stars
                  </label>
                  <input
                    type="number"
                    value={formData.stars || 0}
                    onChange={(e) => setFormData({ ...formData, stars: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Forks
                  </label>
                  <input
                    type="number"
                    value={formData.forks || 0}
                    onChange={(e) => setFormData({ ...formData, forks: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-white">
                    Tecnologias
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
                      placeholder="Digite uma tecnologia e pressione Enter"
                      className="flex-1 px-4 py-2 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <Button
                      type="button"
                      onClick={addTechnology}
                      className="bg-primary-500 hover:bg-primary-600 text-white"
                    >
                      Adicionar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.technologies || []).map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-dark-surface border border-dark-border text-sm text-white"
                      >
                        {tech}
                        <button
                          onClick={() => removeTechnology(index)}
                          className="hover:text-primary-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  onClick={handleSave}
                  className="bg-primary-500 hover:bg-primary-600 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-dark-border text-accent-gray hover:border-primary-500 hover:text-primary-500"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}

          {/* Lista de Projetos */}
          <div className="grid gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-card border border-dark-border rounded-xl p-6"
              >
                {editingId === project.id ? null : (
                  <div className="flex flex-col md:flex-row gap-6">
                    {project.imageUrl && (
                      <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden bg-dark-surface flex-shrink-0">
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-accent-gray mb-2">
                            <span>{project.year}</span>
                            <span className={`px-2 py-1 rounded ${
                              project.status === "shipped" ? "bg-green-500/20 text-green-500" :
                              project.status === "in-progress" ? "bg-yellow-500/20 text-yellow-500" :
                              "bg-gray-500/20 text-gray-500"
                            }`}>
                              {project.status}
                            </span>
                            {project.featured && (
                              <span className="px-2 py-1 rounded bg-primary-500/20 text-primary-500">
                                <Star className="h-3 w-3 inline mr-1" />
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEdit(project)}
                            size="sm"
                            className="bg-primary-500/20 hover:bg-primary-500/30 text-primary-500 border border-primary-500/50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(project.id)}
                            size="sm"
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-accent-gray mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded text-xs bg-dark-surface border border-dark-border text-accent-gray"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4 text-sm">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary-500 hover:text-primary-400"
                          >
                            <LinkIcon className="h-4 w-4" />
                            Live
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-accent-gray hover:text-primary-500"
                          >
                            <Github className="h-4 w-4" />
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {projects.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-accent-gray text-lg">Nenhum projeto encontrado</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
