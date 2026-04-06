import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { Prisma, PropertyAssetCategory } from "@prisma/client";
import * as XLSX from "xlsx";

function canView(session: any) {
  if (!session || (session.user as { userType?: string }).userType !== "admin") return false;
  return hasPermission(session, "vivantCare.propriedades.view") || hasPermission(session, "vivantCare.propriedades.manage");
}

function canManage(session: any) {
  return canView(session) && hasPermission(session, "vivantCare.propriedades.manage");
}

const ALLOWED_CATEGORIES = new Set(Object.values(PropertyAssetCategory));
const EXCEL_HEADERS = ["nome", "categoria", "quantidade", "valorUnitario", "observacoes"] as const;

function normalizeCategory(raw: string): PropertyAssetCategory | null {
  const normalized = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim()
    .replace(/[,\-/]/g, "_")
    .replace(/\s+/g, "_");

  if (ALLOWED_CATEGORIES.has(normalized as PropertyAssetCategory)) {
    return normalized as PropertyAssetCategory;
  }

  const map: Record<string, PropertyAssetCategory> = {
    MOVEIS: "MOVEIS",
    ELETRODOMESTICOS: "ELETRODOMESTICOS",
    ELETRONICOS: "ELETRONICOS",
    UTENSILIOS: "UTENSILIOS",
    DECORACAO: "DECORACAO",
    CAMA_MESA_E_BANHO: "CAMA_MESA_BANHO",
    CAMA_MESA_BANHO: "CAMA_MESA_BANHO",
    AREA_EXTERNA: "AREA_EXTERNA",
    OUTROS: "OUTROS",
  };
  return map[normalized] ?? null;
}

function getCategoryLabel(category: PropertyAssetCategory): string {
  const labels: Record<PropertyAssetCategory, string> = {
    MOVEIS: "Móveis",
    ELETRODOMESTICOS: "Eletrodomésticos",
    ELETRONICOS: "Eletrônicos",
    UTENSILIOS: "Utensílios",
    DECORACAO: "Decoração",
    CAMA_MESA_BANHO: "Cama, mesa e banho",
    AREA_EXTERNA: "Área externa",
    OUTROS: "Outros",
  };
  return labels[category] ?? category;
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!canView(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const propertyId = context.params.id;
  const format = request.nextUrl.searchParams.get("format");
  const assets = await prisma.propertyAsset.findMany({
    where: { propertyId },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  if (format === "xlsx") {
    const rows = assets.map((asset) => ({
      nome: asset.name,
      categoria: getCategoryLabel(asset.category),
      quantidade: asset.quantity,
      valorUnitario: Number(asset.unitValue),
      valorTotal: Number(asset.totalValue),
      observacoes: asset.notes ?? "",
    }));

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, sheet, "Imobilizado");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="imobilizado-${propertyId}.xlsx"`,
      },
    });
  }

  return NextResponse.json({ assets });
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!canManage(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const propertyId = context.params.id;
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo Excel é obrigatório." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return NextResponse.json({ error: "Planilha inválida." }, { status: 400 });
    }

    const sheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, string | number>>(sheet, { defval: "" });
    if (rows.length === 0) {
      return NextResponse.json({ error: "Planilha sem dados para importar." }, { status: 400 });
    }

    const toCreate: Prisma.PropertyAssetCreateManyInput[] = [];
    for (const row of rows) {
      const name = String(row.nome ?? row.Nome ?? "").trim();
      const categoryRaw = String(row.categoria ?? row.Categoria ?? "OUTROS");
      const quantity = Number(row.quantidade ?? row.Quantidade ?? 1);
      const unitValueNumber = Number(row.valorUnitario ?? row.ValorUnitario ?? 0);
      const notesRaw = String(row.observacoes ?? row.Observacoes ?? "").trim();
      const category = normalizeCategory(categoryRaw) ?? "OUTROS";

      if (!name) continue;
      if (!Number.isFinite(quantity) || quantity <= 0) continue;
      if (!Number.isFinite(unitValueNumber) || unitValueNumber < 0) continue;

      const unitValue = new Prisma.Decimal(unitValueNumber.toFixed(2));
      toCreate.push({
        propertyId,
        name,
        category,
        quantity,
        unitValue,
        totalValue: unitValue.mul(quantity),
        notes: notesRaw || null,
        active: true,
      });
    }

    if (toCreate.length === 0) {
      return NextResponse.json(
        { error: `Nenhuma linha válida encontrada. Use colunas: ${EXCEL_HEADERS.join(", ")}` },
        { status: 400 }
      );
    }

    await prisma.propertyAsset.createMany({ data: toCreate });
    return NextResponse.json({ imported: toCreate.length }, { status: 201 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        name?: string;
        category?: string;
        unitValue?: number | string;
        quantity?: number;
        notes?: string | null;
      }
    | null;

  const name = body?.name?.trim();
  const category = body?.category?.trim() ?? "OUTROS";
  const quantity = Number(body?.quantity ?? 1);
  const unitValueNumber = Number(body?.unitValue ?? 0);

  if (!name) return NextResponse.json({ error: "Nome do item é obrigatório." }, { status: 400 });
  if (!ALLOWED_CATEGORIES.has(category as PropertyAssetCategory)) {
    return NextResponse.json({ error: "Categoria inválida." }, { status: 400 });
  }
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return NextResponse.json({ error: "Quantidade inválida." }, { status: 400 });
  }
  if (!Number.isFinite(unitValueNumber) || unitValueNumber < 0) {
    return NextResponse.json({ error: "Valor unitário inválido." }, { status: 400 });
  }

  const unitValue = new Prisma.Decimal(unitValueNumber.toFixed(2));
  const totalValue = unitValue.mul(quantity);

  const asset = await prisma.propertyAsset.create({
    data: {
      propertyId,
      name,
      category: category as PropertyAssetCategory,
      unitValue,
      quantity,
      totalValue,
      notes: body?.notes?.trim() || null,
      active: true,
    },
  });

  return NextResponse.json(asset, { status: 201 });
}

