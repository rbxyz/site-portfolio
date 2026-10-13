import { NextResponse } from "next/server";

import { deleteEvento, updateEvento } from "@/server/eventos";

import { fail, refreshHome, requireAdmin } from "../respond";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

// PUT - Atualiza um evento
export async function PUT(request: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const evento = await updateEvento(id, await request.json());
    refreshHome();
    return NextResponse.json(evento);
  } catch (error) {
    return fail(error, "Falha ao atualizar evento");
  }
}

// DELETE - Remove um evento (as fotos saem em cascata)
export async function DELETE(_request: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    await deleteEvento(id);
    refreshHome();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return fail(error, "Falha ao excluir evento");
  }
}
