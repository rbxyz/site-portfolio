"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Edit,
  IdCard,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import { Modal } from "@/app/_components/modal";

interface EventoImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

interface Evento {
  id: number;
  name: string;
  edition: string | null;
  year: string | null;
  role: string;
  highlight: boolean;
  location: string | null;
  description: string | null;
  link: string | null;
  position: number;
  images: EventoImage[];
}

interface EventoForm {
  name: string;
  edition: string;
  year: string;
  role: string;
  highlight: boolean;
  location: string;
  description: string;
  link: string;
  position: number;
}

const EMPTY_FORM: EventoForm = {
  name: "",
  edition: "",
  year: "",
  role: "Participante",
  highlight: false,
  location: "",
  description: "",
  link: "",
  position: 0,
};

const MAX_IMAGES = 24;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
// As fotos são reduzidas no navegador antes do envio: cabem no limite de
// upload e não pesam no banco nem na home.
const MAX_SIDE = 1920;
const WEBP_QUALITY = 0.82;

const INPUT_CLASS =
  "w-full px-4 py-2 rounded-lg border border-dark-border bg-dark-bg text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-plum-line focus:border-plum-line transition-colors";

/** Redimensiona para no máx. MAX_SIDE px e reencoda em WebP. */
async function compressImage(file: File) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY),
  );
  if (!blob) throw new Error("Não foi possível processar a imagem");
  return { blob, width, height };
}

async function errorMessage(response: Response) {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? "Tente novamente.";
  } catch {
    return "Tente novamente.";
  }
}

