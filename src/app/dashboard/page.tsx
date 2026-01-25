"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { NavBar } from "@/app/_components/nav-bar";
import { Button } from "@/app/_components/ui/button";
import { Modal } from "@/app/_components/modal";
import { Plus, Edit, Trash2, Save, X, Link as LinkIcon, Github, Star, Settings, Upload, Image as ImageIcon } from "lucide-react";
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

interface ProjectStatus {
  id: number;
  key: string;
  label: string;
}

interface ProjectType {
  id: number;
  key: string;
  label: string;
}

export default function DashboardPage() {
  const { status } = useSession();
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
    type: "",
    featured: false,
    year: new Date().getFullYear().toString(),
    status: "",
    stars: 0,
    forks: 0,
  });
  const [techInput, setTechInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  
  // Estados para gestão de status e tipos
  const [statuses, setStatuses] = useState<ProjectStatus[]>([]);
  const [types, setTypes] = useState<ProjectType[]>([]);
  const [showStatusManagement, setShowStatusManagement] = useState(false);
  const [showTypeManagement, setShowTypeManagement] = useState(false);
  const [editingStatusId, setEditingStatusId] = useState<number | null>(null);
  const [editingTypeId, setEditingTypeId] = useState<number | null>(null);
  const [statusForm, setStatusForm] = useState({ key: "", label: "" });
  const [typeForm, setTypeForm] = useState({ key: "", label: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      void fetchProjects();
      void fetchStatuses();
      void fetchTypes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = (await response.json()) as Project[];
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await fetch("/api/status");
      if (response.ok) {
        const data = (await response.json()) as ProjectStatus[];
        setStatuses(data);
        // Se não houver status selecionado e houver status disponíveis, usar o primeiro
        if (!formData.status && data.length > 0) {
          setFormData((prev) => ({ ...prev, status: data[0]!.key }));
        }
      }
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await fetch("/api/types");
      if (response.ok) {
        const data = (await response.json()) as ProjectType[];
        setTypes(data);
        // Se não houver tipo selecionado e houver tipos disponíveis, usar o primeiro
        if (!formData.type && data.length > 0) {
          setFormData((prev) => ({ ...prev, type: data[0]!.key }));
        }
      }
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      ...project,
      technologies: [...project.technologies],
    });
    setTechInput("");
    // Resetar estados de imagem
    setImagePreview(project.imageUrl ?? null);
    setSelectedImageFile(null);
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
      type: types[0]?.key ?? "",
      featured: false,
      year: new Date().getFullYear().toString(),
      status: statuses[0]?.key ?? "",
      stars: 0,
      forks: 0,
    });
    setTechInput("");
    setImagePreview(null);
    setSelectedImageFile(null);
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
          technologies: JSON.stringify(formData.technologies ?? []),
        }),
      });

      if (response.ok) {
        await fetchProjects();
        handleCancel();
      } else {
        const error = (await response.json()) as { error?: string };
        alert(`Erro: ${error.error ?? "Falha ao salvar projeto"}`);
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
        technologies: [...(formData.technologies ?? []), techInput.trim()],
      });
      setTechInput("");
    }
  };

  const removeTechnology = (index: number) => {
    const newTechs = [...(formData.technologies ?? [])];
    newTechs.splice(index, 1);
    setFormData({ ...formData, technologies: newTechs });
  };

  // Funções para gestão de status
  const handleSaveStatus = async () => {
    try {
      const url = editingStatusId ? `/api/status/${editingStatusId}` : "/api/status";
      const method = editingStatusId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statusForm),
      });

      if (response.ok) {
        await fetchStatuses();
        setStatusForm({ key: "", label: "" });
        setEditingStatusId(null);
      } else {
        const error = (await response.json()) as { error?: string };
        alert(`Erro: ${error.error ?? "Falha ao salvar status"}`);
      }
    } catch (error) {
      console.error("Error saving status:", error);
      alert("Erro ao salvar status");
    }
  };

  const handleDeleteStatus = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este status?")) return;

    try {
      const response = await fetch(`/api/status/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchStatuses();
      } else {
        const error = (await response.json()) as { error?: string };
        alert(`Erro: ${error.error ?? "Falha ao excluir status"}`);
      }
    } catch (error) {
      console.error("Error deleting status:", error);
      alert("Erro ao excluir status");
    }
  };

  const handleEditStatus = (status: ProjectStatus) => {
    setEditingStatusId(status.id);
    setStatusForm({ key: status.key, label: status.label });
  };

  // Funções para gestão de tipos
  const handleSaveType = async () => {
    try {
      const url = editingTypeId ? `/api/types/${editingTypeId}` : "/api/types";
      const method = editingTypeId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(typeForm),
      });

      if (response.ok) {
        await fetchTypes();
        setTypeForm({ key: "", label: "" });
        setEditingTypeId(null);
      } else {
        const error = (await response.json()) as { error?: string };
        alert(`Erro: ${error.error ?? "Falha ao salvar tipo"}`);
      }
    } catch (error) {
      console.error("Error saving type:", error);
      alert("Erro ao salvar tipo");
    }
  };

  const handleDeleteType = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este tipo?")) return;

    try {
      const response = await fetch(`/api/types/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchTypes();
      } else {
        const error = (await response.json()) as { error?: string };
        alert(`Erro: ${error.error ?? "Falha ao excluir tipo"}`);
      }
    } catch (error) {
      console.error("Error deleting type:", error);
      alert("Erro ao excluir tipo");
    }
  };

  const handleEditType = (type: ProjectType) => {
    setEditingTypeId(type.id);
    setTypeForm({ key: type.key, label: type.label });
  };

  // Funções para upload de imagem
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Tipo de arquivo inválido. Apenas JPEG, PNG e WebP são permitidos.");
      return;
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("O tamanho do arquivo excede o limite de 5MB.");
      return;
    }

    setSelectedImageFile(file);

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!selectedImageFile) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", selectedImageFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = (await response.json()) as { imageUrl: string };
        setFormData({ ...formData, imageUrl: data.imageUrl });
        setSelectedImageFile(null);
        alert("Imagem enviada com sucesso!");
      } else {
        const error = (await response.json()) as { error?: string };
        alert(`Erro ao enviar imagem: ${error.error ?? "Falha no upload"}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Erro ao enviar imagem");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageUrl: "" });
    setImagePreview(null);
    setSelectedImageFile(null);
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

          <div className="mb-6 flex flex-wrap gap-3">
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
                  type: types[0]?.key ?? "",
                  featured: false,
                  year: new Date().getFullYear().toString(),
                  status: statuses[0]?.key ?? "",
                  stars: 0,
                  forks: 0,
                });
                setTechInput("");
                setImagePreview(null);
                setSelectedImageFile(null);
              }}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
            <Button
              onClick={() => {
                setShowStatusManagement(!showStatusManagement);
                setShowTypeManagement(false);
              }}
              variant="outline"
              className="border-dark-border text-accent-gray hover:border-primary-500 hover:text-primary-500"
            >
              <Settings className="h-4 w-4 mr-2" />
              Gerenciar Status
            </Button>
            <Button
              onClick={() => {
                setShowTypeManagement(!showTypeManagement);
                setShowStatusManagement(false);
              }}
              variant="outline"
              className="border-dark-border text-accent-gray hover:border-primary-500 hover:text-primary-500"
            >
              <Settings className="h-4 w-4 mr-2" />
              Gerenciar Tipos
            </Button>
          </div>

          {/* Gestão de Status */}
          {showStatusManagement && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Gerenciar Status</h2>
                <span className="text-accent-gray text-sm">
                  {statuses.length} {statuses.length === 1 ? "status" : "status"}
                </span>
              </div>

              {/* Formulário de criação/edição */}
              <div className="bg-dark-surface border border-dark-border rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  {editingStatusId ? "Editar Status" : "Criar Novo Status"}
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Key (ex: in-progress) *
                    </label>
                    <input
                      type="text"
                      value={statusForm.key}
                      onChange={(e) => setStatusForm({ ...statusForm, key: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-bg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="in-progress"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Label (ex: IN-PROGRESS) *
                    </label>
                    <input
                      type="text"
                      value={statusForm.label}
                      onChange={(e) => setStatusForm({ ...statusForm, label: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-bg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="IN-PROGRESS"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveStatus}
                    className="bg-primary-500 hover:bg-primary-600 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingStatusId ? "Atualizar" : "Adicionar"} Status
                  </Button>
                  {editingStatusId && (
                    <Button
                      onClick={() => {
                        setEditingStatusId(null);
                        setStatusForm({ key: "", label: "" });
                      }}
                      variant="outline"
                      className="border-dark-border text-accent-gray hover:border-primary-500 hover:text-primary-500"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>

              {/* Lista de Status */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Todos os Status</h3>
                {statuses.length === 0 ? (
                  <div className="text-center py-8 bg-dark-surface border border-dark-border rounded-lg">
                    <p className="text-accent-gray">Nenhum status cadastrado ainda.</p>
                    <p className="text-accent-gray text-sm mt-2">Use o formulário acima para criar o primeiro status.</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {statuses.map((status) => (
                      <div
                        key={status.id}
                        className="flex items-center justify-between p-4 bg-dark-surface border border-dark-border rounded-lg hover:border-primary-500/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="text-white font-semibold text-lg">{status.label}</span>
                            <span className="text-accent-gray text-sm font-mono">{status.key}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditStatus(status)}
                            size="sm"
                            className="bg-primary-500/20 hover:bg-primary-500/30 text-primary-500 border border-primary-500/50"
                            title="Editar status"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            onClick={() => handleDeleteStatus(status.id)}
                            size="sm"
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50"
                            title="Excluir status"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Gestão de Tipos */}
          {showTypeManagement && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Gerenciar Tipos</h2>
                <span className="text-accent-gray text-sm">
                  {types.length} {types.length === 1 ? "tipo" : "tipos"}
                </span>
              </div>

              {/* Formulário de criação/edição */}
              <div className="bg-dark-surface border border-dark-border rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  {editingTypeId ? "Editar Tipo" : "Criar Novo Tipo"}
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Key (ex: Web) *
                    </label>
                    <input
                      type="text"
                      value={typeForm.key}
                      onChange={(e) => setTypeForm({ ...typeForm, key: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-bg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Web"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Label (ex: WEB) *
                    </label>
                    <input
                      type="text"
                      value={typeForm.label}
                      onChange={(e) => setTypeForm({ ...typeForm, label: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-bg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="WEB"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveType}
                    className="bg-primary-500 hover:bg-primary-600 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingTypeId ? "Atualizar" : "Adicionar"} Tipo
                  </Button>
                  {editingTypeId && (
                    <Button
                      onClick={() => {
                        setEditingTypeId(null);
                        setTypeForm({ key: "", label: "" });
                      }}
                      variant="outline"
                      className="border-dark-border text-accent-gray hover:border-primary-500 hover:text-primary-500"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>

              {/* Lista de Tipos */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Todos os Tipos</h3>
                {types.length === 0 ? (
                  <div className="text-center py-8 bg-dark-surface border border-dark-border rounded-lg">
                    <p className="text-accent-gray">Nenhum tipo cadastrado ainda.</p>
                    <p className="text-accent-gray text-sm mt-2">Use o formulário acima para criar o primeiro tipo.</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {types.map((type) => (
                      <div
                        key={type.id}
                        className="flex items-center justify-between p-4 bg-dark-surface border border-dark-border rounded-lg hover:border-primary-500/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="text-white font-semibold text-lg">{type.label}</span>
                            <span className="text-accent-gray text-sm font-mono">{type.key}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditType(type)}
                            size="sm"
                            className="bg-primary-500/20 hover:bg-primary-500/30 text-primary-500 border border-primary-500/50"
                            title="Editar tipo"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            onClick={() => handleDeleteType(type.id)}
                            size="sm"
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50"
                            title="Excluir tipo"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Modal de criação/edição */}
          <Modal
            isOpen={isCreating || editingId !== null}
            onClose={handleCancel}
            title={isCreating ? "Novo Projeto" : "Editar Projeto"}
          >
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title ?? ""}
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
                    value={formData.year ?? ""}
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
                    value={formData.description ?? ""}
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
                    value={formData.longDescription ?? ""}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-white">
                    Imagem do Projeto
                  </label>
                  
                  {/* Preview da imagem atual ou selecionada */}
                  {(imagePreview ?? formData.imageUrl) && (
                    <div className="relative mb-4 w-full h-48 rounded-lg overflow-hidden bg-dark-surface border border-dark-border">
                      <Image
                        src={imagePreview ?? formData.imageUrl ?? ""}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Input de arquivo */}
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <div className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-surface text-white hover:border-primary-500/50 transition-colors flex items-center justify-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>{selectedImageFile ? selectedImageFile.name : "Selecionar Imagem"}</span>
                      </div>
                    </label>
                    {selectedImageFile && (
                      <Button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={uploadingImage}
                        className="bg-primary-500 hover:bg-primary-600 text-white"
                      >
                        {uploadingImage ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Enviar
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-accent-gray mt-2">
                    Formatos aceitos: JPEG, PNG, WebP. Tamanho máximo: 5MB
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Link do Projeto
                  </label>
                  <input
                    type="text"
                    value={formData.link ?? ""}
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
                    value={formData.github ?? ""}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Tipo *
                  </label>
                  <select
                    value={formData.type ?? ""}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Selecione um tipo</option>
                    {types.map((type) => (
                      <option key={type.id} value={type.key}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">
                    Status *
                  </label>
                  <select
                    value={formData.status ?? ""}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-surface text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Selecione um status</option>
                    {statuses.map((status) => (
                      <option key={status.id} value={status.key}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured ?? false}
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
                    value={formData.stars ?? 0}
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
                    value={formData.forks ?? 0}
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
                    {(formData.technologies ?? []).map((tech, index) => (
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
          </Modal>

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
                          <div className="flex items-center gap-4 text-sm text-accent-gray mb-2 flex-wrap">
                            <span>{project.year}</span>
                            <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                              {project.type}
                            </span>
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
