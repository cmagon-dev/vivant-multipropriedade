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
    const trocas = await prisma.trocaSemana.findMany({
      where: { cotistaSolicitante: cotistaId },
      include: {
        reservas: {
          include: {
            cota: { include: { property: { select: { id: true, name: true } } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ trocas });
  } catch (e) {
    console.error("Erro ao listar trocas do cotista:", e);
    return NextResponse.json({ error: "Erro ao listar trocas" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;
    const body = await request.json().catch(() => ({}));
    const { observacoes, reservaOferecida, propriedadeDesejada, semanasDesejadas } = body;
    const troca = await prisma.trocaSemana.create({
      data: {
        cotistaSolicitante: cotistaId,
        status: "ABERTA",
        observacoes: observacoes ?? "Solicitação de troca de semanas",
        reservaOferecida: reservaOferecida || null,
        propriedadeDesejada: propriedadeDesejada || null,
        semanasDesejadas: semanasDesejadas ?? null,
      },
      include: {
        reservas: {
          include: {
            cota: { include: { property: { select: { id: true, name: true } } } },
          },
        },
      },
    });
    return NextResponse.json(troca);
  } catch (e) {
    console.error("Erro ao criar troca:", e);
    return NextResponse.json({ error: "Erro ao criar solicitação" }, { status: 500 });
  }
}
