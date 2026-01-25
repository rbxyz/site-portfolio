import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";

interface TypeUpdateData {
  key?: string;
  label?: string;
}

// PUT - Atualizar tipo
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
    const body = (await request.json()) as TypeUpdateData;

    const updateData: { key?: string; label?: string } = {};
    if (body.key) {
      updateData.key = body.key;
    }
    if (body.label) {
      updateData.label = body.label.toUpperCase();
    }

    const type = await db.projectType.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(type);
  } catch (error) {
    console.error("Error updating type:", error);
    return NextResponse.json(
      { error: "Failed to update type" },
      { status: 500 }
    );
  }
}

// DELETE - Excluir tipo
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

    // Buscar o tipo para obter a key
    const type = await db.projectType.findUnique({
      where: { id: parseInt(id) },
    });

    if (!type) {
      return NextResponse.json({ error: "Type not found" }, { status: 404 });
    }

    // Verificar se há projetos usando este tipo
    const projectsCount = await db.project.count({
      where: { type: type.key },
    });

    if (projectsCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete type that is being used by projects" },
        { status: 400 }
      );
    }

    await db.projectType.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting type:", error);
    return NextResponse.json(
      { error: "Failed to delete type" },
      { status: 500 }
    );
  }
}

