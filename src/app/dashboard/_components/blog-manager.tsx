"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Edit,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Tag as TagIcon,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import { Modal } from "@/app/_components/modal";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  published: boolean;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorName: string | null;
  tags: string[];
}

interface PostForm {
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  published: boolean;
  tags: string[];
}

const EMPTY_FORM: PostForm = {
  title: "",
  slug: "",
  content: "",
  imageUrl: "",
  published: false,
  tags: [],
};

const MAX_COVER_MB = 5;
const ALLOWED_COVER_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const INPUT_CLASS =
  "w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-bg text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-plum-line focus:border-plum-line transition-colors";

function fmtDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

/** ~200 palavras/min, igual ao cálculo do /blog. */
function readMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [knownTags, setKnownTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PostForm>(EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");
  const [coverFileName, setCoverFileName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/blog/posts");
      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setLoadError(body.error ?? "Falha ao carregar posts do blog.");
        setPosts([]);
        return;
      }
      setLoadError(null);
      setPosts((await response.json()) as BlogPost[]);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setLoadError("Não foi possível conectar ao banco do blog.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch("/api/blog/tags");
      if (!response.ok) return;
      const data = (await response.json()) as { name: string }[];
      setKnownTags(data.map((t) => t.name));
    } catch (error) {
      console.error("Error fetching blog tags:", error);
    }
  }, []);

  useEffect(() => {
    void fetchPosts();
    void fetchTags();
  }, [fetchPosts, fetchTags]);

  const visible = useMemo(() => {
    if (filter === "published") return posts.filter((p) => p.published);
    if (filter === "draft") return posts.filter((p) => !p.published);
    return posts;
  }, [posts, filter]);

  const publishedCount = posts.filter((p) => p.published).length;

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setTagInput("");
    setCoverFileName(null);
    setIsOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      imageUrl: post.imageUrl ?? "",
      published: post.published,
      tags: [...post.tags],
    });
    setTagInput("");
    setCoverFileName(null);
    setIsOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setTagInput("");
    setCoverFileName(null);
  };

  /** Lê a capa escolhida como base64 e guarda direto em `imageUrl`. */
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_COVER_TYPES.includes(file.type)) {
      toast.error("Formato inválido", {
        description: "Use JPEG, PNG ou WebP.",
      });
      return;
    }

    if (file.size > MAX_COVER_MB * 1024 * 1024) {
      toast.error("Imagem muito grande", {
        description: `O limite é ${MAX_COVER_MB}MB.`,
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
      setCoverFileName(file.name);
    };
    reader.onerror = () => toast.error("Não foi possível ler o arquivo");
    reader.readAsDataURL(file);

    // Permite reescolher o mesmo arquivo depois de remover a capa.
    e.target.value = "";
  };

  const addTag = (value: string) => {
    const name = value.trim();
    if (!name) return;
    setForm((prev) =>
      prev.tags.some((t) => t.toLowerCase() === name.toLowerCase())
        ? prev
        : { ...prev, tags: [...prev.tags, name] },
    );
    setTagInput("");
  };

  const removeTag = (name: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== name) }));
  };

  const handleSave = async () => {
    if (saving) return;

    if (!form.title.trim()) {
      toast.error("Informe o título do post");
      return;
    }
    if (!form.content.trim()) {
      toast.error("Informe o conteúdo do post");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(
        editingId ? `/api/blog/posts/${editingId}` : "/api/blog/posts",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        toast.error(editingId ? "Erro ao atualizar post" : "Erro ao criar post", {
          description: body.error ?? "Tente novamente.",
        });
        return;
      }

      await fetchPosts();
      await fetchTags();
      setIsOpen(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      setCoverFileName(null);
      toast.success(editingId ? "Post atualizado!" : "Post criado!", {
        description: `"${form.title}" foi salvo com sucesso.`,
      });
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Erro ao salvar post", {
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
    } finally {
      setSaving(false);
    }
  };

  /** Alterna published sem abrir o modal. */
  const togglePublished = async (post: BlogPost) => {
    if (busyId) return;
    try {
      setBusyId(post.id);
      const response = await fetch(`/api/blog/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          slug: post.slug,
          content: post.content,
          imageUrl: post.imageUrl ?? "",
          published: !post.published,
          tags: post.tags,
        }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        toast.error("Erro ao alterar publicação", {
          description: body.error ?? "Tente novamente.",
        });
        return;
      }

      await fetchPosts();
      toast.success(post.published ? "Post despublicado" : "Post publicado!");
    } catch (error) {
      console.error("Error toggling post:", error);
      toast.error("Erro ao alterar publicação");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (post: BlogPost) => {
    if (
      !confirm(
        `Excluir "${post.title}"? Os comentários e as visualizações do post também serão removidos.`,
      )
    ) {
      return;
    }

    try {
      setBusyId(post.id);
      const response = await fetch(`/api/blog/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        toast.error("Erro ao excluir post", {
          description: body.error ?? "Tente novamente.",
        });
        return;
      }

      await fetchPosts();
      toast.success("Post excluído");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Erro ao excluir post");
    } finally {
      setBusyId(null);
    }
  };

  const suggestions = knownTags.filter((t) => !form.tags.includes(t)).slice(0, 12);

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-16 justify-center text-ink-muted">
        <Loader2 className="h-4 w-4 animate-spin text-plum-text" />
        <span className="font-mono text-sm">Carregando posts...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Barra de ações */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button
          onClick={openCreate}
          className="bg-plum hover:bg-plum-line text-ink"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Post
        </Button>

        <div className="flex items-center gap-1 rounded-lg border border-dark-border bg-dark-surface p-1">
          {(
            [
              ["all", `Todos (${posts.length})`],
              ["published", `Publicados (${publishedCount})`],
              ["draft", `Rascunhos (${posts.length - publishedCount})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                filter === key
                  ? "bg-plum text-ink"
                  : "text-ink-secondary hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loadError && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {loadError}
        </div>
      )}

      {/* Lista de posts */}
      <div className="grid gap-4">
        {visible.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-card-border bg-card p-5 transition-colors hover:border-white/20"
          >
            <div className="flex flex-col gap-4 md:flex-row">
              {post.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="h-32 w-full flex-shrink-0 rounded-lg object-cover md:w-48"
                />
              )}

              <div className="min-w-0 flex-1">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="mb-1 truncate text-xl font-bold text-card-ink">
                      {post.title}
                    </h3>
                    <p className="truncate font-mono text-xs text-card-faint">
                      /blog/{post.slug}
                    </p>
                  </div>

                  <div className="flex flex-shrink-0 gap-2">
                    <Button
                      onClick={() => void togglePublished(post)}
                      disabled={busyId === post.id}
                      size="sm"
                      className={
                        post.published
                          ? "bg-plum text-ink hover:bg-plum-line"
                          : "border border-card-border bg-card-inset text-card-muted hover:text-card-ink"
                      }
                      title={post.published ? "Despublicar" : "Publicar"}
                    >
                      {post.published ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => openEdit(post)}
                      size="sm"
                      className="border border-white/10 bg-white/5 text-ink-muted hover:bg-white/10 hover:text-ink"
                      title="Editar post"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => void handleDelete(post)}
                      disabled={busyId === post.id}
                      size="sm"
                      className="border border-red-500/50 bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      title="Excluir post"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-card-muted">
                  <span
                    className={`rounded px-2 py-1 ${
                      post.published
                        ? "bg-green-500/15 text-green-400"
                        : "bg-yellow-500/15 text-yellow-400"
                    }`}
                  >
                    {post.published ? "PUBLICADO" : "RASCUNHO"}
                  </span>
                  <span>{fmtDate(post.publishedAt ?? post.createdAt)}</span>
                  <span>{post.viewCount} views</span>
                  <span>{readMinutes(post.content)} min de leitura</span>
                  {post.authorName && <span>por {post.authorName}</span>}
                </div>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-card-border bg-card-inset px-2.5 py-1 text-xs text-card-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {post.published && (
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-sm text-plum-text transition-colors hover:text-ink"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver no site
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {visible.length === 0 && !loadError && (
        <div className="rounded-xl border border-card-border bg-card py-16 text-center">
          <FileText className="mx-auto mb-3 h-8 w-8 text-card-faint" />
          <p className="text-card-muted">
            {posts.length === 0
              ? "Nenhum post no blog ainda."
              : "Nenhum post neste filtro."}
          </p>
        </div>
      )}

      {/* Modal de criação/edição */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={editingId ? "Editar Post" : "Novo Post"}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-ink">
              Título *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={INPUT_CLASS}
              placeholder="Como automatizei meu fluxo de deploy"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className={INPUT_CLASS}
              placeholder="gerado a partir do título"
            />
            <p className="mt-2 text-xs text-ink-faint">
              Deixe vazio para gerar do título. Slugs repetidos ganham sufixo.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Imagem de capa
            </label>

            {form.imageUrl && (
              <div className="relative mb-3 h-40 w-full overflow-hidden rounded-lg border border-dark-border bg-dark-bg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.imageUrl}
                  alt="Pré-visualização da capa"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, imageUrl: "" }));
                    setCoverFileName(null);
                  }}
                  className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-ink transition-colors hover:bg-red-600"
                  aria-label="Remover capa"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleCoverSelect}
                className="hidden"
              />
              <span className={`${INPUT_CLASS} flex items-center justify-center gap-2`}>
                <ImageIcon className="h-4 w-4" />
                {coverFileName ?? "Selecionar imagem"}
              </span>
            </label>

            <input
              type="text"
              value={form.imageUrl.startsWith("data:image/") ? "" : form.imageUrl}
              onChange={(e) => {
                setForm({ ...form, imageUrl: e.target.value });
                setCoverFileName(null);
              }}
              className={`${INPUT_CLASS} mt-2`}
              placeholder="…ou cole uma URL"
              disabled={form.imageUrl.startsWith("data:image/")}
            />

            <p className="mt-2 text-xs text-ink-faint">
              JPEG, PNG ou WebP até {MAX_COVER_MB}MB. A imagem é convertida em
              base64 e salva junto do post. Sem capa, o /blog usa o gradiente
              padrão.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-ink">
              Conteúdo (Markdown) *
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className={`${INPUT_CLASS} font-mono text-sm leading-relaxed`}
              rows={16}
              placeholder={"## Introdução\n\nEscreva em Markdown..."}
              required
            />
            <p className="mt-2 text-xs text-ink-faint">
              {readMinutes(form.content)} min de leitura ·{" "}
              {form.content.trim().split(/\s+/).filter(Boolean).length} palavras
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-ink">Tags</label>
            <div className="mb-2 flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                placeholder="Digite uma tag e pressione Enter"
                className={`${INPUT_CLASS} flex-1`}
              />
              <Button
                type="button"
                onClick={() => addTag(tagInput)}
                className="bg-plum text-ink hover:bg-plum-line"
              >
                Adicionar
              </Button>
            </div>

            {form.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full border border-plum-line bg-plum/50 px-3 py-1 text-sm text-ink-muted"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="transition-colors hover:text-ink"
                      aria-label={`Remover tag ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <TagIcon className="h-3.5 w-3.5 text-ink-faint" />
                {suggestions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="rounded-full border border-dark-border bg-dark-surface px-2.5 py-1 text-xs text-ink-secondary transition-colors hover:border-white/25 hover:text-ink"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="flex cursor-pointer items-center gap-2 text-ink">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="h-4 w-4 rounded border-dark-border bg-dark-surface text-plum-text focus:ring-plum-line"
              />
              <span>Publicado (visível em /blog)</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Button
            onClick={() => void handleSave()}
            disabled={saving}
            className="bg-plum text-ink hover:bg-plum-line disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editingId ? "Atualizando..." : "Criando..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </>
            )}
          </Button>
          <Button
            onClick={closeModal}
            disabled={saving}
            variant="outline"
            className="disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
