import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

    // Verificar conexão com banco de dados
    let projects;
    try {
      projects = await db.project.findMany({
        where,
        orderBy: [
          { featured: "desc" },
          { year: "desc" },
          { createdAt: "desc" },
        ],
      });
    } catch (dbError) {
      // Se for erro de conexão, retornar array vazio em vez de erro 500
      if (
        dbError instanceof PrismaClientKnownRequestError ||
        dbError instanceof Error
      ) {
        console.error("Database connection error:", dbError);
        
        // Em produção, retornar array vazio para não quebrar a UI
        if (process.env.NODE_ENV === "production") {
          return NextResponse.json([]);
        }
        
        // Em desenvolvimento, retornar erro detalhado
        throw new Error(
          `Database error: ${dbError instanceof Error ? dbError.message : String(dbError)}`
        );
      }
      throw dbError;
    }

    // Parse technologies JSON string com tratamento de erro
    const projectsWithParsedTech = projects.map((project) => {
      let technologies: string[] = [];
      
      try {
        if (project.technologies) {
          // Se já for um array, usar diretamente
          if (typeof project.technologies === "string") {
            technologies = JSON.parse(project.technologies) as string[];
          } else if (Array.isArray(project.technologies)) {
            technologies = project.technologies;
          }
        }
      } catch (parseError) {
        console.error(`Error parsing technologies for project ${project.id}:`, parseError);
        technologies = [];
      }

      return {
        ...project,
        technologies,
      };
    });

    return NextResponse.json(projectsWithParsedTech);
  } catch (error) {
    console.error("Error fetching projects:", error);
    
    // Retornar mensagem de erro mais detalhada em desenvolvimento
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch projects";
    
    // Em produção, retornar array vazio para não quebrar a UI
    if (process.env.NODE_ENV === "production") {
      console.error("Production error - returning empty array:", errorMessage);
      return NextResponse.json([]);
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: String(error)
      },
      { status: 500 }
    );
  }
}
