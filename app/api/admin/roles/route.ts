import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/api/withPermission";

async function getHandler(request: NextRequest) {
  const roles = await prisma.role.findMany({
    include: {
      _count: { select: { rolePermissions: true, userRoleAssignments: true } },
      rolePermissions: { include: { permission: { select: { id: true, key: true, name: true, group: true } } } },
    },
    orderBy: { key: "asc" },
  });
  return NextResponse.json(roles);
}

async function postHandler(request: NextRequest) {
  const body = await request.json();
  const { key, name, description } = body as { key: string; name: string; description?: string };
  if (!key?.trim() || !name?.trim()) {
    return NextResponse.json({ error: "key e name são obrigatórios" }, { status: 400 });
  }
  const role = await prisma.role.create({
    data: { key: key.trim().toUpperCase().replace(/\s/g, "_"), name: name.trim(), description: description?.trim() || null, isSystem: false },
  });
  return NextResponse.json(role, { status: 201 });
}

export const GET = withPermission("roles.manage")(getHandler);
export const POST = withPermission("roles.manage")(postHandler);
