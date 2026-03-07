"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";

type Task = {
  id: string;
  createdAt: string;
  dueAt: string | null;
  status: string;
  title: string;
  description: string | null;
  priority: string;
  assignedToUserId: string | null;
  assignedTo?: { id: string; name: string; email: string } | null;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
};

const USER_COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-orange-500",
];

function hashUserId(userId: string): number {
  let h = 0;
  const prime = 31;
  for (let i = 0; i < userId.length; i++) {
    h = h * prime + userId.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Retorna classe Tailwind estável por userId (círculo colorido). */
function getStableColorForUser(userId: string): string {
  return USER_COLORS[hashUserId(userId) % USER_COLORS.length];
}

function getUserColorClass(userId: string | null): string {
  if (!userId) return "bg-gray-300";
  return getStableColorForUser(userId);
}

export function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("");
  const [mineOnly, setMineOnly] = useState(false);

  const load = () => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (mineOnly) params.set("mine", "true");
    params.set("limit", "50");
    fetch(`/api/admin/tasks?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setTasks(d.tasks ?? []);
        setTotal(d.total ?? 0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, [status, mineOnly]);

  const markDone = async (id: string) => {
    try {
      const res = await fetch("/api/admin/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "DONE" }),
      });
      if (res.ok) {
        toast.success("Tarefa concluída");
        load();
      } else toast.error("Erro ao atualizar");
    } catch {
      toast.error("Erro ao atualizar");
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-vivant-navy" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap items-center">
        <Select value={status || "all"} onValueChange={(v) => setStatus(v === "all" ? "" : v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="OPEN">Abertas</SelectItem>
            <SelectItem value="DONE">Concluídas</SelectItem>
            <SelectItem value="CANCELED">Canceladas</SelectItem>
          </SelectContent>
        </Select>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={mineOnly}
            onChange={(e) => setMineOnly(e.target.checked)}
            className="rounded border-gray-300"
          />
          Minhas tarefas
        </label>
      </div>
      <div className="grid gap-3">
        {tasks.map((t) => (
          <Card key={t.id}>
            <CardContent className="py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium text-gray-900">{t.title}</p>
                {t.description && <p className="text-sm text-gray-500 truncate">{t.description}</p>}
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <span
                    className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${getUserColorClass(t.assignedToUserId ?? null)}`}
                    title={t.assignedTo?.name ?? "Sem responsável"}
                  />
                  <span>{t.assignedTo?.name ?? "Sem responsável"}</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {t.priority} · {t.relatedEntityType && `${t.relatedEntityType} ${t.relatedEntityId ?? ""}`}
                  {t.dueAt && ` · Venc. ${format(new Date(t.dueAt), "dd/MM/yyyy", { locale: ptBR })}`}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs px-2 py-1 rounded bg-gray-100">{t.status}</span>
                {t.status === "OPEN" && (
                  <Button size="sm" variant="outline" onClick={() => markDone(t.id)}>
                    <Check className="w-4 h-4 mr-1" />
                    Concluir
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {tasks.length === 0 && (
        <p className="text-center text-gray-500 py-8">Nenhuma tarefa encontrada.</p>
      )}
      <p className="text-xs text-gray-500">Total: {total}</p>
    </div>
  );
}
