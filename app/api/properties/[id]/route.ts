import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { propertyUpdateSchema } from "@/lib/validations/property-admin";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { deleteCapitalAssetConfigCascade } from "@/lib/capital/delete-asset-config-cascade";

// GET /api/properties/[id] - Buscar uma específica — exige properties.view
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (!hasPermission(session as any, "properties.view") && !hasPermission(session as any, "properties.manage")) {
    return NextResponse.json({ error: "Sem permissão para ver propriedade" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const property = await prisma.property.findUnique({
      where: { id },
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

// PUT /api/properties/[id] - Atualizar — exige properties.edit ou properties.manage
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (!hasPermission(session as any, "properties.edit") && !hasPermission(session as any, "properties.manage")) {
    return NextResponse.json({ error: "Sem permissão para editar propriedade" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const body = await request.json();
    const validated = propertyUpdateSchema.parse(body);
    
    const property = await prisma.property.update({
      where: { id },
      data: validated
    });
    
    await createAuditLog({
      userId: session.user.id,
      action: "UPDATE",
      entity: "Property",
      entityId: property.id,
      changes: validated,
    });
    
    revalidatePath("/");
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

// DELETE /api/properties/[id] - Deletar — exige properties.delete ou properties.manage
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (!hasPermission(session as any, "properties.delete") && !hasPermission(session as any, "properties.manage")) {
    return NextResponse.json({ error: "Sem permissão para excluir propriedade" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: { _count: { select: { cotas: true } } },
    });
    if (!property) {
      return NextResponse.json({ error: "Propriedade não encontrada" }, { status: 404 });
    }
    if (property._count.cotas > 0) {
      return NextResponse.json(
        {
          error:
            "Não é possível excluir propriedade com cotas alocadas. Remova as cotas antes.",
        },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const capitalCfg = await tx.capitalAssetConfig.findFirst({
        where: { propertyId: id },
        select: { id: true },
      });
      if (capitalCfg) {
        await deleteCapitalAssetConfigCascade(tx, capitalCfg.id);
      }
      await tx.property.delete({ where: { id } });
    });
    
    await createAuditLog({
      userId: session.user.id,
      action: "DELETE",
      entity: "Property",
      entityId: id,
    });
    
    revalidatePath("/");
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
