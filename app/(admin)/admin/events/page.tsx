import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { EventsList } from "@/components/admin/events-list";

export default async function AdminEventsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!hasPermission(session as any, "events.view")) redirect("/admin/overview");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Eventos do sistema</h1>
        <p className="text-gray-600">Visibilidade de ações nos painéis para o Dono</p>
      </div>
      <EventsList />
    </div>
  );
}
