import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

const ALLOWED_MIMES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "text/plain",
  "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function canAccess(session: any) {
  if (!session || (session.user as { userType?: string }).userType !== "admin") return false;
  return hasPermission(session, "vivantCare.documentos.view") || hasPermission(session, "vivantCare.documentos.manage");
}

function canManage(session: any) {
  return canAccess(session) && hasPermission(session, "vivantCare.documentos.manage");
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!canAccess(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const where: { propertyId?: string; ativo?: boolean } = {};
    const sp = request.nextUrl.searchParams;
    if (sp.get("propertyId")) where.propertyId = sp.get("propertyId") as string;
    if (sp.get("ativo") === "true") where.ativo = true;
    if (sp.get("ativo") === "false") where.ativo = false;
    const documentos = await prisma.documento.findMany({
      where,
      include: { property: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json({ documentos });
  } catch (e) {
    console.error("Erro ao listar documentos:", e);
    return NextResponse.json({ error: "Erro ao listar documentos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!canManage(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const propertyId = formData.get("propertyId") as string | null;
    const titulo = formData.get("titulo") as string | null;
    const descricao = (formData.get("descricao") as string) || null;
    const tipo = (formData.get("tipo") as string) || "OUTROS";
    const categoria = (formData.get("categoria") as string) || null;

    if (!propertyId || !titulo?.trim()) {
      return NextResponse.json({ error: "Propriedade e título são obrigatórios" }, { status: 400 });
    }
    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Envie um arquivo" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Arquivo muito grande (máx 10MB)" }, { status: 400 });
    }
    if (!ALLOWED_MIMES.includes(file.type)) {
      return NextResponse.json({ error: "Tipo não permitido. Use PDF, imagens ou Word." }, { status: 400 });
    }

    const blob = await put("documentos/" + file.name, file, { access: "public", addRandomSuffix: true });
    const doc = await prisma.documento.create({
      data: {
        propertyId,
        titulo: titulo.trim(),
        descricao: descricao?.trim() || null,
        tipo: tipo as "ESTATUTO" | "REGIMENTO_INTERNO" | "ATA" | "CONTRATO" | "MANUAL" | "PLANTA" | "LAUDO" | "OUTROS",
        categoria: categoria?.trim() || null,
        url: blob.url,
        nomeArquivo: file.name,
        tamanhoBytes: file.size,
        mimeType: file.type,
        uploadedBy: session?.user?.id ?? null,
        ativo: true,
      },
      include: { property: { select: { id: true, name: true } } },
    });
    return NextResponse.json(doc);
  } catch (e) {
    console.error("Erro ao criar documento:", e);
    return NextResponse.json({ error: "Erro ao criar documento" }, { status: 500 });
  }
}
