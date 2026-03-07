import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/api/withPermission";

async function getHandler(
  request: NextRequest,
  context: { params?: { id?: string } }
) {
  const id = context.params?.id;
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  const item = await prisma.helpContent.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(item);
}

async function patchHandler(
  request: NextRequest,
  context: { params?: { id?: string } }
) {
  const id = context.params?.id;
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  const body = await request.json();
  const { key, title, description, shortText, videoUrl, audienceRole } = body as {
    key?: string;
    title?: string;
    description?: string;
    shortText?: string;
    videoUrl?: string;
    audienceRole?: string;
  };
  const item = await prisma.helpContent.update({
    where: { id },
    data: {
      ...(key !== undefined && { key: key.trim() }),
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description?.trim() || null }),
      ...(shortText !== undefined && { shortText: shortText?.trim() || null }),
      ...(videoUrl !== undefined && { videoUrl: videoUrl?.trim() || null }),
      ...(audienceRole !== undefined && { audienceRole: audienceRole?.trim() || null }),
    },
  });
  return NextResponse.json(item);
}

async function deleteHandler(
  request: NextRequest,
  context: { params?: { id?: string } }
) {
  const id = context.params?.id;
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  await prisma.helpContent.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export const GET = withPermission("help.manage")(getHandler);
export const PATCH = withPermission("help.manage")(patchHandler);
export const DELETE = withPermission("help.manage")(deleteHandler);
