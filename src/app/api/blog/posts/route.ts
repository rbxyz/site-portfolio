import { NextResponse } from "next/server";

import { auth } from "@/server/auth";
import {
  BlogAdminError,
  createPost,
  listAllPosts,
  type BlogPostInput,
} from "@/server/blog-admin";

export const dynamic = "force-dynamic";

/** Converte erros da camada admin numa resposta JSON consistente. */
function fail(error: unknown, fallback: string) {
  if (error instanceof BlogAdminError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error(`[blog-admin] ${fallback}:`, error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

// GET - Lista todos os posts (inclusive rascunhos)
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json(await listAllPosts());
  } catch (error) {
    return fail(error, "Falha ao listar posts");
  }
}

// POST - Cria um novo post
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as BlogPostInput;
    const post = await createPost(body, session.user.email);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return fail(error, "Falha ao criar post");
  }
}
