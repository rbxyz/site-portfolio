import "server-only";

import { z } from "zod";

import {
  eventos as eventosFallback,
  type Evento,
} from "@/app/_components/portfolio/eventos-data";
import { db } from "@/server/db";

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // abaixo do limite de 4.5MB por request da Vercel
export const MAX_IMAGES_PER_EVENT = 24;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Erro de validação/negócio com o status HTTP que a rota deve devolver. */
export class EventoError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export const imageUrl = (id: string) => `/api/event-images/${id}`;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((v) => (v == null || v === "" ? null : v));

const inputSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do evento").max(80),
  edition: optionalText(60),
  year: optionalText(12),
  role: z.string().trim().min(1, "Informe o papel no evento").max(40),
  highlight: z.boolean().default(false),
  location: optionalText(80),
  description: optionalText(4000),
  link: optionalText(500).refine((v) => !v || /^https?:\/\/\S+$/i.test(v), {
    message: "O link precisa começar com http:// ou https://",
  }),
  position: z.number().int().min(0).max(9999).default(0),
});

export type EventoInput = z.input<typeof inputSchema>;

function parseInput(input: unknown) {
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) {
    throw new EventoError(parsed.error.issues[0]?.message ?? "Dados inválidos");
  }
  return parsed.data;
}

function parseId(id: string) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) throw new EventoError("Evento não encontrado", 404);
  return n;
}

// Nunca seleciona `data`: as listagens só carregam os metadados das fotos.
const withImages = {
  images: {
    select: { id: true, width: true, height: true },
    orderBy: [{ position: "asc" as const }, { createdAt: "asc" as const }],
  },
};

const ordered = [{ position: "asc" as const }, { id: "asc" as const }];

type ImageMeta = { id: string; width: number; height: number };

const toImages = (images: ImageMeta[]) =>
  images.map((img) => ({ ...img, url: imageUrl(img.id) }));

/** Eventos da home. Cai na lista fixa se o banco estiver vazio ou fora do ar. */
export async function getEventos(): Promise<Evento[]> {
  try {
    const rows = await db.event.findMany({ orderBy: ordered, include: withImages });
    if (rows.length === 0) return eventosFallback;
    return rows.map((e) => ({
      id: String(e.id),
      name: e.name,
      edition: e.edition ?? undefined,
      year: e.year ?? undefined,
      role: e.role,
      highlight: e.highlight,
      location: e.location ?? undefined,
      description: e.description ?? undefined,
      link: e.link ?? undefined,
      images: toImages(e.images),
    }));
  } catch (err) {
    console.error("[eventos] getEventos failed:", err);
    return eventosFallback;
  }
}

/** Lista completa para o painel admin. */
export async function listEventosAdmin() {
  const rows = await db.event.findMany({ orderBy: ordered, include: withImages });
  return rows.map((e) => ({ ...e, images: toImages(e.images) }));
}

export async function createEvento(input: unknown) {
  const row = await db.event.create({ data: parseInput(input), include: withImages });
  return { ...row, images: toImages(row.images) };
}

export async function updateEvento(id: string, input: unknown) {
  const eventId = parseId(id);
  const data = parseInput(input);
  const exists = await db.event.findUnique({ where: { id: eventId }, select: { id: true } });
  if (!exists) throw new EventoError("Evento não encontrado", 404);
  const row = await db.event.update({ where: { id: eventId }, data, include: withImages });
  return { ...row, images: toImages(row.images) };
}

/** Remove o evento; as fotos saem em cascata. */
export async function deleteEvento(id: string) {
  const eventId = parseId(id);
  const { count } = await db.event.deleteMany({ where: { id: eventId } });
  if (count === 0) throw new EventoError("Evento não encontrado", 404);
}

export async function addEventoImage(
  id: string,
  file: { bytes: Buffer; mimeType: string; width: number; height: number },
) {
  const eventId = parseId(id);
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimeType)) {
    throw new EventoError("Formato inválido. Use JPEG, PNG ou WebP.");
  }
  if (file.bytes.length === 0) throw new EventoError("Arquivo vazio");
  if (file.bytes.length > MAX_IMAGE_BYTES) {
    throw new EventoError("Imagem muito grande (máx. 4MB)", 413);
  }
  const dims = z.number().int().min(1).max(20000);
  if (!dims.safeParse(file.width).success || !dims.safeParse(file.height).success) {
    throw new EventoError("Dimensões da imagem inválidas");
  }

  const event = await db.event.findUnique({
    where: { id: eventId },
    select: { _count: { select: { images: true } } },
  });
  if (!event) throw new EventoError("Evento não encontrado", 404);
  if (event._count.images >= MAX_IMAGES_PER_EVENT) {
    throw new EventoError(`Limite de ${MAX_IMAGES_PER_EVENT} fotos por evento atingido`);
  }

  const last = await db.eventImage.findFirst({
    where: { eventId },
    orderBy: { position: "desc" },
    select: { position: true },
  });
  const img = await db.eventImage.create({
    data: {
      eventId,
      data: file.bytes,
      mimeType: file.mimeType,
      width: file.width,
      height: file.height,
      position: (last?.position ?? -1) + 1,
    },
    select: { id: true, width: true, height: true },
  });
  return { ...img, url: imageUrl(img.id) };
}

export async function deleteEventoImage(imageId: string) {
  const { count } = await db.eventImage.deleteMany({ where: { id: imageId } });
  if (count === 0) throw new EventoError("Imagem não encontrada", 404);
}

/** Binário de uma foto, para a rota pública que serve as imagens. */
export async function getEventoImage(imageId: string) {
  return db.eventImage.findUnique({
    where: { id: imageId },
    select: { data: true, mimeType: true },
  });
}
