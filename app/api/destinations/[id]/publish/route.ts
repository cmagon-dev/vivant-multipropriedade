import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

// PATCH /api/destinations/[id]/publish - Toggle published — exige destinations.edit ou destinations.manage
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (!hasPermission(session as any, "destinations.edit") && !hasPermission(session as any, "destinations.manage")) {
    return NextResponse.json({ error: "Sem permissão para publicar destino" }, { status: 403 });
  }
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { published } = body;
    
    const destination = await prisma.destination.update({
      where: { id },
      data: {
        published,
        publishedAt: published ? new Date() : null
      }
    });
    
    await createAuditLog({
      userId: session.user.id,
      action: published ? "PUBLISH" : "UNPUBLISH",
      entity: "Destination",
      entityId: destination.id,
      changes: { published },
    });
    
    revalidatePath("/");
    revalidatePath("/destinos");
    revalidatePath("/admin/destinos");
    
    return NextResponse.json(destination);
  } catch (error) {
    console.error("Error publishing destination:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar status" },
      { status: 500 }
    );
  }
}
