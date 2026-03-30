"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

type SimpleUser = {
  id: string;
  name: string;
  email: string;
  active?: boolean;
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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [users, setUsers] = useState<SimpleUser[]>([]);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAssignedToUserId, setNewAssignedToUserId] = useState("");
  const [newPriority, setNewPriority] = useState<"LOW" | "MED" | "HIGH">("MED");
  const [newDueAt, setNewDueAt] = useState("");

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

  useEffect(() => {
    if (!isCreateOpen || users.length > 0) return;
    fetch("/api/users")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data: any[]) => {
        const mapped =
          Array.isArray(data) ?
          data.map((u) => ({
            id: u.id as string,
            name: u.name as string,
            email: u.email as string,
            active: (u as any).active ?? true,
          })) : [];
        setUsers(mapped.filter((u) => u.active !== false));
      })
      .catch(() => {
        // Se não conseguir carregar usuários, continua permitindo preencher manualmente (mas POST vai validar)
        setUsers([]);
      });
  }, [isCreateOpen, users.length]);

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

  const deleteTask = async (id: string) => {
    if (!confirm("Excluir esta tarefa? Esta ação não pode ser desfeita.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/tasks/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Tarefa excluída");
        load();
      } else {
        toast.error(data.error ?? "Erro ao excluir");
      }
    } catch {
      toast.error("Erro ao excluir");
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDescription("");
    setNewAssignedToUserId("");
    setNewPriority("MED");
    setNewDueAt("");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !newAssignedToUserId) {
      toast.error("Título, descrição e responsável são obrigatórios.");
      return;
    }
    setCreating(true);
    try {
      const body = {
        title: newTitle.trim(),
        description: newDescription.trim(),
        assignedToUserId: newAssignedToUserId,
        priority: newPriority,
        dueAt: newDueAt || null,
      };
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Erro ao criar tarefa");
        return;
      }
      toast.success("Tarefa criada com sucesso.");
      setIsCreateOpen(false);
      resetForm();
      load();
    } catch {
      toast.error("Erro ao criar tarefa");
    } finally {
      setCreating(false);
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
      <div className="flex gap-4 flex-wrap items-center justify-between">
        <div className="flex gap-4 flex-wrap items-center">
          <Select
            value={status || "all"}
            onValueChange={(v) => setStatus(v === "all" ? "" : v)}
          >
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
        <Button size="sm" className="bg-vivant-navy" onClick={() => setIsCreateOpen(true)}>
          Nova tarefa
        </Button>
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
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => deleteTask(t.id)}
                  disabled={deletingId === t.id}
                >
                  {deletingId === t.id ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-1" />
                  )}
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {tasks.length === 0 && (
        <p className="text-center text-gray-500 py-8">Nenhuma tarefa encontrada.</p>
      )}
      <p className="text-xs text-gray-500">Total: {total}</p>

      <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if (!open) resetForm(); }}>
        <DialogContent aria-describedby="new-task-description">
          <DialogHeader>
            <DialogTitle>Nova tarefa</DialogTitle>
            <DialogDescription id="new-task-description">
              Preencha os campos obrigatórios. A tarefa será criada como aberta e aparecerá na lista e no dashboard.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Revisar leads atrasados"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Detalhe o que precisa ser feito..."
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável
                </label>
                <Select
                  value={newAssignedToUserId || "none"}
                  onValueChange={(v) =>
                    setNewAssignedToUserId(v === "none" ? "" : v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Selecione...</SelectItem>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridade
                </label>
                <Select
                  value={newPriority}
                  onValueChange={(v) =>
                    setNewPriority(v as "LOW" | "MED" | "HIGH")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Baixa</SelectItem>
                    <SelectItem value="MED">Normal</SelectItem>
                    <SelectItem value="HIGH">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prazo (opcional)
              </label>
              <Input
                type="date"
                value={newDueAt}
                onChange={(e) => setNewDueAt(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateOpen(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? "Salvando..." : "Criar tarefa"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
