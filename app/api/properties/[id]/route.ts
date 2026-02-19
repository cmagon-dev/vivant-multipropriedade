import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { propertyUpdateSchema } from "@/lib/validations/property-admin";
import { createAuditLog } from "@/lib/audit";
import { canDelete } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

// GET /api/properties/[id] - Buscar uma específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        destino: true,
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    if (!property) {
      return NextResponse.json(
        { error: "Propriedade não encontrada" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Erro ao buscar propriedade" },
      { status: 500 }
    );
  }
}

// PUT /api/properties/[id] - Atualizar
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
    const validated = propertyUpdateSchema.parse(body);
    
    const property = await prisma.property.update({
      where: { id: params.id },
      data: validated
    });
    
    await createAuditLog({
      userId: session.user.id,
      action: "UPDATE",
      entity: "Property",
      entityId: property.id,
      changes: validated,
    });
    
    revalidatePath("/casas");
    revalidatePath("/admin/casas");
    
    return NextResponse.json(property);
  } catch (error: any) {
    console.error("Error updating property:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao atualizar propriedade" },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[id] - Deletar
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
    await prisma.property.delete({
      where: { id: params.id }
    });
    
    await createAuditLog({
      userId: session.user.id,
      action: "DELETE",
      entity: "Property",
      entityId: params.id,
    });
    
    revalidatePath("/casas");
    revalidatePath("/admin/casas");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: "Erro ao deletar propriedade" },
      { status: 500 }
    );
  }
}
