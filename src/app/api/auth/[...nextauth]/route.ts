// src/app/api/session/route.ts
import { auth } from "@/server/auth";

export async function GET() {
  const session = await auth();  // Buscar a sessão aqui
  return new Response(JSON.stringify({ session }), {
    headers: { "Content-Type": "application/json" },
  });
}
