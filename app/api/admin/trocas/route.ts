import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

function canAccess(session: any) {
  if (!session || (session.user as { userType?: string }).userType !== "admin") return false;
  return hasPermission(session, "vivantCare.trocas.view") || hasPermission(session, "vivantCare.trocas.manage");
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!canAccess(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const sp = request.nextUrl.searchParams;
    const status = sp.get("status") || undefined;
    const where = status ? { status: status as "ABERTA" | "EM_NEGOCIACAO" | "ACEITA" | "CONCLUIDA" | "CANCELADA" | "EXPIRADA" } : {};
    const trocas = await prisma.trocaSemana.findMany({
      where,
      include: {
        solicitante: { select: { id: true, name: true, email: true } },
        reservas: { include: { cota: { include: { property: { select: { id: true, name: true } } } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json({ trocas });
  } catch (e) {
    console.error("Erro ao listar trocas:", e);
    return NextResponse.json({ error: "Erro ao listar trocas" }, { status: 500 });
  }
}
