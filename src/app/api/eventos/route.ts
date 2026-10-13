import { NextResponse } from "next/server";

import { createEvento, listEventosAdmin } from "@/server/eventos";

import { fail, refreshHome, requireAdmin } from "./respond";

export const dynamic = "force-dynamic";

// GET - Lista os eventos para o painel
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    return NextResponse.json(await listEventosAdmin());
  } catch (error) {
    return fail(error, "Falha ao listar eventos");
  }
}

// POST - Cria um evento
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const evento = await createEvento(await request.json());
    refreshHome();
    return NextResponse.json(evento, { status: 201 });
  } catch (error) {
    return fail(error, "Falha ao criar evento");
  }
}
