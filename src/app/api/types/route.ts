import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";

// GET - Listar todos os tipos
export async function GET() {
  try {
    const types = await db.projectType.findMany({
      orderBy: { label: "asc" },
    });
    return NextResponse.json(types);
  } catch (error) {
    console.error("Error fetching types:", error);
    return NextResponse.json(
      { error: "Failed to fetch types" },
      { status: 500 }
    );
  }
}

interface TypeCreateData {
  key: string;
  label: string;
}

// POST - Criar novo tipo
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as TypeCreateData;

    if (!body.key || !body.label) {
      return NextResponse.json(
        { error: "Key and label are required" },
        { status: 400 }
      );
    }

    const type = await db.projectType.create({
      data: {
        key: body.key,
        label: body.label.toUpperCase(),
      },
    });

    return NextResponse.json(type);
  } catch (error) {
    console.error("Error creating type:", error);
    return NextResponse.json(
      { error: "Failed to create type" },
      { status: 500 }
    );
  }
}

