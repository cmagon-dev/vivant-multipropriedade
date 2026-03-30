import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;

    const notificacoes = await prisma.notificacao.findMany({
      where: { cotistaId: auth.cotistaId, lida: false },
      orderBy: { createdAt: "desc" },
      take: 15,
      select: {
        id: true,
        tipo: true,
        titulo: true,
        mensagem: true,
        lida: true,
        url: true,
        propertyId: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { notificacoes },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Erro ao carregar notificações:", error);
    return NextResponse.json(
      { error: "Erro ao carregar notificações" },
      { status: 500 }
    );
  }
}
