import { NextResponse } from "next/server";

import { auth } from "@/server/auth";
import { BlogAdminError, listAllTags } from "@/server/blog-admin";

export const dynamic = "force-dynamic";

// GET - Todas as tags do blog (para sugestão no formulário)
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json(await listAllTags());
  } catch (error) {
    if (error instanceof BlogAdminError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[blog-admin] Falha ao listar tags:", error);
    return NextResponse.json({ error: "Falha ao listar tags" }, { status: 500 });
  }
}
