import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";
import { allocatedWeeksByCotaId } from "@/lib/vivant/cotista-allocated-weeks";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;

    const yearParam = request.nextUrl.searchParams.get("year");
    const year = yearParam
      ? parseInt(yearParam, 10)
      : new Date().getFullYear();

    const cotas = await prisma.cotaPropriedade.findMany({
      where: {
        cotistaId,
        ativo: true
      },
      include: {
        property: {
          include: {
            destino: true
          }
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    const byCota = await allocatedWeeksByCotaId(
      cotas.map((c) => c.id),
      year
    );

    const formattedCotas = cotas.map((cota) => ({
      id: cota.id,
      name: cota.property.name,
      location: cota.property.location,
      numeroCota: cota.numeroCota,
      semanasAno: cota.semanasAno,
      destino: cota.property.destino.name,
      semanasAlocadas: byCota.get(cota.id) ?? [],
      property: {
        id: cota.property.id,
        name: cota.property.name,
        location: cota.property.location,
        images: cota.property.images,
      },
    }));

    return NextResponse.json({
      cotas: formattedCotas,
      anoSemanasAlocadas: year,
    });

  } catch (error) {
    console.error("Erro ao carregar cotas:", error);
    return NextResponse.json(
      { error: "Erro ao carregar cotas" },
      { status: 500 }
    );
  }
}
