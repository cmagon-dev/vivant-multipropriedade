import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    const cotista = await prisma.cotista.findUnique({
      where: { inviteToken: token },
      include: {
        cotas: {
          include: {
            property: {
              include: {
                destino: true
              }
            }
          }
        }
      }
    });

    if (!cotista) {
      return NextResponse.json(
        { error: "Convite não encontrado" },
        { status: 404 }
      );
    }

    if (cotista.active) {
      return NextResponse.json(
        { error: "Este convite já foi aceito" },
        { status: 400 }
      );
    }

    if (cotista.inviteTokenExpiry && cotista.inviteTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: "Este convite expirou" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      cotista: {
        name: cotista.name,
        email: cotista.email,
        cotas: cotista.cotas.map(cota => ({
          id: cota.id,
          numeroCota: cota.numeroCota,
          semanasAno: cota.semanasAno,
          property: {
            name: cota.property.name,
            location: cota.property.location,
            destino: cota.property.destino.name
          }
        }))
      }
    });

  } catch (error) {
    console.error("Erro ao validar convite:", error);
    return NextResponse.json(
      { error: "Erro ao validar convite" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const session = await getSession();
    if (!session || (session.user as { userType?: string }).userType !== "admin") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const canManage =
      hasPermission(session as any, "vivantCare.convites.manage") ||
      (session.user as { role?: string }).role === "ADMIN";
    if (!canManage) {
      return NextResponse.json(
        { error: "Sem permissão para excluir convites" },
        { status: 403 }
      );
    }

    const convite = await prisma.cotista.findUnique({
      where: { id: params.token },
      select: { id: true, active: true, inviteToken: true },
    });

    if (!convite) {
      return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 });
    }

    if (convite.active || !convite.inviteToken) {
      return NextResponse.json(
        { error: "Somente convites pendentes podem ser excluídos" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.cotaPropriedade.deleteMany({
        where: { cotistaId: convite.id },
      });
      await tx.cotista.delete({
        where: { id: convite.id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir convite:", error);
    return NextResponse.json({ error: "Erro ao excluir convite" }, { status: 500 });
  }
}
