import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

const includeFields = {
  destino: { select: { id: true, name: true, emoji: true } },
  responsavel: { select: { id: true, name: true } },
  createdBy: { select: { id: true, name: true } },
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "comercial.view"))
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const { id } = await params;
  const cadastro = await prisma.imovelCaptacao.findUnique({
    where: { id },
    include: includeFields,
  });

  if (!cadastro) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(cadastro);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "comercial.view"))
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.imovelCaptacao.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  const toDecimal = (v: unknown) => (v !== undefined && v !== "" && v !== null ? Number(v) : null);

  const updated = await prisma.imovelCaptacao.update({
    where: { id },
    data: {
      titulo: body.titulo?.trim() ?? existing.titulo,
      tipo: "tipo" in body ? (body.tipo || null) : undefined,
      status: "status" in body ? body.status : undefined,
      destinoId: "destinoId" in body ? (body.destinoId || null) : undefined,
      condominio: "condominio" in body ? (body.condominio || null) : undefined,
      endereco: "endereco" in body ? (body.endereco || null) : undefined,
      numero: "numero" in body ? (body.numero || null) : undefined,
      complemento: "complemento" in body ? (body.complemento || null) : undefined,
      bairro: "bairro" in body ? (body.bairro || null) : undefined,
      cidade: "cidade" in body ? (body.cidade || null) : undefined,
      estado: "estado" in body ? (body.estado || null) : undefined,
      cep: "cep" in body ? (body.cep || null) : undefined,
      areaTotal: "areaTotal" in body ? toDecimal(body.areaTotal) : undefined,
      areaTerreno: "areaTerreno" in body ? toDecimal(body.areaTerreno) : undefined,
      areaConstruida: "areaConstruida" in body ? toDecimal(body.areaConstruida) : undefined,
      valorPedido: "valorPedido" in body ? toDecimal(body.valorPedido) : undefined,
      valorProposta: "valorProposta" in body ? toDecimal(body.valorProposta) : undefined,
      valorAcordado: "valorAcordado" in body ? toDecimal(body.valorAcordado) : undefined,
      valorReforma: "valorReforma" in body ? toDecimal(body.valorReforma) : undefined,
      numCotas: "numCotas" in body ? (body.numCotas ? Number(body.numCotas) : null) : undefined,
      valorCota: "valorCota" in body ? toDecimal(body.valorCota) : undefined,
      vgvEstimado: "vgvEstimado" in body ? toDecimal(body.vgvEstimado) : undefined,
      margemEstimada: "margemEstimada" in body ? toDecimal(body.margemEstimada) : undefined,
      taxaOcupacao: "taxaOcupacao" in body ? toDecimal(body.taxaOcupacao) : undefined,
      rentabilidadeAnual: "rentabilidadeAnual" in body ? toDecimal(body.rentabilidadeAnual) : undefined,
      vendedorNome: "vendedorNome" in body ? (body.vendedorNome || null) : undefined,
      vendedorTelefone: "vendedorTelefone" in body ? (body.vendedorTelefone || null) : undefined,
      vendedorEmail: "vendedorEmail" in body ? (body.vendedorEmail || null) : undefined,
      vendedorCpfCnpj: "vendedorCpfCnpj" in body ? (body.vendedorCpfCnpj || null) : undefined,
      vendedorObservacoes: "vendedorObservacoes" in body ? (body.vendedorObservacoes || null) : undefined,
      descricao: "descricao" in body ? (body.descricao || null) : undefined,
      observacoes: "observacoes" in body ? (body.observacoes || null) : undefined,
      motivoDeclinado: "motivoDeclinado" in body ? (body.motivoDeclinado || null) : undefined,
      origem: "origem" in body ? (body.origem || null) : undefined,
      responsavelId: "responsavelId" in body ? (body.responsavelId || null) : undefined,
    },
    include: includeFields,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "comercial.view"))
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const { id } = await params;
  const existing = await prisma.imovelCaptacao.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  await prisma.imovelCaptacao.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
