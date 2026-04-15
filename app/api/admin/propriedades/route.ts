import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { propertyCreateSchema } from "@/lib/validations/property-admin";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

// GET /api/admin/propriedades - Listar todas (Admin Portal)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.userType !== "admin") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search");
    const destinoId = searchParams.get("destinoId");
    const status = searchParams.get("status");
    const published = searchParams.get("published");
    
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { cidade: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (destinoId && destinoId !== 'all') {
      whereClause.destinoId = destinoId;
    }
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    if (published === 'true') {
      whereClause.published = true;
    } else if (published === 'false') {
      whereClause.published = false;
    }
    
    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        destino: true,
        cotas: {
          include: {
            cotista: {
              select: { id: true, name: true, email: true }
            },
            _count: {
              select: {
                weekReservations: true,
                cobrancas: true,
              }
            }
          }
        },
        _count: {
          select: {
            cotas: true,
            assembleias: true,
            mensagens: true,
            documentos: true,
          }
        },
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

// POST /api/admin/propriedades - Criar nova propriedade
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.userType !== "admin") {
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
      },
      include: {
        destino: true,
      }
    });
    
    await createAuditLog({
      userId: session.user.id,
      action: "CREATE",
      entity: "Property",
      entityId: property.id,
      changes: validated,
    });
    
    revalidatePath("/admin-portal/propriedades");
    revalidatePath("/");
    revalidatePath("/casas");
    
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
