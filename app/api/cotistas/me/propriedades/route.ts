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

    const cotas = await prisma.cotaPropriedade.findMany({
      where: { cotistaId, ativo: true },
      include: {
        property: {
          include: {
            destino: { select: { name: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const byProp = new Map<
      string,
      {
        propertyId: string;
        name: string;
        cidade: string;
        location: string;
        destino: string;
        slug: string;
        totalCotas: number | null;
        coverImage: string | null;
        cotasCount: number;
      }
    >();

    for (const c of cotas) {
      const p = c.property;
      const existing = byProp.get(p.id);
      const images = p.images as unknown;
      const cover =
        Array.isArray(images) && images.length > 0 && typeof images[0] === "string"
          ? images[0]
          : null;

      if (existing) {
        existing.cotasCount += 1;
      } else {
        byProp.set(p.id, {
          propertyId: p.id,
          name: p.name,
          cidade: p.cidade,
          location: p.location,
          destino: p.destino.name,
          slug: p.slug,
          totalCotas: p.totalCotas,
          coverImage: cover,
          cotasCount: 1,
        });
      }
    }

    return NextResponse.json({
      propriedades: Array.from(byProp.values()),
    });
  } catch (error) {
    console.error("Erro ao listar propriedades do cotista:", error);
    return NextResponse.json(
      { error: "Erro ao carregar propriedades" },
      { status: 500 }
    );
  }
}
