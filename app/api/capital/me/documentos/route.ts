import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCapitalInvestorProfileId, isCapitalInvestor } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";

/** Lista documentos dos imóveis em que o investidor participa (reaproveita Documento do Property). */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!isCapitalInvestor(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const profileId = await getCapitalInvestorProfileId(session);
    if (!profileId) return NextResponse.json({ error: "Perfil de investidor não encontrado" }, { status: 403 });

    const participations = await prisma.capitalParticipation.findMany({
      where: { investorProfileId: profileId, status: "ATIVO" },
      select: { assetConfigId: true, assetConfig: { select: { propertyId: true } } },
    });
    const propertyIds = Array.from(new Set(participations.map((p) => p.assetConfig.propertyId)));

    const documentos = await prisma.documento.findMany({
      where: { propertyId: { in: propertyIds }, ativo: true },
      include: { property: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      documentos: documentos.map((d) => ({
        id: d.id,
        propertyName: d.property.name,
        tipo: d.tipo,
        nomeArquivo: d.nomeArquivo,
        url: d.url,
        createdAt: d.createdAt,
      })),
    });
  } catch (e) {
    console.error("Erro ao listar documentos investidor:", e);
    return NextResponse.json({ error: "Erro ao listar documentos" }, { status: 500 });
  }
}
