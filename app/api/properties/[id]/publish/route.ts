import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

// PATCH /api/properties/[id]/publish - Toggle published — exige properties.edit ou properties.manage
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (!hasPermission(session as any, "properties.edit") && !hasPermission(session as any, "properties.manage")) {
    return NextResponse.json({ error: "Sem permissão para publicar propriedade" }, { status: 403 });
  }
  const { id } = await params;
  try {
    const body = await request.json();
    const { published } = body;
    
    const property = await prisma.property.update({
      where: { id },
      data: {
        published,
        publishedAt: published ? new Date() : null
      }
    });
    
    await createAuditLog({
      userId: session.user.id,
      action: published ? "PUBLISH" : "UNPUBLISH",
      entity: "Property",
      entityId: property.id,
      changes: { published },
    });
    
    revalidatePath("/");
    revalidatePath("/casas");
    revalidatePath("/admin/casas");
    
    return NextResponse.json(property);
  } catch (error) {
    console.error("Error publishing property:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar status" },
      { status: 500 }
    );
  }
}
