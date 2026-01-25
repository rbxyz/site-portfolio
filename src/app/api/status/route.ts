import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";

// GET - Listar todos os status
export async function GET() {
  try {
    const statuses = await db.projectStatus.findMany({
      orderBy: { label: "asc" },
    });
    return NextResponse.json(statuses);
  } catch (error) {
    console.error("Error fetching statuses:", error);
    return NextResponse.json(
      { error: "Failed to fetch statuses" },
      { status: 500 }
    );
  }
}

interface StatusCreateData {
  key: string;
  label: string;
}

// POST - Criar novo status
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as StatusCreateData;

    if (!body.key || !body.label) {
      return NextResponse.json(
        { error: "Key and label are required" },
        { status: 400 }
      );
    }

    const status = await db.projectStatus.create({
      data: {
        key: body.key.toLowerCase().replace(/\s+/g, "-"),
        label: body.label.toUpperCase(),
      },
    });

    return NextResponse.json(status);
  } catch (error) {
    console.error("Error creating status:", error);
    return NextResponse.json(
      { error: "Failed to create status" },
      { status: 500 }
    );
  }
}

