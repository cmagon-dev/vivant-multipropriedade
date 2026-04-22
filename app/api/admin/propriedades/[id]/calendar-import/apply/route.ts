import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { applyCalendarImport } from "@/lib/vivant/calendar-import-service";

const ParsedRowSchema = z.object({
  weekIndex: z.number().int().min(1).max(53),
  startDate: z.string(),
  endDate: z.string(),
  tier: z.enum(["GOLD", "SILVER", "BLACK"]),
  officialWeekType: z.enum([
    "TYPE_1",
    "TYPE_2",
    "TYPE_3",
    "TYPE_4",
    "TYPE_5",
    "TYPE_6",
    "EXTRA",
  ]),
  description: z.string().nullable(),
  cotaCode: z.enum(["A", "B", "C", "D", "E", "F", "EXTRA"]),
  isExtra: z.boolean(),
  lastUseNote: z.string().nullable(),
});

const BodySchema = z.object({
  year: z.number().int().min(2000).max(2100),
  rows: z.array(ParsedRowSchema).min(1),
  mode: z.enum(["replace", "merge"]),
  publish: z.boolean().optional(),
});

function canImport(session: unknown) {
  const s = session as { user?: { userType?: string } } | null;
  return (
    s?.user?.userType === "admin" &&
    hasPermission(session as any, "vivantCare.propriedades.manage")
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || !canImport(session)) {
      return NextResponse.json(
        { error: "Sem permissão para importar calendário" },
        { status: 403 }
      );
    }

    const propertyId = params.id;
    const json = await request.json();
    const parsedBody = BodySchema.safeParse(json);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Payload inválido", details: parsedBody.error.flatten() },
        { status: 400 }
      );
    }

    const { year, rows, mode, publish } = parsedBody.data;
    const doPublish = publish === true;

    const prop = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!prop) {
      return NextResponse.json({ error: "Propriedade não encontrada" }, { status: 404 });
    }

    const existing = await prisma.propertyCalendarYear.findUnique({
      where: { propertyId_year: { propertyId, year } },
    });

    if (existing && mode === "merge") {
      /* ok */
    } else if (existing && mode === "replace") {
      /* ok — serviço remove */
    } else if (!existing && mode === "merge") {
      /* primeiro ano — equivalente a criar */
    }

    const result = await applyCalendarImport({
      propertyId,
      year,
      rows: parsedBody.data.rows,
      mode,
      publish: doPublish,
    });

    return NextResponse.json({ ok: true, result });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro ao importar";
    console.error(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
