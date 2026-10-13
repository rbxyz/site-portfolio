import { NextResponse } from "next/server";

import { addEventoImage, EventoError } from "@/server/eventos";

import { fail, refreshHome, requireAdmin } from "../../respond";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

// POST - Adiciona uma foto ao evento (multipart: file, width, height)
export async function POST(request: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new EventoError("Nenhum arquivo enviado");

    const image = await addEventoImage(id, {
      bytes: Buffer.from(await file.arrayBuffer()),
      mimeType: file.type,
      width: Number(form.get("width")),
      height: Number(form.get("height")),
    });
    refreshHome();
    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    return fail(error, "Falha ao enviar imagem");
  }
}
