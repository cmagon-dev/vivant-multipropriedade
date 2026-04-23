import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "comercial.view"))
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") ?? undefined;
  const destinoId = searchParams.get("destinoId") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (destinoId) where.destinoId = destinoId;
  if (search) {
    where.OR = [
      { titulo: { contains: search, mode: "insensitive" } },
      { cidade: { contains: search, mode: "insensitive" } },
      { condominio: { contains: search, mode: "insensitive" } },
      { vendedorNome: { contains: search, mode: "insensitive" } },
    ];
  }

  const cadastros = await prisma.imovelCaptacao.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      destino: { select: { id: true, name: true, emoji: true } },
      responsavel: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(cadastros);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "comercial.view"))
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const body = await req.json();
  const user = session.user as { id?: string; sub?: string };
  const userId = user.id ?? user.sub;
  if (!userId) return NextResponse.json({ error: "Usuário inválido" }, { status: 400 });

  const {
    titulo, tipo, status,
    destinoId, condominio, endereco, numero, complemento, bairro, cidade, estado, cep,
    areaTotal, areaTerreno, areaConstruida,
    valorPedido, valorProposta, valorAcordado, valorReforma,
    numCotas, valorCota, vgvEstimado, margemEstimada, taxaOcupacao, rentabilidadeAnual,
    vendedorNome, vendedorTelefone, vendedorEmail, vendedorCpfCnpj, vendedorObservacoes,
    descricao, observacoes, motivoDeclinado, origem, responsavelId,
  } = body;

  if (!titulo?.trim()) {
    return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 });
  }

  // Substitui o placeholder ## pelo contador real (sequencial por ano)
  let tituloFinal: string = titulo.trim();
  if (tituloFinal.includes("##")) {
    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    const yearEnd   = new Date(new Date().getFullYear() + 1, 0, 1);
    const count = await prisma.imovelCaptacao.count({
      where: { createdAt: { gte: yearStart, lt: yearEnd } },
    });
    const seq = String(count + 1).padStart(2, "0");
    tituloFinal = tituloFinal.replace("##", seq);
  }

  const cadastro = await prisma.imovelCaptacao.create({
    data: {
      titulo: tituloFinal,
      tipo: tipo || null,
      status: status || "ANALISE_INICIAL",
      destinoId: destinoId || null,
      condominio: condominio || null,
      endereco: endereco || null,
      numero: numero || null,
      complemento: complemento || null,
      bairro: bairro || null,
      cidade: cidade || null,
      estado: estado || null,
      cep: cep || null,
      areaTotal: areaTotal ? Number(areaTotal) : null,
      areaTerreno: areaTerreno ? Number(areaTerreno) : null,
      areaConstruida: areaConstruida ? Number(areaConstruida) : null,
      valorPedido: valorPedido ? Number(valorPedido) : null,
      valorProposta: valorProposta ? Number(valorProposta) : null,
      valorAcordado: valorAcordado ? Number(valorAcordado) : null,
      valorReforma: valorReforma ? Number(valorReforma) : null,
      numCotas: numCotas ? Number(numCotas) : null,
      valorCota: valorCota ? Number(valorCota) : null,
      vgvEstimado: vgvEstimado ? Number(vgvEstimado) : null,
      margemEstimada: margemEstimada ? Number(margemEstimada) : null,
      taxaOcupacao: taxaOcupacao ? Number(taxaOcupacao) : null,
      rentabilidadeAnual: rentabilidadeAnual ? Number(rentabilidadeAnual) : null,
      vendedorNome: vendedorNome || null,
      vendedorTelefone: vendedorTelefone || null,
      vendedorEmail: vendedorEmail || null,
      vendedorCpfCnpj: vendedorCpfCnpj || null,
      vendedorObservacoes: vendedorObservacoes || null,
      descricao: descricao || null,
      observacoes: observacoes || null,
      motivoDeclinado: motivoDeclinado || null,
      origem: origem || null,
      responsavelId: responsavelId || null,
      createdById: userId,
    },
    include: {
      destino: { select: { id: true, name: true, emoji: true } },
      responsavel: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(cadastro, { status: 201 });
}
