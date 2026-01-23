import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET() {
  try {
    // Tentar buscar projetos
    const projects = await db.project.findMany({
      take: 5, // Apenas 5 para teste
    });

    // Tentar contar total
    const count = await db.project.count();

    // Verificar estrutura de um projeto
    const sampleProject = projects[0];

    return NextResponse.json({
      success: true,
      totalCount: count,
      foundProjects: projects.length,
      sampleProject: sampleProject ? {
        id: sampleProject.id,
        title: sampleProject.title,
        featured: sampleProject.featured,
        status: sampleProject.status,
        technologies: typeof sampleProject.technologies === 'string' 
          ? 'string' 
          : Array.isArray(sampleProject.technologies) 
          ? 'array' 
          : typeof sampleProject.technologies,
      } : null,
      allProjects: projects.map(p => ({
        id: p.id,
        title: p.title,
        featured: p.featured,
        status: p.status,
      })),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
