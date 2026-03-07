import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

/** POST — criar etapa (crm.manage) */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "crm.manage")) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const { leadTypeId, name, order, isFinal, finalStatus, slaHours, isActive } = body as {
    leadTypeId?: string;
    name?: string;
    order?: number;
    isFinal?: boolean;
    finalStatus?: "WON" | "LOST";
    slaHours?: number | null;
    isActive?: boolean;
  };
  if (!leadTypeId || !name?.trim()) return NextResponse.json({ error: "leadTypeId e name são obrigatórios" }, { status: 400 });

  const orderNum = typeof order === "number" && Number.isFinite(order) ? Math.round(order) : parseInt(String(order), 10);
  if (Number.isNaN(orderNum) || orderNum < 1) return NextResponse.json({ error: "order deve ser um número válido (>= 1)" }, { status: 400 });

  try {
    const created = await prisma.leadStage.create({
      data: {
        leadTypeId,
        name: name.trim(),
        order: orderNum,
        isFinal: isFinal ?? false,
        finalStatus: isFinal && finalStatus ? finalStatus : null,
        slaHours: slaHours != null ? (typeof slaHours === "number" ? slaHours : parseInt(String(slaHours), 10)) : null,
        isActive: isActive ?? true,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[POST /api/crm/lead-stages]", err);
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Unique constraint") || msg.includes("leadTypeId_order")) {
      return NextResponse.json({ error: "Já existe uma etapa com essa ordem neste funil. Use outra ordem." }, { status: 400 });
    }
    if (msg.includes("Foreign key") || msg.includes("leadTypeId")) {
      return NextResponse.json({ error: "Tipo de funil inválido." }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao criar etapa. Tente novamente." }, { status: 500 });
  }
}
