import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import {
  letterFromNumeroCota,
  parseExcelBuffer,
} from "@/lib/vivant/calendar-spreadsheet";

const MAX_BYTES = 6 * 1024 * 1024;

function canAccess(session: unknown) {
  const s = session as { user?: { userType?: string } } | null;
  return (
    s?.user?.userType === "admin" &&
    (hasPermission(session as any, "vivantCare.propriedades.view") ||
      hasPermission(session as any, "vivantCare.propriedades.manage"))
  );
}

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
    const session = await getServerSession(authOptions);
    if (!session || !canAccess(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    if (!canImport(session)) {
      return NextResponse.json(
        { error: "Sem permissão para importar calendário" },
        { status: 403 }
      );
    }

    const propertyId = params.id;
    const prop = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, name: true },
    });
    if (!prop) {
      return NextResponse.json({ error: "Propriedade não encontrada" }, { status: 404 });
    }

    const form = await request.formData();
    const file = form.get("file");
    const yearRaw = form.get("year");

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "Envie um arquivo Excel (.xlsx)." }, { status: 400 });
    }

    const year = parseInt(String(yearRaw ?? ""), 10);
    if (!Number.isFinite(year) || year < 2000 || year > 2100) {
      return NextResponse.json({ error: "Ano inválido." }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Arquivo muito grande (máx. 6 MB)." },
        { status: 400 }
      );
    }

    const buf = await file.arrayBuffer();
    const parsed = parseExcelBuffer(buf, year);

    const existing = await prisma.propertyCalendarYear.findUnique({
      where: { propertyId_year: { propertyId, year } },
      include: { _count: { select: { weeks: true } } },
    });

    const cotasDb = await prisma.cotaPropriedade.findMany({
      where: { propertyId },
      select: { id: true, numeroCota: true },
    });

    if (!parsed.ok) {
      return NextResponse.json({
        ok: false,
        errors: parsed.errors,
        warnings: parsed.warnings,
        existingCalendar: existing
          ? {
              id: existing.id,
              year: existing.year,
              status: existing.status,
              weekCount: existing._count.weeks,
            }
          : null,
        property: { id: prop.id, name: prop.name },
      });
    }

    const lettersNeeded = parsed.preview.cotaLettersNeeded;
    const missingLetters: string[] = [];
    const have = new Set<string>();
    for (const c of cotasDb) {
      const L = letterFromNumeroCota(c.numeroCota);
      if (L) have.add(L);
    }
    for (const L of lettersNeeded) {
      if (!have.has(L)) missingLetters.push(L);
    }

    return NextResponse.json({
      ok: true,
      rows: parsed.rows,
      preview: parsed.preview,
      warnings: parsed.warnings,
      cotasWillBeCreated: missingLetters,
      existingCalendar: existing
        ? {
            id: existing.id,
            year: existing.year,
            status: existing.status,
            weekCount: existing._count.weeks,
          }
        : null,
      property: { id: prop.id, name: prop.name },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao validar planilha" },
      { status: 500 }
    );
  }
}
