import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";

interface ProjectUpdateData {
  title: string;
  description: string;
  longDescription?: string | null;
  imageUrl?: string | null;
  technologies: string;
  link?: string | null;
  github?: string | null;
  type: string;
  featured?: boolean;
  year: string;
  status: string;
  stars?: number;
  forks?: number;
}

// PUT - Atualizar projeto
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as ProjectUpdateData;

    const project = await db.project.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        description: body.description,
        longDescription: body.longDescription ?? null,
        imageUrl: body.imageUrl ?? null,
        technologies: body.technologies,
        link: body.link ?? null,
        github: body.github ?? null,
        type: body.type,
        featured: body.featured ?? false,
        year: body.year,
        status: body.status,
        stars: body.stars ?? 0,
        forks: body.forks ?? 0,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE - Excluir projeto
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await db.project.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
