import { NextResponse } from "next/server";

import { deleteEventoImage, getEventoImage } from "@/server/eventos";

import { fail, refreshHome, requireAdmin } from "../../eventos/respond";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ imageId: string }> };

// GET - Serve o binário da foto (público). O id muda a cada upload, então a
// resposta pode ficar em cache para sempre.
export async function GET(_request: Request, { params }: Ctx) {
  try {
    const { imageId } = await params;
    const image = await getEventoImage(imageId);
    if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return new Response(new Uint8Array(image.data), {
      headers: {
        "Content-Type": image.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return fail(error, "Falha ao carregar imagem");
  }
}

// DELETE - Remove uma foto
export async function DELETE(_request: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { imageId } = await params;
    await deleteEventoImage(imageId);
    refreshHome();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return fail(error, "Falha ao excluir imagem");
  }
}
