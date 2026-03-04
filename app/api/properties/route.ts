import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAdminSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { propertyCreateSchema } from "@/lib/validations/property-admin";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

// GET /api/properties - Listar todas (com filtros)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const published = searchParams.get("published");
    const destinoId = searchParams.get("destinoId");
    
    const properties = await prisma.property.findMany({
      where: {
        ...(published && { published: published === "true" }),
        ...(destinoId && { destinoId }),
      },
      include: {
        destino: true,
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    
    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Erro ao buscar propriedades" },
      { status: 500 }
    );
  }
}

// POST /api/properties - Criar nova
export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  
  if (!session || !session.user.role || !["ADMIN", "EDITOR"].includes(session.user.role)) {
    return NextResponse.json(
      { error: "Não autorizado" },
      { status: 401 }
    );
  }
  
  try {
    const body = await request.json();
    const validated = propertyCreateSchema.parse(body);
    
    const property = await prisma.property.create({
      data: {
        ...validated,
        createdById: session.user.id,
      }
    });
    
    await createAuditLog({
      userId: session.user.id,
      action: "CREATE",
      entity: "Property",
      entityId: property.id,
      changes: validated,
    });
    
    revalidatePath("/");
    revalidatePath("/casas");
    revalidatePath("/admin/casas");
    
    return NextResponse.json(property, { status: 201 });
  } catch (error: any) {
    console.error("Error creating property:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar propriedade" },
      { status: 500 }
    );
  }
}
