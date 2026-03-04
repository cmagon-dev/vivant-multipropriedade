import { NextRequest, NextResponse } from "next/server";
import { getCotistaSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getCotistaSession();

    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const cotista = await prisma.cotista.findUnique({
      where: { id: session.user.id },
      include: {
        cotas: {
          select: { propertyId: true }
        }
      }
    });

    if (!cotista) {
      return NextResponse.json(
        { error: "Cotista não encontrado" },
        { status: 404 }
      );
    }

    const propertyIds = cotista.cotas.map(c => c.propertyId);

    const avisos = await prisma.mensagem.findMany({
      where: {
        propertyId: { in: propertyIds },
        ativa: true
      },
      orderBy: [
        { fixada: "desc" },
        { createdAt: "desc" }
      ],
      take: limit
    });

    return NextResponse.json({ avisos });

  } catch (error) {
    console.error("Erro ao carregar avisos:", error);
    return NextResponse.json(
      { error: "Erro ao carregar avisos" },
      { status: 500 }
    );
  }
}
