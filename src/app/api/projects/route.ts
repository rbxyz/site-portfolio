import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { auth } from "@/server/auth";

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
      // Log para debug
      console.log("Fetching projects with where clause:", where);
      
      projects = await db.project.findMany({
        where,
        orderBy: [
          { featured: "desc" },
          { year: "desc" },
          { createdAt: "desc" },
        ],
      });
      
      console.log(`Found ${projects.length} projects`);
      
      // Se não encontrou projetos, tentar sem filtros para debug
      if (projects.length === 0 && Object.keys(where).length > 0) {
        console.log("No projects found with filters, trying without filters...");
        const allProjects = await db.project.findMany({
          orderBy: [
            { featured: "desc" },
            { year: "desc" },
            { createdAt: "desc" },
          ],
        });
        console.log(`Found ${allProjects.length} total projects without filters`);
      }
    } catch (dbError) {
      // Log detalhado do erro
      console.error("Database error details:", {
        error: dbError,
        message: dbError instanceof Error ? dbError.message : String(dbError),
        stack: dbError instanceof Error ? dbError.stack : undefined,
        name: dbError instanceof Error ? dbError.name : undefined,
      });
      
      // Se for erro de conexão, retornar array vazio em vez de erro 500
      if (
        dbError instanceof PrismaClientKnownRequestError ||
        dbError instanceof Error
      ) {
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

    console.log(`Returning ${projectsWithParsedTech.length} projects`);
    return NextResponse.json(projectsWithParsedTech);
  } catch (error) {
    console.error("Error fetching projects:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : undefined);
    
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
        details: String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

interface ProjectCreateData {
  title: string;
  description: string;
  longDescription?: string | null;
  imageUrl?: string | null;
  technologies: string;
  link?: string | null;
  github?: string | null;
  type?: string;
  featured?: boolean;
  year: string;
  status?: string;
  stars?: number;
  forks?: number;
}

// POST - Criar novo projeto
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as ProjectCreateData;

    const project = await db.project.create({
      data: {
        title: body.title,
        description: body.description,
        longDescription: body.longDescription ?? null,
        imageUrl: body.imageUrl ?? null,
        technologies: body.technologies,
        link: body.link ?? null,
        github: body.github ?? null,
        type: body.type ?? "shipped",
        featured: body.featured ?? false,
        year: body.year,
        status: body.status ?? "in-progress",
        stars: body.stars ?? 0,
        forks: body.forks ?? 0,
      },
    });

    // Parse technologies para retornar
    let technologies: string[] = [];
    try {
      if (typeof project.technologies === "string") {
        technologies = JSON.parse(project.technologies) as string[];
      } else if (Array.isArray(project.technologies)) {
        technologies = project.technologies;
      }
    } catch {
      technologies = [];
    }

    return NextResponse.json({
      ...project,
      technologies,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
