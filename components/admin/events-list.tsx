"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";

type Event = {
  id: string;
  createdAt: string;
  actorUserId: string | null;
  actorRole: string | null;
  actorUser?: { id: string; name: string; email: string } | null;
  type: string;
  entityType: string | null;
  entityId: string | null;
  severity: string;
  status: string;
  message: string;
  meta: unknown;
};

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<string>("");
  const [severity, setSeverity] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (severity) params.set("severity", severity);
    params.set("limit", "50");
    fetch(`/api/admin/events?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setEvents(d.events ?? []);
        setTotal(d.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [type, severity]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-vivant-navy" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <Select value={severity || "all"} onValueChange={(v) => setSeverity(v === "all" ? "" : v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Severidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="INFO">INFO</SelectItem>
            <SelectItem value="WARN">WARN</SelectItem>
            <SelectItem value="CRITICAL">CRITICAL</SelectItem>
          </SelectContent>
        </Select>
        <Select value={type || "all"} onValueChange={(v) => setType(v === "all" ? "" : v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="auth.login">auth.login</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3">Data</th>
                  <th className="text-left p-3">Tipo</th>
                  <th className="text-left p-3">Severidade</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Mensagem</th>
                  <th className="text-left p-3">Ator</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{format(new Date(e.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}</td>
                    <td className="p-3">{e.type}</td>
                    <td className="p-3">
                      <span className={e.severity === "CRITICAL" ? "text-red-600" : e.severity === "WARN" ? "text-amber-600" : ""}>
                        {e.severity}
                      </span>
                    </td>
                    <td className="p-3">{e.status}</td>
                    <td className="p-3 max-w-xs truncate">{e.message}</td>
                    <td className="p-3">
                      {e.actorUser ? (
                        <div>
                          <div className="font-medium text-gray-900">{e.actorUser.name || e.actorUser.email}</div>
                          <div className="text-xs text-gray-500">{e.actorUser.email}</div>
                        </div>
                      ) : e.actorUserId ? (
                        <span className="text-xs text-amber-600">Usuário removido</span>
                      ) : e.actorRole ? (
                        <span className="text-sm text-gray-600">{e.actorRole}</span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {events.length === 0 && (
            <p className="p-6 text-center text-gray-500">Nenhum evento encontrado.</p>
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-gray-500">Total: {total}</p>
    </div>
  );
}
