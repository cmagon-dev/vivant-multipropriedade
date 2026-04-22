import { prisma } from "@/lib/prisma";
import { UserForm } from "@/components/admin/user-form";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || !hasPermission(session as any, "users.manage")) {
    redirect("/admin/overview");
  }
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      active: true,
      defaultRoute: true,
      userRoleAssignments: {
        take: 1,
        orderBy: { id: "asc" as const },
        select: { role: { select: { key: true, name: true } } },
      },
      userPermissions: {
        select: { permission: { select: { key: true } } },
      },
    },
  });

  if (!user) notFound();

  const roleKey = user.userRoleAssignments?.[0]?.role?.key ?? null;
  const extraPermissionKeys = (user.userPermissions ?? []).map((up) => up.permission.key);
  const userForForm = {
    id: user.id,
    name: user.name,
    email: user.email,
    active: user.active,
    defaultRoute: user.defaultRoute,
    roleKey,
    extraPermissionKeys,
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Editar Usuário</h1>
        <p className="text-gray-600">{user.name}</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <UserForm user={userForForm} />
      </div>
    </div>
  );
}
