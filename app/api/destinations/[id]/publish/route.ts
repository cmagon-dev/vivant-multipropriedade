import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAdminSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { canPublish } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

// PATCH /api/destinations/[id]/publish - Toggle published
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  
  if (!session || !session.user.role || !canPublish(session.user.role)) {
    return NextResponse.json(
      { error: "Não autorizado" },
      { status: 401 }
    );
  }
  
  try {
    const body = await request.json();
    const { published } = body;
    
    const destination = await prisma.destination.update({
      where: { id: params.id },
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
