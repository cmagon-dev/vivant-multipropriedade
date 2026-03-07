import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

/** GET — lista roles (RBAC) para select de criação/edição de usuário. users.manage */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "users.manage")) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }
  const roles = await prisma.role.findMany({
    orderBy: { key: "asc" },
    select: { id: true, key: true, name: true, description: true },
  });
  return NextResponse.json(roles);
}
