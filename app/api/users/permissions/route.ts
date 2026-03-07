import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

/** GET — lista permissões agrupadas por group (users.manage). Para uso no form de criar usuário (overrides). */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "users.manage")) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }
  const permissions = await prisma.permission.findMany({
    orderBy: [{ group: "asc" }, { key: "asc" }],
    select: { id: true, key: true, name: true, group: true },
  });
  const byGroup = permissions.reduce(
    (acc, p) => {
      const g = p.group || "outros";
      if (!acc[g]) acc[g] = [];
      acc[g].push(p);
      return acc;
    },
    {} as Record<string, { id: string; key: string; name: string; group: string }[]>
  );
  const grouped = Object.entries(byGroup).map(([group, perms]) => ({ group, permissions: perms }));
  return NextResponse.json(grouped);
}
