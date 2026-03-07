import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { TasksList } from "@/components/admin/tasks-list";

export default async function AdminTasksPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!hasPermission(session as any, "tasks.view")) redirect("/admin/overview");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Tarefas e pendências</h1>
        <p className="text-gray-600">Acompanhe e feche pendências</p>
      </div>
      <TasksList />
    </div>
  );
}