export function EventosManager() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EventoForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [upload, setUpload] = useState<{ done: number; total: number } | null>(null);
  const [removingImageId, setRemovingImageId] = useState<string | null>(null);

  const editing = eventos.find((ev) => ev.id === editingId) ?? null;

  const fetchEventos = useCallback(async () => {
    try {
      const response = await fetch("/api/eventos");
      if (!response.ok) {
        setLoadError(await errorMessage(response));
        return;
      }
      setLoadError(null);
      setEventos((await response.json()) as Evento[]);
    } catch (error) {
      console.error("Error fetching eventos:", error);
      setLoadError("Não foi possível carregar os eventos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEventos();
  }, [fetchEventos]);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      position: eventos.reduce((max, ev) => Math.max(max, ev.position + 1), 0),
    });
    setIsOpen(true);
  };

  const openEdit = (ev: Evento) => {
    setEditingId(ev.id);
    setForm({
      name: ev.name,
      edition: ev.edition ?? "",
      year: ev.year ?? "",
      role: ev.role,
      highlight: ev.highlight,
      location: ev.location ?? "",
      description: ev.description ?? "",
      link: ev.link ?? "",
      position: ev.position,
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    if (saving || upload) return;
    setIsOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    if (saving) return;
    if (!form.name.trim()) {
      toast.error("Informe o nome do evento");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(editingId ? `/api/eventos/${editingId}` : "/api/eventos", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        toast.error(editingId ? "Erro ao atualizar evento" : "Erro ao criar evento", {
          description: await errorMessage(response),
        });
        return;
      }

      const saved = (await response.json()) as Evento;
      await fetchEventos();

      if (editingId) {
        setIsOpen(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
        toast.success("Evento atualizado!");
      } else {
        // Mantém o modal aberto já em modo edição para subir as fotos.
        setEditingId(saved.id);
        toast.success("Evento criado!", {
          description: "Agora você já pode adicionar as fotos.",
        });
      }
    } catch (error) {
      console.error("Error saving evento:", error);
      toast.error("Erro ao salvar evento", {
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ev: Evento) => {
    const fotos = ev.images.length;
    if (
      !confirm(
        `Excluir "${ev.name}${ev.edition ? ` · ${ev.edition}` : ""}"?` +
          (fotos > 0 ? ` ${fotos} foto(s) também serão removidas.` : ""),
      )
    ) {
      return;
    }

    try {
      setBusyId(ev.id);
      const response = await fetch(`/api/eventos/${ev.id}`, { method: "DELETE" });
      if (!response.ok) {
        toast.error("Erro ao excluir evento", { description: await errorMessage(response) });
        return;
      }
      await fetchEventos();
      toast.success("Evento excluído");
    } catch (error) {
      console.error("Error deleting evento:", error);
      toast.error("Erro ao excluir evento");
    } finally {
      setBusyId(null);
    }
  };

  /** Comprime e envia as fotos escolhidas, uma por request. */
  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    // Permite escolher os mesmos arquivos de novo depois.
    e.target.value = "";
    if (!editing || files.length === 0 || upload) return;

    const room = MAX_IMAGES - editing.images.length;
    if (room <= 0) {
      toast.error(`Limite de ${MAX_IMAGES} fotos por evento atingido`);
      return;
    }
    const queue = files.slice(0, room);
    if (queue.length < files.length) {
      toast.warning(`Só ${room} foto(s) cabem neste evento`, {
        description: `O limite é de ${MAX_IMAGES} fotos.`,
      });
    }

    let sent = 0;
    const failures: string[] = [];
    setUpload({ done: 0, total: queue.length });

    for (const [i, file] of queue.entries()) {
      try {
        if (!ALLOWED_TYPES.includes(file.type)) {
          throw new Error("formato não suportado (use JPEG, PNG ou WebP)");
        }
        const { blob, width, height } = await compressImage(file);
        const body = new FormData();
        body.append("file", new File([blob], "foto.webp", { type: "image/webp" }));
        body.append("width", String(width));
        body.append("height", String(height));

        const response = await fetch(`/api/eventos/${editing.id}/images`, {
          method: "POST",
          body,
        });
        if (!response.ok) throw new Error(await errorMessage(response));

        const image = (await response.json()) as EventoImage;
        setEventos((prev) =>
          prev.map((ev) =>
            ev.id === editing.id ? { ...ev, images: [...ev.images, image] } : ev,
          ),
        );
        sent++;
      } catch (error) {
        console.error("Error uploading image:", error);
        failures.push(
          `${file.name}: ${error instanceof Error ? error.message : "erro inesperado"}`,
        );
      } finally {
        setUpload({ done: i + 1, total: queue.length });
      }
    }

    setUpload(null);
    if (sent > 0) toast.success(`${sent} foto(s) adicionada(s)`);
    if (failures.length > 0) {
      toast.error(`${failures.length} foto(s) não foram enviadas`, {
        description: failures.join(" · "),
      });
    }
  };

  const handleRemoveImage = async (image: EventoImage) => {
    if (!editing || removingImageId) return;
    try {
      setRemovingImageId(image.id);
      const response = await fetch(`/api/event-images/${image.id}`, { method: "DELETE" });
      if (!response.ok) {
        toast.error("Erro ao remover foto", { description: await errorMessage(response) });
        return;
      }
      setEventos((prev) =>
        prev.map((ev) =>
          ev.id === editing.id
            ? { ...ev, images: ev.images.filter((img) => img.id !== image.id) }
            : ev,
        ),
      );
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Erro ao remover foto");
    } finally {
      setRemovingImageId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-16 justify-center text-ink-muted">
        <Loader2 className="h-4 w-4 animate-spin text-plum-text" />
        <span className="font-mono text-sm">Carregando eventos...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button onClick={openCreate} className="bg-plum hover:bg-plum-line text-ink">
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </Button>
        <p className="text-sm text-ink-faint">
          Cada evento vira um crachá na home, na ordem abaixo.
        </p>
      </div>

      {loadError && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {loadError}
        </div>
      )}

      <div className="grid gap-4">
        {eventos.map((ev) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-card-border bg-card p-5 transition-colors hover:border-white/20"
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="mb-1 flex items-center gap-2 truncate text-xl font-bold text-card-ink">
                  {ev.highlight && <Star className="h-4 w-4 flex-shrink-0 text-plum-text" />}
                  <span className="truncate">{ev.name}</span>
                </h3>
                <p className="truncate font-mono text-xs text-card-faint">
                  {[ev.edition, ev.year, ev.location].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>

              <div className="flex flex-shrink-0 gap-2">
                <Button
                  onClick={() => openEdit(ev)}
                  size="sm"
                  className="border border-white/10 bg-white/5 text-ink-muted hover:bg-white/10 hover:text-ink"
                  title="Editar evento e fotos"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => void handleDelete(ev)}
                  disabled={busyId === ev.id}
                  size="sm"
                  className="border border-red-500/50 bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  title="Excluir evento"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-card-muted">
              <span className="rounded bg-card-inset px-2 py-1 uppercase">{ev.role}</span>
              <span>Ordem {ev.position}</span>
              <span>{ev.images.length} foto(s)</span>
            </div>

            {ev.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto">
                {ev.images.slice(0, 8).map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img.id}
                    src={img.url}
                    alt=""
                    loading="lazy"
                    className="h-16 w-16 flex-shrink-0 rounded-md object-cover"
                  />
                ))}
                {ev.images.length > 8 && (
                  <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-card-inset text-xs text-card-muted">
                    +{ev.images.length - 8}
                  </span>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {eventos.length === 0 && !loadError && (
        <div className="rounded-xl border border-card-border bg-card py-16 text-center">
          <IdCard className="mx-auto mb-3 h-8 w-8 text-card-faint" />
          <p className="text-card-muted">Nenhum evento cadastrado ainda.</p>
        </div>
      )}

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={editingId ? "Editar Evento" : "Novo Evento"}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-ink">Nome *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={INPUT_CLASS}
              placeholder="South Summit"
              maxLength={80}
              required
            />
            <p className="mt-2 text-xs text-ink-faint">
              Impresso em destaque no crachá, uma palavra por linha.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Edição</label>
            <input
              type="text"
              value={form.edition}
              onChange={(e) => setForm({ ...form, edition: e.target.value })}
              className={INPUT_CLASS}
              placeholder="3ª edição"
              maxLength={60}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Ano</label>
            <input
              type="text"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className={INPUT_CLASS}
              placeholder="2026"
              maxLength={12}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Papel *</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className={INPUT_CLASS}
              placeholder="Participante, Campeão, Palestrante..."
              maxLength={40}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Local</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className={INPUT_CLASS}
              placeholder="Porto Alegre, RS"
              maxLength={80}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-ink">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`${INPUT_CLASS} leading-relaxed`}
              rows={6}
              maxLength={4000}
              placeholder="O que foi o evento, o que você fez por lá, o que levou dele..."
            />
            <p className="mt-2 text-xs text-ink-faint">
              Aparece no painel de detalhes ao clicar no crachá. Linha em branco
              separa parágrafos.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Link</label>
            <input
              type="url"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className={INPUT_CLASS}
              placeholder="https://..."
              maxLength={500}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Ordem</label>
            <input
              type="number"
              min={0}
              max={9999}
              value={form.position}
              onChange={(e) =>
                setForm({ ...form, position: Math.max(0, Math.trunc(Number(e.target.value)) || 0) })
              }
              className={INPUT_CLASS}
            />
            <p className="mt-2 text-xs text-ink-faint">
              Menor primeiro, da esquerda para a direita.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="flex cursor-pointer items-center gap-2 text-ink">
              <input
                type="checkbox"
                checked={form.highlight}
                onChange={(e) => setForm({ ...form, highlight: e.target.checked })}
                className="h-4 w-4 rounded border-dark-border bg-dark-surface text-plum-text focus:ring-plum-line"
              />
              <span>Crachá em destaque (roxo, com estrela) — ex.: vitória</span>
            </label>
          </div>

          {/* Fotos */}
          <div className="md:col-span-2 border-t border-dark-border pt-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <label className="text-sm font-medium text-ink">
                Fotos{editing ? ` (${editing.images.length}/${MAX_IMAGES})` : ""}
              </label>

              {editing && (
                <label className={upload ? "cursor-not-allowed opacity-60" : "cursor-pointer"}>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    disabled={!!upload}
                    onChange={(e) => void handleFiles(e)}
                    className="hidden"
                  />
                  <span className="inline-flex items-center gap-2 rounded-lg bg-plum px-4 py-2 text-sm text-ink transition-colors hover:bg-plum-line">
                    {upload ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando {Math.min(upload.done + 1, upload.total)} de {upload.total}...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4" />
                        Adicionar fotos
                      </>
                    )}
                  </span>
                </label>
              )}
            </div>

            {!editing ? (
              <p className="rounded-lg border border-dashed border-dark-border p-4 text-sm text-ink-faint">
                Salve o evento primeiro; em seguida as fotos podem ser enviadas aqui.
              </p>
            ) : (
              <>
                {editing.images.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-dark-border p-4 text-sm text-ink-faint">
                    Nenhuma foto ainda.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                    {editing.images.map((img) => (
                      <div
                        key={img.id}
                        className="relative aspect-square overflow-hidden rounded-lg border border-dark-border bg-dark-bg"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => void handleRemoveImage(img)}
                          disabled={removingImageId !== null}
                          className="absolute right-1 top-1 rounded-full bg-black/70 p-1.5 text-ink transition-colors hover:bg-red-600 disabled:opacity-50"
                          aria-label="Remover foto"
                        >
                          {removingImageId === img.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-3 text-xs text-ink-faint">
                  JPEG, PNG ou WebP. As fotos são reduzidas para até {MAX_SIDE}px e
                  salvas na hora — adicionar ou remover não depende do botão Salvar.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Button
            onClick={() => void handleSave()}
            disabled={saving || !!upload}
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
            disabled={saving || !!upload}
            variant="outline"
            className="disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="mr-2 h-4 w-4" />
            {editingId ? "Fechar" : "Cancelar"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
