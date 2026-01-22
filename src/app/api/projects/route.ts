import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");

    const where: {
      type?: string;
      status?: string;
      featured?: boolean;
    } = {};

    if (type && type !== "All") {
      where.type = type;
    }

    if (status && status !== "All") {
      where.status = status;
    }

    if (featured === "true") {
      where.featured = true;
    }

    const projects = await db.project.findMany({
      where,
      orderBy: [
        { featured: "desc" },
        { year: "desc" },
        { createdAt: "desc" },
      ],
    });

    // Parse technologies JSON string
    const projectsWithParsedTech = projects.map((project) => ({
      ...project,
      technologies: JSON.parse(project.technologies || "[]") as string[],
    }));

    return NextResponse.json(projectsWithParsedTech);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
