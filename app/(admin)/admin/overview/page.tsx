import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Activity, CheckSquare, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { getUserContext } from "@/lib/auth/getUserContext";
import { HelpTip } from "@/components/help/HelpTip";

export default async function AdminOverviewPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const ctx = await getUserContext();
  const canViewEvents = ctx && (ctx.role === "OWNER" || ctx.role === "SUPER_ADMIN" || ctx.permissions.includes("events.view"));
  const canViewTasks = ctx && (ctx.role === "OWNER" || ctx.role === "SUPER_ADMIN" || ctx.permissions.includes("tasks.view"));
  const canViewSla = ctx && (ctx.role === "OWNER" || ctx.role === "SUPER_ADMIN" || ctx.permissions.includes("sla.manage") || ctx.permissions.includes("crm.manage") || ctx.permissions.includes("tasks.view"));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const [eventsToday, eventsCritical, tasksOpen, tasksOverdue, slaOverdueCount, slaOverdueLeads, slaBreachedThisWeek] = await Promise.all([
    canViewEvents ? prisma.systemEvent.count({ where: { createdAt: { gte: today, lt: tomorrow } } }) : 0,
    canViewEvents ? prisma.systemEvent.count({ where: { severity: "CRITICAL", status: "PENDING" } }) : 0,
    canViewTasks ? prisma.systemTask.count({ where: { status: "OPEN" } }) : 0,
    canViewTasks ? prisma.systemTask.count({ where: { status: "OPEN", dueAt: { lt: today, not: null } } }) : 0,
    canViewSla
      ? prisma.lead.count({
          where: {
            status: "ACTIVE",
            stageDueAt: { lt: today, not: null },
            stageEnteredAt: { not: null },
          },
        })
      : 0,
    canViewSla
      ? prisma.lead.findMany({
          where: {
            status: "ACTIVE",
            stageDueAt: { lt: today, not: null },
            stageEnteredAt: { not: null },
          },
          select: {
            id: true,
            name: true,
            stageDueAt: true,
            stage: { select: { name: true } },
            owner: { select: { name: true } },
          },
          orderBy: { stageDueAt: "asc" },
          take: 10,
        })
      : [],
    canViewSla
      ? prisma.leadSlaEvent.count({
          where: { type: "SLA_BREACHED", createdAt: { gte: startOfWeek } },
        })
      : 0,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-vivant-navy">Visão do Dono</h1>
          <HelpTip helpKey="admin.overview" fallbackTitle="Visão geral" fallbackText="Resumo de eventos e pendências do sistema para o Dono." />
        </div>
        {ctx && (
          <p className="text-sm text-gray-500">
            Logado como: <strong>{ctx.role}</strong> — {ctx.displayName}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {canViewEvents && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Eventos hoje</CardTitle>
                <Activity className="w-5 h-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-vivant-navy">{eventsToday}</div>
                <Link href="/admin/events" className="text-xs text-vivant-navy hover:underline">Ver todos</Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Críticos pendentes</CardTitle>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{eventsCritical}</div>
                <Link href="/admin/events?severity=CRITICAL" className="text-xs text-vivant-navy hover:underline">Ver eventos</Link>
              </CardContent>
            </Card>
          </>
        )}
        {canViewTasks && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tarefas abertas</CardTitle>
                <CheckSquare className="w-5 h-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-vivant-navy">{tasksOpen}</div>
                <Link href="/admin/tasks" className="text-xs text-vivant-navy hover:underline">Ver todas</Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tarefas atrasadas</CardTitle>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{tasksOverdue}</div>
                <Link href="/admin/tasks?status=OPEN" className="text-xs text-vivant-navy hover:underline">Ver tarefas</Link>
              </CardContent>
            </Card>
          </>
        )}
        {canViewSla && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">ALERTA vencidos — atrasados agora</CardTitle>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{slaOverdueCount}</div>
                <Link href="/dashboard/comercial/leads" className="text-xs text-vivant-navy hover:underline">Ver Kanban</Link>
                {Array.isArray(slaOverdueLeads) && slaOverdueLeads.length > 0 && (
                  <ul className="mt-2 text-xs space-y-1">
                    {slaOverdueLeads.slice(0, 5).map((l) => (
                      <li key={l.id} className="flex justify-between gap-2">
                        <span className="truncate">{l.name}</span>
                        <span className="text-red-600 shrink-0">
                          {l.stageDueAt
                            ? `${Math.round((today.getTime() - new Date(l.stageDueAt).getTime()) / (1000 * 60 * 60))}h`
                            : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Leads que atrasaram na semana</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-vivant-navy">{slaBreachedThisWeek}</div>
                <p className="text-xs text-muted-foreground">Leads com ALERTA vencido nos últimos 7 dias</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {(!canViewEvents && !canViewTasks && !canViewSla) && (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            Você não tem permissão para ver eventos ou tarefas. Acesse o Dashboard para outras opções.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
