import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;

    const cobranca = await prisma.cobranca.findFirst({
      where: {
        id: params.id,
        cota: {
          cotistaId
        }
      }
    });

    if (!cobranca) {
      return NextResponse.json(
        { error: "Cobrança não encontrada" },
        { status: 404 }
      );
    }

    if (cobranca.status === "PAGA") {
      return NextResponse.json(
        { error: "Esta cobrança já foi paga" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Arquivo não enviado" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Arquivo muito grande (máx. 5MB)" },
        { status: 400 }
      );
    }

    const blob = await put(
      `comprovantes/${params.id}-${Date.now()}.${file.name.split('.').pop()}`,
      file,
      {
        access: "public",
        addRandomSuffix: false,
      }
    );

    await prisma.cobranca.update({
      where: { id: params.id },
      data: {
        urlComprovante: blob.url,
      }
    });

    return NextResponse.json({
      success: true,
      url: blob.url
    });

  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload do comprovante" },
      { status: 500 }
    );
  }
}
