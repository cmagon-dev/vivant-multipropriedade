import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;

    const { id } = await ctx.params;
    const cotista = await prisma.cotista.findUnique({
      where: { id: cotistaId },
      include: { cotas: { select: { propertyId: true } } },
    });
    if (!cotista) return NextResponse.json({ error: "Cotista não encontrado" }, { status: 404 });
    const propertyIds = cotista.cotas.map((c) => c.propertyId);
    const a = await prisma.assembleia.findFirst({
      where: { id, propertyId: { in: propertyIds } },
      include: {
        property: { select: { id: true, name: true } },
        pautas: { orderBy: { ordem: "asc" }, include: { _count: { select: { votos: true } } } },
      },
    });
    if (!a) return NextResponse.json({ error: "Assembleia não encontrada" }, { status: 404 });
    return NextResponse.json(a);
  } catch (e) {
    console.error("Erro ao buscar assembleia:", e);
    return NextResponse.json({ error: "Erro ao buscar assembleia" }, { status: 500 });
  }
}
