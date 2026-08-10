import { NextResponse } from "next/server";

import { auth } from "@/server/auth";
import {
  BlogAdminError,
  deletePost,
  updatePost,
  type BlogPostInput,
} from "@/server/blog-admin";

export const dynamic = "force-dynamic";

function fail(error: unknown, fallback: string) {
  if (error instanceof BlogAdminError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error(`[blog-admin] ${fallback}:`, error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

type Ctx = { params: Promise<{ id: string }> };

// PUT - Atualiza um post
export async function PUT(request: Request, { params }: Ctx) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = (await request.json()) as BlogPostInput;
    return NextResponse.json(await updatePost(id, body));
  } catch (error) {
    return fail(error, "Falha ao atualizar post");
  }
}

// DELETE - Remove um post (comentários, views e tags saem em cascata)
export async function DELETE(_request: Request, { params }: Ctx) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deletePost(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return fail(error, "Falha ao excluir post");
  }
}
