"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpTip } from "@/components/help/HelpTip";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const NEXT_ACTION_TYPES = ["CALL", "WHATSAPP", "PROPOSAL", "VISIT", "NOTE"] as const;

type LeadType = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  order: number;
  isActive: boolean;
  initialStageId: string | null;
  initialStage?: { id: string; name: string } | null;
  stages: { id: string; name: string; order: number; slaHours: number | null; slaEnabled?: boolean; slaThresholds?: { color: string; hoursLeft: number }[] | null; isFinal: boolean; finalStatus: string | null; whatsTemplate?: string | null; playbookChecklist?: string[] | null; helpText?: string | null; nextActionType?: string | null }[];
};

type LossReason = {
  id: string;
  leadTypeId: string;
  name: string;
  order: number;
  isActive: boolean;
  leadType?: { id: string; key: string; name: string };
};

type AssignmentItem = {
  leadType: { id: string; key: string; name: string; order: number };
  assignment: {
    id: string;
    leadTypeId: string;
    defaultOwnerUserId: string;
    isActive: boolean;
    defaultOwner: { id: string; name: string; email: string };
  } | null;
};

export function CrmManager() {
  const [types, setTypes] = useState<LeadType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTypeOpen, setNewTypeOpen] = useState(false);
  const [newTypeKey, setNewTypeKey] = useState("");
  const [newTypeName, setNewTypeName] = useState("");
  const [savingType, setSavingType] = useState(false);
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [lossReasons, setLossReasons] = useState<LossReason[]>([]);
  const [editingLossId, setEditingLossId] = useState<string | null>(null);
  const [newLossOpen, setNewLossOpen] = useState(false);
  const [newLossLeadTypeId, setNewLossLeadTypeId] = useState("");
  const [newLossName, setNewLossName] = useState("");
  const [savingLoss, setSavingLoss] = useState(false);
  const [assignmentList, setAssignmentList] = useState<AssignmentItem[]>([]);
  const [commercialUsers, setCommercialUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [savingAssignment, setSavingAssignment] = useState<string | null>(null);
  const [deleteTypeId, setDeleteTypeId] = useState<string | null>(null);
  const [deletingTypeId, setDeletingTypeId] = useState<string | null>(null);
  const [deleteStageId, setDeleteStageId] = useState<string | null>(null);
  const [deletingStageId, setDeletingStageId] = useState<string | null>(null);

  const fetchTypes = () =>
    fetch("/api/crm/lead-types?all=true")
      .then((r) => r.json())
      .then((data: unknown) => setTypes(Array.isArray(data) ? data : []))
      .catch(() => {
        setTypes([]);
        toast.error("Erro ao carregar tipos");
      });

  const fetchLossReasons = () =>
    fetch("/api/crm/loss-reasons?all=true")
      .then((r) => r.json())
      .then(setLossReasons)
      .catch(() => setLossReasons([]));

  useEffect(() => {
    fetchTypes().finally(() => setLoading(false));
  }, []);

  const fetchAssignments = () =>
    fetch("/api/crm/assignments")
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as { list?: AssignmentItem[]; commercialUsers?: { id: string; name: string; email: string }[] } | null;
        setAssignmentList(Array.isArray(d?.list) ? d.list : []);
        setCommercialUsers(Array.isArray(d?.commercialUsers) ? d.commercialUsers : []);
      })
      .catch(() => {
        setAssignmentList([]);
        setCommercialUsers([]);
      });

  useEffect(() => {
    if (!loading) fetchAssignments();
  }, [loading]);

  const saveAssignment = async (leadTypeId: string, defaultOwnerUserId: string) => {
    setSavingAssignment(leadTypeId);
    try {
      const res = await fetch(`/api/crm/assignments/${leadTypeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultOwnerUserId, isActive: true }),
      });
      if (!res.ok) throw new Error();
      toast.success("Vendedor padrão atualizado.");
      fetchAssignments();
    } catch {
      toast.error("Erro ao salvar distribuição.");
    } finally {
      setSavingAssignment(null);
    }
  };

  const updateLossReason = async (id: string, data: { name?: string; order?: number; isActive?: boolean }) => {
    try {
      const res = await fetch(`/api/crm/loss-reasons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Motivo atualizado.");
      fetchLossReasons();
      setEditingLossId(null);
    } catch {
      toast.error("Erro ao atualizar motivo.");
    }
  };

  const createLossReason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLossLeadTypeId || !newLossName?.trim()) {
      toast.error("Tipo e nome são obrigatórios.");
      return;
    }
    setSavingLoss(true);
    try {
      const res = await fetch("/api/crm/loss-reasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadTypeId: newLossLeadTypeId,
          name: newLossName.trim(),
          order: lossReasons.filter((r) => r.leadTypeId === newLossLeadTypeId).length + 1,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Motivo criado.");
      setNewLossOpen(false);
      setNewLossLeadTypeId("");
      setNewLossName("");
      fetchLossReasons();
    } catch {
      toast.error("Erro ao criar motivo.");
    } finally {
      setSavingLoss(false);
    }
  };

  const createType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeKey.trim() || !newTypeName.trim()) {
      toast.error("Key e nome são obrigatórios.");
      return;
    }
    setSavingType(true);
    try {
      const res = await fetch("/api/crm/lead-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: newTypeKey.trim().toUpperCase().replace(/\s/g, "_"),
          name: newTypeName.trim(),
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error ?? "Erro ao criar tipo");
        return;
      }
      toast.success("Tipo criado.");
      setNewTypeOpen(false);
      setNewTypeKey("");
      setNewTypeName("");
      fetchTypes();
    } finally {
      setSavingType(false);
    }
  };

  const updateType = async (id: string, data: { name?: string; order?: number; isActive?: boolean; initialStageId?: string | null }) => {
    try {
      const res = await fetch(`/api/crm/lead-types/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Tipo atualizado.");
      fetchTypes();
      setEditingTypeId(null);
    } catch {
      toast.error("Erro ao atualizar tipo.");
    }
  };

  const updateStage = async (id: string, data: { name?: string; order?: number; slaHours?: number | null; slaEnabled?: boolean; slaThresholds?: { color: string; hoursLeft: number }[] | null; isFinal?: boolean; finalStatus?: string | null; whatsTemplate?: string | null; playbookChecklist?: string[] | null; helpText?: string | null; nextActionType?: string | null }) => {
    try {
      const res = await fetch(`/api/crm/lead-stages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Etapa atualizada.");
      fetchTypes();
      setEditingStageId(null);
    } catch {
      toast.error("Erro ao atualizar etapa.");
    }
  };

  const deleteStage = async (id: string) => {
    setDeletingStageId(id);
    try {
      const res = await fetch(`/api/crm/lead-stages/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Erro ao excluir etapa.");
        return;
      }
      toast.success("Etapa excluída.");
      setDeleteStageId(null);
      fetchTypes();
      setEditingStageId(null);
    } catch {
      toast.error("Erro ao excluir etapa.");
    } finally {
      setDeletingStageId(null);
    }
  };

  const deleteType = async (id: string) => {
    setDeletingTypeId(id);
    try {
      const res = await fetch(`/api/crm/lead-types/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Erro ao excluir funil.");
        return;
      }
      toast.success("Funil excluído com sucesso.");
      setDeleteTypeId(null);
      fetchTypes();
    } catch {
      toast.error("Erro ao excluir funil.");
    } finally {
      setDeletingTypeId(null);
    }
  };

  if (loading) return <p className="text-gray-500">Carregando...</p>;

  const safeTypes = Array.isArray(types) ? types : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <HelpTip helpKey="crm.types" fallbackTitle="Tipos de funil" fallbackText="Crie e edite tipos (ex: Imóvel, Investidor, Cotista) e suas etapas com ALERTA e finais WON/LOST." />
        <Button onClick={() => setNewTypeOpen(true)}>Novo tipo de funil</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Distribuição por tipo de funil
            <HelpTip
              helpKey="crm.distribuicao"
              fallbackTitle="Vendedor padrão"
              fallbackText="Define quem recebe os leads da captação pública para cada funil. O parâmetro ?vendedor= no link continua sobrescrevendo o vendedor padrão."
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Leads enviados sem <code className="text-xs bg-muted px-1 rounded">?vendedor=</code> serão atribuídos ao vendedor padrão abaixo.
          </p>
          <div className="space-y-3">
            {assignmentList.map(({ leadType, assignment }) => (
              <div
                key={leadType.id}
                className="grid grid-cols-1 sm:grid-cols-[minmax(200px,280px)_1fr_auto] gap-4 items-center"
              >
                <Label className="font-medium text-sm whitespace-nowrap sm:whitespace-normal">
                  {leadType.name}
                </Label>
                <Select
                  value={assignment?.defaultOwnerUserId ?? ""}
                  onValueChange={(value) => value && saveAssignment(leadType.id, value)}
                  disabled={savingAssignment === leadType.id || commercialUsers.length === 0}
                >
                  <SelectTrigger className="w-full min-w-[200px]">
                    <SelectValue placeholder="Selecione o vendedor padrão" />
                  </SelectTrigger>
                  <SelectContent>
                    {commercialUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {savingAssignment === leadType.id && (
                  <span className="text-xs text-muted-foreground">Salvando...</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="types" onValueChange={(v) => v === "loss" && fetchLossReasons()}>
        <TabsList>
          <TabsTrigger value="types">Tipos e etapas</TabsTrigger>
          <TabsTrigger value="loss">Motivos de Perda</TabsTrigger>
        </TabsList>
        <TabsContent value="types" className="space-y-6 mt-4">
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-gray-50/80 p-4 text-sm">
          <p className="font-medium text-gray-800 mb-1">Tempo de resposta (ALERTA)</p>
          <p className="text-gray-600 mb-3">
            Cada etapa define quanto tempo o responsável tem para agir antes que o lead fique atrasado.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-700">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-green-500 shrink-0" aria-hidden /> Dentro do prazo
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" aria-hidden /> Atenção: prazo quase estourando
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0" aria-hidden /> Atraso crítico
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" aria-hidden /> ALERTA vencido
            </span>
          </div>
        </div>
        <h2 className="text-xl font-semibold">Tipos e etapas</h2>
        {safeTypes.map((t) => (
          <Card key={t.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                {editingTypeId === t.id ? (
                  <>
                    <Input
                      defaultValue={t.name}
                      id={`type-name-${t.id}`}
                      className="w-64"
                    />
                    <Button size="sm" onClick={() => {
                      const name = (document.getElementById(`type-name-${t.id}`) as HTMLInputElement)?.value;
                      if (name) updateType(t.id, { name });
                    }}>Salvar</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingTypeId(null)}>Cancelar</Button>
                  </>
                ) : (
                  <>
                    <CardTitle className="text-lg">{t.name}</CardTitle>
                    <Button size="sm" variant="ghost" onClick={() => setEditingTypeId(t.id)}>Editar</Button>
                  </>
                )}
                <HelpTip helpKey="crm.stages" fallbackTitle="Etapas" fallbackText="Cada tipo tem etapas ordenadas. Defina ALERTA (horas) e marque finais como WON ou LOST." />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Ativo</Label>
                <Switch
                  checked={t.isActive}
                  onCheckedChange={(checked) => updateType(t.id, { isActive: checked })}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setDeleteTypeId(t.id)}
                  title="Excluir funil"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Label className="text-sm whitespace-nowrap">Etapa inicial:</Label>
                  <Select
                    value={t.initialStageId && t.initialStageId.trim() ? t.initialStageId : "__none__"}
                    onValueChange={(value) => updateType(t.id, { initialStageId: value === "__none__" ? null : value })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Primeira (order)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Primeira por ordem</SelectItem>
                      {(t.stages ?? []).map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/crm/lead-stages", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          leadTypeId: t.id,
                          name: "Nova etapa",
                          order: (t.stages ?? []).length + 1,
                        }),
                      });
                      if (!res.ok) throw new Error();
                      toast.success("Etapa criada. Edite para definir ALERTA e final.");
                      fetchTypes();
                    } catch {
                      toast.error("Erro ao criar etapa.");
                    }
                  }}
                >
                  + Nova etapa
                </Button>
              </div>
              <ul className="space-y-2">
                {(t.stages ?? []).map((s) => (
                  <li key={s.id} className="flex items-center gap-4 py-2 border-b last:border-0">
                    {editingStageId === s.id ? (
                      <div className="col-span-full space-y-3 py-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Input defaultValue={s.name} id={`stage-name-${s.id}`} className="w-48" placeholder="Nome" />
                          <label className="flex items-center gap-1.5 text-sm">
                            <input type="checkbox" defaultChecked={(s as { slaEnabled?: boolean }).slaEnabled !== false} id={`stage-sla-enabled-${s.id}`} />
                            ⏱ Tempo máximo para agir
                            <HelpTip helpKey="crm.stage.slaHours" fallbackTitle="Tempo máximo para agir" fallbackText="Tempo que o responsável tem para agir nesta etapa (em horas)." />
                          </label>
                          <Input type="number" defaultValue={s.slaHours ?? ""} id={`stage-sla-${s.id}`} className="w-20" placeholder="h" />
                          <span className="text-xs">h</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            ⚠ Aviso de atraso (amarelo)
                            <HelpTip helpKey="crm.stage.thresholdYellow" fallbackTitle="Aviso de atraso" fallbackText="Quando este tempo for atingido o lead ficará em alerta." />
                          </span>
                          <Input type="number" defaultValue={(s as { slaThresholds?: { color: string; hoursLeft: number }[] }).slaThresholds?.find((t: { color: string }) => t.color === "YELLOW")?.hoursLeft ?? ""} id={`stage-threshold-yellow-${s.id}`} className="w-14" placeholder="12" />
                          <span className="text-xs">h</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            🚨 Atraso crítico (laranja)
                            <HelpTip helpKey="crm.stage.thresholdOrange" fallbackTitle="Atraso crítico" fallbackText="Indica que o lead está muito atrasado." />
                          </span>
                          <Input type="number" defaultValue={(s as { slaThresholds?: { color: string; hoursLeft: number }[] }).slaThresholds?.find((t: { color: string }) => t.color === "ORANGE")?.hoursLeft ?? ""} id={`stage-threshold-orange-${s.id}`} className="w-14" placeholder="3" />
                          <span className="text-xs">h</span>
                          <label className="flex items-center gap-1">
                            <input type="checkbox" defaultChecked={s.isFinal} id={`stage-final-${s.id}`} />
                            Final
                          </label>
                          <select id={`stage-status-${s.id}`} defaultValue={s.finalStatus ?? ""} className="border rounded px-2 py-1 text-sm">
                            <option value="">—</option>
                            <option value="WON">WON</option>
                            <option value="LOST">LOST</option>
                          </select>
                          <Button size="sm" onClick={() => {
                            const name = (document.getElementById(`stage-name-${s.id}`) as HTMLInputElement)?.value;
                            const sla = (document.getElementById(`stage-sla-${s.id}`) as HTMLInputElement)?.value;
                            const slaEnabled = (document.getElementById(`stage-sla-enabled-${s.id}`) as HTMLInputElement)?.checked ?? true;
                            const yellowH = (document.getElementById(`stage-threshold-yellow-${s.id}`) as HTMLInputElement)?.value;
                            const orangeH = (document.getElementById(`stage-threshold-orange-${s.id}`) as HTMLInputElement)?.value;
                            const thresholds: { color: string; hoursLeft: number }[] = [];
                            if (orangeH && !isNaN(parseInt(orangeH, 10))) thresholds.push({ color: "ORANGE", hoursLeft: parseInt(orangeH, 10) });
                            if (yellowH && !isNaN(parseInt(yellowH, 10))) thresholds.push({ color: "YELLOW", hoursLeft: parseInt(yellowH, 10) });
                            thresholds.sort((a, b) => a.hoursLeft - b.hoursLeft);
                            const isFinal = (document.getElementById(`stage-final-${s.id}`) as HTMLInputElement)?.checked ?? false;
                            const finalStatus = (document.getElementById(`stage-status-${s.id}`) as HTMLSelectElement)?.value || null;
                            const whatsTemplate = (document.getElementById(`stage-whats-${s.id}`) as HTMLTextAreaElement)?.value?.trim() || null;
                            const checklistRaw = (document.getElementById(`stage-checklist-${s.id}`) as HTMLTextAreaElement)?.value ?? "";
                            const playbookChecklist = checklistRaw.split("\n").map((x) => x.trim()).filter(Boolean);
                            const helpText = (document.getElementById(`stage-help-${s.id}`) as HTMLTextAreaElement)?.value?.trim() || null;
                            const nextActionType = (document.getElementById(`stage-next-${s.id}`) as HTMLSelectElement)?.value || null;
                            updateStage(s.id, {
                              name: name || s.name,
                              slaHours: sla ? parseInt(sla, 10) : null,
                              slaEnabled,
                              slaThresholds: thresholds.length ? thresholds : null,
                              isFinal,
                              finalStatus: isFinal ? (finalStatus as "WON" | "LOST") : null,
                              whatsTemplate,
                              playbookChecklist: playbookChecklist.length ? playbookChecklist : null,
                              helpText,
                              nextActionType,
                            });
                          }}>Salvar</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingStageId(null)}>Cancelar</Button>
                        </div>
                        <div className="grid gap-2 border-t pt-2 text-sm">
                          <div>
                            <Label className="flex items-center gap-1">
                              WhatsApp Template (variáveis: {"{nome}"}, {"{vendedor}"}, {"{tipo}"}, {"{etapa}"})
                              <HelpTip helpKey="crm.stage.whatsTemplate" fallbackTitle="Template" fallbackText="Mensagem pronta para o vendedor. Use as variáveis para personalizar." />
                            </Label>
                            <Textarea id={`stage-whats-${s.id}`} defaultValue={s.whatsTemplate ?? ""} placeholder="Olá {nome}, aqui é {vendedor}..." className="min-h-[60px] mt-1" />
                          </div>
                          <div>
                            <Label className="flex items-center gap-1">
                              Checklist (um item por linha)
                              <HelpTip helpKey="crm.stage.checklist" fallbackTitle="Checklist" fallbackText="Itens para o vendedor seguir nesta etapa." />
                            </Label>
                            <Textarea id={`stage-checklist-${s.id}`} defaultValue={(s.playbookChecklist ?? []).join("\n")} placeholder="Item 1&#10;Item 2" className="min-h-[50px] mt-1" />
                          </div>
                          <div>
                            <Label className="flex items-center gap-1">
                              HelpText (dica curta)
                              <HelpTip helpKey="crm.stage.helpText" fallbackTitle="Dica" fallbackText="Texto de apoio exibido no playbook do vendedor." />
                            </Label>
                            <Textarea id={`stage-help-${s.id}`} defaultValue={s.helpText ?? ""} placeholder="Dica da etapa..." className="min-h-[40px] mt-1" />
                          </div>
                          <div>
                            <Label>Próxima ação sugerida</Label>
                            <select id={`stage-next-${s.id}`} defaultValue={s.nextActionType ?? ""} className="border rounded px-2 py-1 text-sm mt-1">
                              <option value="">—</option>
                              {NEXT_ACTION_TYPES.map((a) => <option key={a} value={a}>{a}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="w-6 text-gray-500">{s.order}</span>
                        <span className="font-medium">{s.name}</span>
                        {s.slaHours != null && <span className="text-sm text-gray-500">ALERTA: {s.slaHours}h</span>}
                        {s.isFinal && <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">{s.finalStatus ?? "Final"}</span>}
                        <div className="flex items-center gap-1 ml-auto">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingStageId(s.id)} title="Editar">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteStageId(s.id)} title="Excluir">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
        </TabsContent>
        <TabsContent value="loss" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Motivos de Perda</h2>
            <Button onClick={() => { setNewLossOpen(true); setNewLossLeadTypeId(safeTypes[0]?.id ?? ""); setNewLossName(""); }}>Novo motivo</Button>
          </div>
          {Object.entries(
            lossReasons.reduce((acc, r) => {
              const key = r.leadType?.name ?? r.leadTypeId;
              if (!acc[key]) acc[key] = [];
              acc[key].push(r);
              return acc;
            }, {} as Record<string, LossReason[]>)
          ).map(([typeName, reasons]) => (
            <Card key={typeName}>
              <CardHeader>
                <CardTitle className="text-base">{typeName}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {reasons.map((r) => (
                    <li key={r.id} className="flex items-center gap-4 py-2 border-b last:border-0">
                      {editingLossId === r.id ? (
                        <>
                          <Input defaultValue={r.name} id={`loss-name-${r.id}`} className="w-48" />
                          <Button size="sm" onClick={() => {
                            const name = (document.getElementById(`loss-name-${r.id}`) as HTMLInputElement)?.value;
                            if (name) updateLossReason(r.id, { name });
                          }}>Salvar</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingLossId(null)}>Cancelar</Button>
                        </>
                      ) : (
                        <>
                          <span className="font-medium">{r.name}</span>
                          <Switch checked={r.isActive} onCheckedChange={(c) => updateLossReason(r.id, { isActive: c })} />
                          <Button size="sm" variant="ghost" onClick={() => setEditingLossId(r.id)}>Editar</Button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
          {lossReasons.length === 0 && <p className="text-gray-500">Nenhum motivo cadastrado. Crie um na aba Tipos ou use o botão Novo motivo.</p>}
          <Dialog open={newLossOpen} onOpenChange={setNewLossOpen}>
            <DialogContent>
              <DialogHeader><DialogTitle>Novo motivo de perda</DialogTitle></DialogHeader>
              <form onSubmit={createLossReason} className="space-y-4">
                <div>
                  <Label>Tipo de funil</Label>
                  <Select value={newLossLeadTypeId} onValueChange={setNewLossLeadTypeId}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {safeTypes.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nome</Label>
                  <Input value={newLossName} onChange={(e) => setNewLossName(e.target.value)} placeholder="Ex: Preço" />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setNewLossOpen(false)}>Cancelar</Button>
                  <Button type="submit" disabled={savingLoss}>Criar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!deleteTypeId} onOpenChange={(open) => !open && setDeleteTypeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir funil</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este funil? Não é possível excluir se existirem leads associados a ele.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTypeId && deleteType(deleteTypeId)}
              disabled={!!deletingTypeId}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingTypeId ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteStageId} onOpenChange={(open) => !open && setDeleteStageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Confirmar exclusão desta etapa? Não é possível excluir se existirem leads nesta etapa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteStageId && deleteStage(deleteStageId)}
              disabled={!!deletingStageId}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingStageId ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={newTypeOpen} onOpenChange={setNewTypeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo tipo de funil</DialogTitle>
          </DialogHeader>
          <form onSubmit={createType} className="space-y-4">
            <div>
              <Label>Key (único, ex: IMOVEL)</Label>
              <Input value={newTypeKey} onChange={(e) => setNewTypeKey(e.target.value)} placeholder="IMOVEL" />
            </div>
            <div>
              <Label>Nome</Label>
              <Input value={newTypeName} onChange={(e) => setNewTypeName(e.target.value)} placeholder="Captação de Imóvel" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewTypeOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={savingType}>Criar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
