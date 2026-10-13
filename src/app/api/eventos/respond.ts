import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { auth } from "@/server/auth";
import { EventoError } from "@/server/eventos";

/** Converte erros da camada de eventos numa resposta JSON consistente. */
export function fail(error: unknown, fallback: string) {
  if (error instanceof EventoError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error(`[eventos] ${fallback}:`, error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

/** Resposta 401 quando não há sessão; `null` quando o acesso está liberado. */
export async function requireAdmin() {
  const session = await auth();
  if (session?.user) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** A home é estática: regenera depois de qualquer alteração nos eventos. */
export function refreshHome() {
  revalidatePath("/");
}
