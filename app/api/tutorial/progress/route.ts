import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** GET ?key=xxx - Retorna progresso do tutorial. Persistido só para admin (User); cotista usa localStorage. */
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const key = request.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "key obrigatório" }, { status: 400 });
  const userType = (session.user as { userType?: string }).userType;
  if (userType !== "admin") return NextResponse.json(null);
  const userId = session.user.id;
  const progress = await prisma.userTutorialProgress.findUnique({
    where: { userId_key: { userId, key } },
  });
  return NextResponse.json(progress ?? null);
}

/** POST - body: { key, completed?: boolean, dismissed?: boolean }. Persistido só para admin (User). */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const body = await request.json();
  const { key, completed, dismissed } = body as { key: string; completed?: boolean; dismissed?: boolean };
  if (!key?.trim()) return NextResponse.json({ error: "key obrigatório" }, { status: 400 });
  const userType = (session.user as { userType?: string }).userType;
  if (userType !== "admin") return NextResponse.json({ ok: true });
  const userId = session.user.id;
  const now = new Date();
  const data: { completedAt?: Date | null; dismissedAt?: Date | null } = {};
  if (completed === true) data.completedAt = now;
  if (dismissed === true) data.dismissedAt = now;
  const progress = await prisma.userTutorialProgress.upsert({
    where: { userId_key: { userId, key } },
    update: data,
    create: {
      userId,
      key,
      ...(data.completedAt && { completedAt: data.completedAt }),
      ...(data.dismissedAt && { dismissedAt: data.dismissedAt }),
    },
  });
  return NextResponse.json(progress);
}
