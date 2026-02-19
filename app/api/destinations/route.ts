import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { destinationCreateSchema } from "@/lib/validations/destination-admin";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

// GET /api/destinations - Listar todos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const published = searchParams.get("published");
    
    const destinations = await prisma.destination.findMany({
      where: {
        ...(published && { published: published === "true" }),
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { properties: true }
        }
      },
      orderBy: { order: "asc" }
    });
    
    return NextResponse.json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { error: "Erro ao buscar destinos" },
      { status: 500 }
    );
  }
}

// POST /api/destinations - Criar novo
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
    return NextResponse.json(
      { error: "Não autorizado" },
      { status: 401 }
    );
  }
  
  try {
    const body = await request.json();
    const validated = destinationCreateSchema.parse(body);
    
    const destination = await prisma.destination.create({
      data: {
        ...validated,
        createdById: session.user.id,
      }
    });
    
    await createAuditLog({
      userId: session.user.id,
      action: "CREATE",
      entity: "Destination",
      entityId: destination.id,
      changes: validated,
    });
    
    revalidatePath("/destinos");
    revalidatePath("/admin/destinos");
    
    return NextResponse.json(destination, { status: 201 });
  } catch (error: any) {
    console.error("Error creating destination:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar destino" },
      { status: 500 }
    );
  }
}
