import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;

    const cotista = await prisma.cotista.findUnique({
      where: { id: cotistaId },
      include: { cotas: { select: { propertyId: true } } },
    });
    if (!cotista) {
      return NextResponse.json({ error: "Cotista não encontrado" }, { status: 404 });
    }
    const propertyIds = cotista.cotas.map((c) => c.propertyId);
    if (propertyIds.length === 0) {
      return NextResponse.json({ assembleias: [] });
    }
    const assembleias = await prisma.assembleia.findMany({
      where: { propertyId: { in: propertyIds }, status: { not: "CANCELADA" } },
      include: {
        property: { select: { id: true, name: true } },
        pautas: { orderBy: { ordem: "asc" }, select: { id: true, ordem: true, titulo: true, tipo: true, requererVotacao: true, votacaoAberta: true } },
      },
      orderBy: { dataRealizacao: "desc" },
      take: 50,
    });
    return NextResponse.json({ assembleias });
  } catch (error) {
    console.error("Erro ao carregar assembleias:", error);
    return NextResponse.json({ error: "Erro ao carregar assembleias" }, { status: 500 });
  }
}
