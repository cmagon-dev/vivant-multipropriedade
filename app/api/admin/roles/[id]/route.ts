import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withPermission } from "@/lib/api/withPermission";

async function getHandler(
  request: NextRequest,
  context: { params?: { id?: string } }
) {
  const id = context.params?.id;
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      rolePermissions: { include: { permission: true } },
      _count: { select: { userRoleAssignments: true } },
    },
  });
  if (!role) return NextResponse.json({ error: "Role não encontrada" }, { status: 404 });
  return NextResponse.json(role);
}

async function patchHandler(
  request: NextRequest,
  context: { params?: { id?: string } }
) {
  const id = context.params?.id;
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  const body = await request.json();
  const { name, description, permissionIds } = body as {
    name?: string;
    description?: string;
    permissionIds?: string[];
  };
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) return NextResponse.json({ error: "Role não encontrada" }, { status: 404 });
  if (role.isSystem && (body.key !== undefined)) {
    return NextResponse.json({ error: "Não é possível alterar key de role de sistema" }, { status: 400 });
  }
  const updateData: { name?: string; description?: string | null } = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description || null;
  if (Object.keys(updateData).length > 0) {
    await prisma.role.update({ where: { id }, data: updateData });
  }
  if (Array.isArray(permissionIds)) {
    await prisma.rolePermission.deleteMany({ where: { roleId: id } });
    if (permissionIds.length > 0) {
      await prisma.rolePermission.createMany({
        data: permissionIds.map((permissionId: string) => ({ roleId: id, permissionId })),
        skipDuplicates: true,
      });
    }
  }
  const updated = await prisma.role.findUnique({
    where: { id },
    include: { rolePermissions: { include: { permission: true } } },
  });
  return NextResponse.json(updated);
}

export const GET = withPermission("roles.manage")(getHandler);
export const PATCH = withPermission("roles.manage")(patchHandler);
