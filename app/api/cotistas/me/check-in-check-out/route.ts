import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";
import { CheckoutOccurrenceType, PropertyAssetCategory } from "@prisma/client";

const allowedOccurrenceTypes = new Set(Object.values(CheckoutOccurrenceType));
const allowedCategories = new Set(Object.values(PropertyAssetCategory));

type OccurrencePayload = {
  assetId?: string | null;
  category?: string;
  occurrenceType?: string;
  description?: string;
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;
    const propertyId = request.nextUrl.searchParams.get("propertyId");

    const cotas = await prisma.cotaPropriedade.findMany({
      where: { cotistaId, ativo: true },
      select: {
        propertyId: true,
        property: { select: { id: true, name: true } },
      },
    });
    const allowedPropertyIds = cotas.map((c) => c.propertyId);
    if (!allowedPropertyIds.length) return NextResponse.json({ reports: [] });

    const where =
      propertyId && allowedPropertyIds.includes(propertyId)
        ? { cotistaId, propertyId }
        : { cotistaId, propertyId: { in: allowedPropertyIds } };

    const reports = await prisma.checkinCheckoutReport.findMany({
      where,
      include: {
        property: { select: { id: true, name: true } },
        occurrences: {
          include: { asset: { select: { id: true, name: true, category: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Erro ao carregar check-in/check-out:", error);
    return NextResponse.json({ error: "Erro ao carregar dados" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;

    const body = (await request.json().catch(() => null)) as
      | {
          propertyId?: string;
          reservaId?: string | null;
          expectedCheckinDate?: string | null;
          expectedCheckinTime?: string | null;
          expectedCheckoutDate?: string | null;
          expectedCheckoutTime?: string | null;
          hadBrokenItem?: boolean;
          hadMaintenance?: boolean;
          description?: string | null;
          observations?: string | null;
          occurrences?: OccurrencePayload[];
        }
      | null;

    if (!body?.propertyId) {
      return NextResponse.json({ error: "Propriedade é obrigatória." }, { status: 400 });
    }

    const cota = await prisma.cotaPropriedade.findFirst({
      where: { cotistaId, propertyId: body.propertyId, ativo: true },
      select: { id: true },
    });
    if (!cota) {
      return NextResponse.json({ error: "Propriedade inválida para este cotista." }, { status: 403 });
    }

    const occurrences = Array.isArray(body.occurrences) ? body.occurrences : [];
    for (const occurrence of occurrences) {
      if (!occurrence.description?.trim()) {
        return NextResponse.json({ error: "Descrição da ocorrência é obrigatória." }, { status: 400 });
      }
      if (!occurrence.occurrenceType || !allowedOccurrenceTypes.has(occurrence.occurrenceType as CheckoutOccurrenceType)) {
        return NextResponse.json({ error: "Tipo de ocorrência inválido." }, { status: 400 });
      }
      if (occurrence.category && !allowedCategories.has(occurrence.category as PropertyAssetCategory)) {
        return NextResponse.json({ error: "Categoria inválida na ocorrência." }, { status: 400 });
      }
      if (occurrence.assetId) {
        const asset = await prisma.propertyAsset.findFirst({
          where: { id: occurrence.assetId, propertyId: body.propertyId, active: true },
          select: { id: true },
        });
        if (!asset) {
          return NextResponse.json({ error: "Item de imobilizado inválido na ocorrência." }, { status: 400 });
        }
      }
    }

    const report = await prisma.checkinCheckoutReport.create({
      data: {
        propertyId: body.propertyId,
        cotistaId,
        reservaId: body.reservaId || null,
        expectedCheckinDate: body.expectedCheckinDate ? new Date(body.expectedCheckinDate) : null,
        expectedCheckinTime: body.expectedCheckinTime || null,
        expectedCheckoutDate: body.expectedCheckoutDate ? new Date(body.expectedCheckoutDate) : null,
        expectedCheckoutTime: body.expectedCheckoutTime || null,
        hadBrokenItem: !!body.hadBrokenItem,
        hadMaintenance: !!body.hadMaintenance,
        description: body.description?.trim() || null,
        observations: body.observations?.trim() || null,
        occurrences: occurrences.length
          ? {
              create: occurrences.map((occurrence) => ({
                propertyId: body.propertyId!,
                assetId: occurrence.assetId || null,
                category: (occurrence.category as PropertyAssetCategory) || "OUTROS",
                occurrenceType: occurrence.occurrenceType as CheckoutOccurrenceType,
                description: occurrence.description!.trim(),
              })),
            }
          : undefined,
      },
      include: {
        occurrences: true,
      },
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar check-in/check-out:", error);
    return NextResponse.json({ error: "Erro ao salvar check-in/check-out" }, { status: 500 });
  }
}

