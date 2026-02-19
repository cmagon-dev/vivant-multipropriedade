import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { destinationUpdateSchema } from "@/lib/validations/destination-admin";
import { createAuditLog } from "@/lib/audit";
import { canDelete } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

// GET /api/destinations/[id] - Buscar um específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const destination = await prisma.destination.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        properties: {
          select: { id: true, name: true, published: true }
        }
      }
    });
    
    if (!destination) {
      return NextResponse.json(
        { error: "Destino não encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(destination);
  } catch (error) {
    console.error("Error fetching destination:", error);
    return NextResponse.json(
      { error: "Erro ao buscar destino" },
      { status: 500 }
    );
  }
}

// PUT /api/destinations/[id] - Atualizar
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
    return NextResponse.json(
      { error: "Não autorizado" },
      { status: 401 }
    );
  }
  
  try {
    const body = await request.json();
    const validated = destinationUpdateSchema.parse(body);
    
    const destination = await prisma.destination.update({
      where: { id: params.id },
      data: validated
    });
    
    await createAuditLog({
      userId: session.user.id,
      action: "UPDATE",
      entity: "Destination",
      entityId: destination.id,
      changes: validated,
    });
    
    revalidatePath("/destinos");
    revalidatePath("/admin/destinos");
    
    return NextResponse.json(destination);
  } catch (error: any) {
    console.error("Error updating destination:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao atualizar destino" },
      { status: 500 }
    );
  }
}

// DELETE /api/destinations/[id] - Deletar
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || !canDelete(session.user.role)) {
    return NextResponse.json(
      { error: "Não autorizado" },
      { status: 401 }
    );
  }
  
  try {
    // Verificar se há propriedades vinculadas
    const propertiesCount = await prisma.property.count({
      where: { destinoId: params.id }
    });
    
    if (propertiesCount > 0) {
      return NextResponse.json(
        { error: `Não é possível deletar. Existem ${propertiesCount} propriedades vinculadas a este destino.` },
        { status: 400 }
      );
    }
    
    await prisma.destination.delete({
      where: { id: params.id }
    });
    
    await createAuditLog({
      userId: session.user.id,
      action: "DELETE",
      entity: "Destination",
      entityId: params.id,
    });
    
    revalidatePath("/destinos");
    revalidatePath("/admin/destinos");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting destination:", error);
    return NextResponse.json(
      { error: "Erro ao deletar destino" },
      { status: 500 }
    );
  }
}
