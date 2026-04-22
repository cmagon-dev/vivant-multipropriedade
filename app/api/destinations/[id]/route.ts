import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { destinationUpdateSchema } from "@/lib/validations/destination-admin";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

// GET /api/destinations/[id] - Buscar um específico — exige destinations.view
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (!hasPermission(session as any, "destinations.view") && !hasPermission(session as any, "destinations.manage")) {
    return NextResponse.json({ error: "Sem permissão para ver destino" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const destination = await prisma.destination.findUnique({
      where: { id },
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

// PUT /api/destinations/[id] - Atualizar — exige destinations.edit ou destinations.manage
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (!hasPermission(session as any, "destinations.edit") && !hasPermission(session as any, "destinations.manage")) {
    return NextResponse.json({ error: "Sem permissão para editar destino" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const body = await request.json();
    const validated = destinationUpdateSchema.parse(body);
    
    const destination = await prisma.destination.update({
      where: { id },
      data: validated
    });
    
    await createAuditLog({
      userId: session.user.id,
      action: "UPDATE",
      entity: "Destination",
      entityId: destination.id,
      changes: validated,
    });
    
    revalidatePath("/");
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

// DELETE /api/destinations/[id] - Deletar — exige destinations.delete ou destinations.manage
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (!hasPermission(session as any, "destinations.delete") && !hasPermission(session as any, "destinations.manage")) {
    return NextResponse.json({ error: "Sem permissão para excluir destino" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const propertiesCount = await prisma.property.count({
      where: { destinoId: id }
    });
    
    if (propertiesCount > 0) {
      return NextResponse.json(
        { error: `Não é possível deletar. Existem ${propertiesCount} propriedades vinculadas a este destino.` },
        { status: 400 }
      );
    }
    
    await prisma.destination.delete({
      where: { id }
    });
    
    await createAuditLog({
      userId: session.user.id,
      action: "DELETE",
      entity: "Destination",
      entityId: id,
    });
    
    revalidatePath("/");
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
