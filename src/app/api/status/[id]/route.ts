import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";

interface StatusUpdateData {
  key?: string;
  label?: string;
}

// PUT - Atualizar status
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
    const body = (await request.json()) as StatusUpdateData;

    const updateData: { key?: string; label?: string } = {};
    if (body.key) {
      updateData.key = body.key.toLowerCase().replace(/\s+/g, "-");
    }
    if (body.label) {
      updateData.label = body.label.toUpperCase();
    }

    const status = await db.projectStatus.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(status);
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}

// DELETE - Excluir status
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

    // Buscar o status para obter a key
    const status = await db.projectStatus.findUnique({
      where: { id: parseInt(id) },
    });

    if (!status) {
      return NextResponse.json({ error: "Status not found" }, { status: 404 });
    }

    // Verificar se há projetos usando este status (usando a key)
    const projectsCount = await db.project.count({
      where: { status: status.key },
    });

    if (projectsCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete status that is being used by projects" },
        { status: 400 }
      );
    }

    await db.projectStatus.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting status:", error);
    return NextResponse.json(
      { error: "Failed to delete status" },
      { status: 500 }
    );
  }
}

