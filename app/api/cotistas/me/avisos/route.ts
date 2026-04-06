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
      select: { propertyId: true, property: { select: { condominio: true, destinoId: true } } },
    });

    const propertyIds = Array.from(new Set(cotasAtivas.map((c) => c.propertyId)));
    const condominios = Array.from(new Set(cotasAtivas.map((c) => c.property.condominio).filter(Boolean)));
    const destinoIds = Array.from(new Set(cotasAtivas.map((c) => c.property.destinoId).filter(Boolean)));

    if (propertyIds.length === 0) {
      return NextResponse.json({ avisos: [] });
    }

    const avisos = await prisma.mensagem.findMany({
      where: {
        ativa: true,
        OR: [
          // Compatibilidade legado (antigos sem targetType explícito)
          { propertyId: { in: propertyIds } },
          { targetType: "CASA", propertyId: { in: propertyIds } },
          { targetType: "COTISTA", targetCotistaId: cotistaId },
          { targetType: "CONDOMINIO", targetCondominio: { in: condominios as string[] } },
          { targetType: "DESTINO", targetDestinoId: { in: destinoIds as string[] } },
        ],
      },
      include: {
        property: { select: { id: true, name: true } },
        targetCotista: { select: { id: true, name: true } },
        targetDestino: { select: { id: true, name: true } },
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
