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
    const propertyId = request.nextUrl.searchParams.get("propertyId");

    const cotas = await prisma.cotaPropriedade.findMany({
      where: { cotistaId, ativo: true },
      select: { propertyId: true, property: { select: { id: true, name: true } } },
    });
    const allowedPropertyIds = cotas.map((c) => c.propertyId);

    if (allowedPropertyIds.length === 0) {
      return NextResponse.json({ assets: [], totalGeral: 0 });
    }

    const where =
      propertyId && allowedPropertyIds.includes(propertyId)
        ? { propertyId, active: true }
        : { propertyId: { in: allowedPropertyIds }, active: true };

    const assets = await prisma.propertyAsset.findMany({
      where,
      include: { property: { select: { id: true, name: true } } },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    const totalGeral = assets.reduce((acc, item) => acc + Number(item.totalValue), 0);

    return NextResponse.json({ assets, totalGeral });
  } catch (error) {
    console.error("Erro ao carregar imobilizado do cotista:", error);
    return NextResponse.json({ error: "Erro ao carregar imobilizado" }, { status: 500 });
  }
}

