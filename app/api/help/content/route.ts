import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** GET /api/help/content?key=xxx - Retorna HelpContent pela key (usuário autenticado). */
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const key = request.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "key obrigatório" }, { status: 400 });
  const content = await prisma.helpContent.findUnique({
    where: { key: key.trim() },
  });
  return NextResponse.json(content ?? null);
}
