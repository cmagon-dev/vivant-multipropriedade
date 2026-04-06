import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { Prisma, PropertyAssetCategory } from "@prisma/client";

function canManage(session: any) {
  if (!session || (session.user as { userType?: string }).userType !== "admin") return false;
  return hasPermission(session, "vivantCare.propriedades.manage");
}

const ALLOWED_CATEGORIES = new Set(Object.values(PropertyAssetCategory));

export async function PUT(
  request: NextRequest,
  context: { params: { id: string; assetId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!canManage(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const { id: propertyId, assetId } = context.params;
  const body = (await request.json().catch(() => null)) as
    | {
        name?: string;
        category?: string;
        unitValue?: number | string;
        quantity?: number;
        notes?: string | null;
        active?: boolean;
      }
    | null;

  const current = await prisma.propertyAsset.findFirst({ where: { id: assetId, propertyId } });
  if (!current) return NextResponse.json({ error: "Item não encontrado." }, { status: 404 });

  const category = (body?.category ?? current.category) as string;
  if (!ALLOWED_CATEGORIES.has(category as PropertyAssetCategory)) {
    return NextResponse.json({ error: "Categoria inválida." }, { status: 400 });
  }

  const quantity = body?.quantity !== undefined ? Number(body.quantity) : current.quantity;
  const unitValueNumber = body?.unitValue !== undefined ? Number(body.unitValue) : Number(current.unitValue);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return NextResponse.json({ error: "Quantidade inválida." }, { status: 400 });
  }
  if (!Number.isFinite(unitValueNumber) || unitValueNumber < 0) {
    return NextResponse.json({ error: "Valor unitário inválido." }, { status: 400 });
  }

  const unitValue = new Prisma.Decimal(unitValueNumber.toFixed(2));
  const totalValue = unitValue.mul(quantity);

  const updated = await prisma.propertyAsset.update({
    where: { id: assetId },
    data: {
      name: body?.name?.trim() || current.name,
      category: category as PropertyAssetCategory,
      unitValue,
      quantity,
      totalValue,
      notes: body?.notes?.trim() || null,
      ...(typeof body?.active === "boolean" ? { active: body.active } : {}),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  context: { params: { id: string; assetId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!canManage(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

  const { id: propertyId, assetId } = context.params;
  const current = await prisma.propertyAsset.findFirst({ where: { id: assetId, propertyId } });
  if (!current) return NextResponse.json({ error: "Item não encontrado." }, { status: 404 });

  await prisma.propertyAsset.delete({ where: { id: assetId } });
  return NextResponse.json({ success: true });
}

