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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const cotasAtivas = await prisma.cotaPropriedade.findMany({
      where: { cotistaId, ativo: true },
      select: { propertyId: true },
    });

    const propertyIds = Array.from(new Set(cotasAtivas.map((c) => c.propertyId)));

    if (propertyIds.length === 0) {
      return NextResponse.json({ avisos: [] });
    }

    const avisos = await prisma.mensagem.findMany({
      where: {
        propertyId: { in: propertyIds },
        ativa: true,
      },
      include: {
        property: { select: { id: true, name: true } },
      },
      orderBy: [{ fixada: "desc" }, { createdAt: "desc" }],
      take: Math.min(Math.max(limit, 1), 100),
    });

    return NextResponse.json(
      { avisos },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      }
    );

  } catch (error) {
    console.error("Erro ao carregar avisos:", error);
    return NextResponse.json(
      { error: "Erro ao carregar avisos" },
      { status: 500 }
    );
  }
}
