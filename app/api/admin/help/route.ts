import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/api/withPermission";

async function getHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const list = await prisma.helpContent.findMany({
    where: key ? { key: { contains: key, mode: "insensitive" } } : undefined,
    orderBy: { key: "asc" },
  });
  return NextResponse.json(list);
}

async function postHandler(request: NextRequest) {
  const body = await request.json();
  const { key, title, description, shortText, videoUrl, audienceRole } = body as {
    key: string;
    title: string;
    description?: string;
    shortText?: string;
    videoUrl?: string;
    audienceRole?: string;
  };
  if (!key?.trim() || !title?.trim()) {
    return NextResponse.json({ error: "key e title são obrigatórios" }, { status: 400 });
  }
  const created = await prisma.helpContent.create({
    data: {
      key: key.trim(),
      title: title.trim(),
      description: description?.trim() || null,
      shortText: shortText?.trim() || null,
      videoUrl: videoUrl?.trim() || null,
      audienceRole: audienceRole?.trim() || null,
    },
  });
  return NextResponse.json(created, { status: 201 });
}

export const GET = withPermission("help.manage")(getHandler);
export const POST = withPermission("help.manage")(postHandler);
