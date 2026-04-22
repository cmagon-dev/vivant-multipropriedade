import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";
import { allocatedWeeksByCotaId } from "@/lib/vivant/cotista-allocated-weeks";

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;

    const { id: propertyId } = await ctx.params;

    const temCota = await prisma.cotaPropriedade.findFirst({
      where: {
        cotistaId,
        propertyId,
        ativo: true,
      },
      select: { id: true },
    });

    if (!temCota) {
      return NextResponse.json(
        { error: "Propriedade não encontrada ou sem cota vinculada" },
        { status: 404 }
      );
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        destino: {
          select: {
            id: true,
            name: true,
            slug: true,
            subtitle: true,
            location: true,
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json({ error: "Propriedade não encontrada" }, { status: 404 });
    }

    const minhasCotas = await prisma.cotaPropriedade.findMany({
      where: {
        cotistaId,
        propertyId,
        ativo: true,
      },
      select: {
        id: true,
        numeroCota: true,
        percentualCota: true,
        semanasAno: true,
        dataAquisicao: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const {
      createdById: _c,
      ...rest
    } = property;

    const year = new Date().getFullYear();
    const byCota = await allocatedWeeksByCotaId(
      minhasCotas.map((c) => c.id),
      year
    );

    return NextResponse.json({
      property: rest,
      anoSemanasAlocadas: year,
      cotas: minhasCotas.map((c) => ({
        ...c,
        percentualCota: Number(c.percentualCota),
        semanasAlocadas: byCota.get(c.id) ?? [],
      })),
    });
  } catch (error) {
    console.error("Erro ao carregar propriedade do cotista:", error);
    return NextResponse.json(
      { error: "Erro ao carregar propriedade" },
      { status: 500 }
    );
  }
}
