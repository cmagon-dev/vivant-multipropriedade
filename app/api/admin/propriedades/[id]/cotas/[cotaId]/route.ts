import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAdminSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; cotaId: string } }
) {
  try {
    const session = await getAdminSession();

    if (!session || session.user.userType !== "admin") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { semanasConfig, percentualCota, semanasAno, ativo } = body;

    const cota = await prisma.cotaPropriedade.findUnique({
      where: { id: params.cotaId },
    });

    if (!cota) {
      return NextResponse.json(
        { error: "Cota não encontrada" },
        { status: 404 }
      );
    }

    if (cota.propertyId !== params.id) {
      return NextResponse.json(
        { error: "Cota não pertence a esta propriedade" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    
    if (semanasConfig !== undefined) {
      updateData.semanasConfig = semanasConfig;
    }
    
    if (percentualCota !== undefined) {
      updateData.percentualCota = percentualCota;
    }
    
    if (semanasAno !== undefined) {
      updateData.semanasAno = semanasAno;
    }
    
    if (ativo !== undefined) {
      updateData.ativo = ativo;
    }

    const cotaAtualizada = await prisma.cotaPropriedade.update({
      where: { id: params.cotaId },
      data: updateData,
      include: {
        cotista: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    await createAuditLog({
      userId: session.user.id,
      action: "UPDATE",
      entity: "CotaPropriedade",
      entityId: params.cotaId,
      changes: updateData,
    });

    revalidatePath(`/admin-portal/propriedades/${params.id}`);
    revalidatePath(`/admin-portal/propriedades/${params.id}/calendario`);

    return NextResponse.json(cotaAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar cota:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar cota" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; cotaId: string } }
) {
  try {
    const session = await getAdminSession();

    if (!session || session.user.userType !== "admin") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const cota = await prisma.cotaPropriedade.findUnique({
      where: { id: params.cotaId },
      include: {
        reservas: true,
      }
    });

    if (!cota) {
      return NextResponse.json(
        { error: "Cota não encontrada" },
        { status: 404 }
      );
    }

    if (cota.propertyId !== params.id) {
      return NextResponse.json(
        { error: "Cota não pertence a esta propriedade" },
        { status: 400 }
      );
    }

    if (cota.reservas.length > 0) {
      return NextResponse.json(
        { error: "Não é possível deletar cota com reservas existentes" },
        { status: 400 }
      );
    }

    await prisma.cotaPropriedade.delete({
      where: { id: params.cotaId }
    });

    await createAuditLog({
      userId: session.user.id,
      action: "DELETE",
      entity: "CotaPropriedade",
      entityId: params.cotaId,
      changes: { numeroCota: cota.numeroCota },
    });

    revalidatePath(`/admin-portal/propriedades/${params.id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar cota:", error);
    return NextResponse.json(
      { error: "Erro ao deletar cota" },
      { status: 500 }
    );
  }
}
