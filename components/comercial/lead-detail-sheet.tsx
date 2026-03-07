"use client";

import { useEffect, useState, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HelpTip } from "@/components/help/HelpTip";
import { toast } from "sonner";
import { Phone, MessageCircle, FileText, Copy, Maximize2, Minimize2 } from "lucide-react";

const STORAGE_KEY = "crm:leadSheetWide";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { renderTemplate } from "@/lib/crm/template";
import { buildWhatsAppUrl, normalizePhoneToE164BR } from "@/lib/crm/whatsapp";

function getProximaAcao(stageName: string): { text: string; type: "CALL" | "WHATSAPP" | "PROPOSAL" } {
  const n = stageName.toLowerCase();
  if (n.includes("proposta") || n.includes("termos")) return { text: "Envie ou acompanhe a proposta com o cliente.", type: "PROPOSAL" };
  if (n.includes("negociação") || n.includes("negociacao")) return { text: "Ligue ou mande mensagem para alinhar e fechar.", type: "CALL" };
  if (n.includes("novo") || n.includes("primeiro contato") || n.includes("contato")) return { text: "Faça o primeiro contato (ligação ou WhatsApp).", type: "WHATSAPP" };
  if (n.includes("visita") || n.includes("avaliação")) return { text: "Agende ou registre a visita.", type: "CALL" };
  if (n.includes("qualificação") || n.includes("apresentação")) return { text: "Mantenha o contato e qualifique o lead.", type: "WHATSAPP" };
  if (n.includes("validação") || n.includes("coleta") || n.includes("pré-análise")) return { text: "Ligue para alinhar próximos passos.", type: "CALL" };
  return { text: "Registre uma ligação ou mensagem com o cliente.", type: "CALL" };
}

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string | null;
  origin: string | null;
  notes: string | null;
  status: string;
  stageId: string;
  stage: {
    id: string;
    name: string;
    whatsTemplate?: string | null;
    playbookChecklist?: string[] | null;
    helpText?: string | null;
  };
  leadType: { id: string; key: string; name: string };
  owner?: { id: string; name: string; email: string };
  stages?: { id: string; name: string; isFinal?: boolean; finalStatus?: string }[];
  activities: { id: string; type: string; message: string | null; createdAt: string; actor: { name: string } }[];
};

const ACTIVITY_TYPES = [
  { value: "NOTE", label: "Nota" },
  { value: "CALL", label: "Ligação" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "VISIT", label: "Visita" },
  { value: "PROPOSAL", label: "Proposta" },
  { value: "STATUS_CHANGE", label: "Mudança de status" },
];

export function LeadDetailSheet({
  leadId,
  onClose,
  onUpdated,
  refreshTrigger = 0,
}: {
  leadId: string | null;
  onClose: () => void;
  onUpdated: () => void;
  /** Quando mudar, recarrega o lead (ex.: após mover no Kanban). */
  refreshTrigger?: number;
}) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [stages, setStages] = useState<{ id: string; name: string; isFinal?: boolean; finalStatus?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editSource, setEditSource] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [moveStageId, setMoveStageId] = useState("");
  const [moving, setMoving] = useState(false);
  const [activityType, setActivityType] = useState("NOTE");
  const [activityMessage, setActivityMessage] = useState("");
  const [addingActivity, setAddingActivity] = useState(false);
  const activityFormRef = useRef<HTMLDivElement>(null);
  const [lossModalOpen, setLossModalOpen] = useState(false);
  const [lossReasons, setLossReasons] = useState<{ id: string; name: string }[]>([]);
  const [lossReasonId, setLossReasonId] = useState("");
  const [lossNote, setLossNote] = useState("");
  const [playbookChecked, setPlaybookChecked] = useState<Record<number, boolean>>({});
  const [whatsOpening, setWhatsOpening] = useState(false);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    try {
      setWide(localStorage.getItem(STORAGE_KEY) === "true");
    } catch {
      setWide(false);
    }
  }, []);

  const toggleWide = () => {
    setWide((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    if (!leadId) {
      setLead(null);
      return;
    }
    setLoading(true);
    fetch(`/api/crm/leads/${leadId}`)
      .then((r) => r.json())
      .then((data) => {
        setLead(data);
        setEditName(data.name ?? "");
        setEditPhone(data.phone ?? "");
        setEditEmail(data.email ?? "");
        setEditSource(data.source ?? "");
        setEditNotes(data.notes ?? "");
        setMoveStageId(data.stageId ?? "");
      })
      .catch(() => toast.error("Erro ao carregar lead"))
      .finally(() => setLoading(false));
  }, [leadId, refreshTrigger]);

  useEffect(() => {
    if (!lead?.leadType?.id) return;
    fetch("/api/crm/lead-types")
      .then((r) => r.json())
      .then((types: { id: string; stages: { id: string; name: string; isFinal?: boolean; finalStatus?: string }[] }[]) => {
        const t = types.find((x) => x.id === lead.leadType.id);
        setStages(t?.stages ?? []);
      })
      .catch(() => setStages([]));
  }, [lead?.leadType?.id]);

  const saveBasic = async () => {
    if (!leadId || !lead) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/crm/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          phone: editPhone.trim(),
          email: editEmail.trim(),
          source: editSource.trim() || null,
          notes: editNotes.trim() || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error ?? "Erro ao salvar");
        return;
      }
      const updated = await res.json();
      setLead(updated);
      toast.success("Dados atualizados.");
      onUpdated();
    } finally {
      setSaving(false);
    }
  };

  const selectedStage = stages.find((s) => s.id === moveStageId);
  const isMovingToLost = selectedStage?.isFinal && selectedStage?.finalStatus === "LOST";

  const moveStage = async (payload?: { lossReasonId: string; lossNote?: string }) => {
    if (!leadId || !moveStageId || moveStageId === lead?.stageId) return;
    setMoving(true);
    try {
      const body = payload
        ? { stageId: moveStageId, lossReasonId: payload.lossReasonId, lossNote: payload.lossNote || undefined }
        : { stageId: moveStageId };
      const res = await fetch(`/api/crm/leads/${leadId}/move-stage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error ?? "Erro ao mover");
        return;
      }
      const updated = await res.json();
      setLead(updated);
      setMoveStageId(updated.stageId);
      setLossModalOpen(false);
      setLossReasonId("");
      setLossNote("");
      toast.success("Etapa atualizada.");
      onUpdated();
    } finally {
      setMoving(false);
    }
  };

  const handleMoveClick = () => {
    if (isMovingToLost) {
      setLossReasonId("");
      setLossNote("");
      fetch(`/api/crm/loss-reasons?leadTypeId=${lead?.leadType.id}`)
        .then((r) => (r.ok ? r.json() : []))
        .then(setLossReasons)
        .catch(() => setLossReasons([]));
      setLossModalOpen(true);
    } else {
      moveStage();
    }
  };

  const confirmLossMove = () => {
    if (!lossReasonId?.trim()) {
      toast.error("Selecione o motivo de perda.");
      return;
    }
    moveStage({ lossReasonId: lossReasonId.trim(), lossNote: lossNote.trim() || undefined });
  };

  const addActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadId) return;
    setAddingActivity(true);
    try {
      const res = await fetch(`/api/crm/leads/${leadId}/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activityType, message: activityMessage.trim() || null }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error ?? "Erro ao registrar atividade");
        return;
      }
      const created = await res.json();
      setLead((prev) =>
        prev ? { ...prev, activities: [created, ...(prev.activities ?? [])] } : null
      );
      setActivityMessage("");
      toast.success("Atividade registrada.");
      onUpdated();
    } finally {
      setAddingActivity(false);
    }
  };

  const sheetWidthClass = wide
    ? "w-full sm:max-w-[520px] lg:max-w-[980px] 2xl:max-w-[980px]"
    : "w-full sm:max-w-[520px] lg:max-w-[720px] 2xl:max-w-[860px]";

  return (
    <Sheet open={!!leadId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        className={cn(
          "flex h-full flex-col overflow-hidden p-0",
          sheetWidthClass
        )}
      >
        <div className="flex flex-shrink-0 flex-col gap-2 border-b px-6 py-4">
          <div className="flex items-center justify-between gap-2 pr-8">
            <SheetHeader className="p-0 flex-1 min-w-0">
              <SheetTitle className="flex items-center gap-2 truncate">
                {lead ? lead.name : "Lead"}
                <HelpTip helpKey="crm.stages" fallbackTitle="Detalhes" fallbackText="Edite os dados, mude a etapa e registre atividades." />
              </SheetTitle>
            </SheetHeader>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={toggleWide}
              title={wide ? "Reduzir painel" : "Expandir painel"}
            >
              {wide ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
          {loading && !lead && <p className="text-gray-500 py-4">Carregando...</p>}
          {lead && (
          <div className="space-y-6 pt-4">
            {lead.status === "ACTIVE" && (() => {
              const { text, type } = getProximaAcao(lead.stage.name);
              const label = type === "CALL" ? "Registrar ligação" : type === "WHATSAPP" ? "Registrar WhatsApp" : "Registrar proposta";
              const Icon = type === "CALL" ? Phone : type === "WHATSAPP" ? MessageCircle : FileText;
              return (
                <div className="rounded-lg border bg-amber-50/80 border-amber-200 p-4">
                  <h3 className="font-medium text-sm text-amber-900 mb-1">Próxima ação</h3>
                  <p className="text-sm text-amber-800 mb-3">{text}</p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setActivityType(type);
                      activityFormRef.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </Button>
                </div>
              );
            })()}
            <div className="space-y-3">
              <Label>Nome</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-3">
              <Label>Telefone</Label>
              <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
            </div>
            <div className="space-y-3">
              <Label>E-mail</Label>
              <Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
            </div>
            <div className="space-y-3">
              <Label>Origem (canal)</Label>
              <p className="text-sm text-gray-700 py-1.5">
                {lead.origin ? lead.origin : "Sistema interno"}
              </p>
            </div>
            <div className="space-y-3">
              <Label>Fonte (UTM / referência)</Label>
              <Input value={editSource} onChange={(e) => setEditSource(e.target.value)} placeholder="Ex: google / cpc" />
            </div>
            <div className="space-y-3">
              <Label>Observações</Label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full min-h-[60px] px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <Button onClick={saveBasic} disabled={saving}>Salvar dados</Button>

            <div className="border-t pt-4">
              <Label className="mb-2 block">Mover para etapa</Label>
              <div className="flex gap-2">
                <Select value={moveStageId} onValueChange={setMoveStageId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleMoveClick} disabled={moving || moveStageId === lead.stageId}>
                  {moving ? "..." : "Mover"}
                </Button>
              </div>
            </div>

            {lead.status === "ACTIVE" && (() => {
              const template = lead.stage?.whatsTemplate?.trim() || "";
              const fallbackTemplate = "Olá {nome}, aqui é {vendedor} da Vivant. Podemos conversar?";
              const ctx = {
                nome: lead.name,
                vendedor: lead.owner?.name ?? "Equipe Vivant",
                tipo: lead.leadType.name,
                etapa: lead.stage.name,
                email: lead.email ?? "",
                telefone: lead.phone ?? "",
              };
              const renderedMessage = renderTemplate(template || fallbackTemplate, ctx);
              const checklist = Array.isArray(lead.stage?.playbookChecklist) ? lead.stage.playbookChecklist : [];
              return (
                <div className="border-t pt-4 space-y-3">
                  <h3 className="font-medium flex items-center gap-1">
                    Playbook desta etapa
                    <HelpTip helpKey="crm.stage.helpText" fallbackTitle="Playbook" fallbackText="Dicas e mensagem pronta para esta etapa. Use Abrir WhatsApp para enviar com um clique." />
                  </h3>
                  {lead.stage?.helpText && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{lead.stage.helpText}</p>
                  )}
                  {checklist.length > 0 && (
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Checklist</Label>
                      <ul className="space-y-1">
                        {checklist.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={playbookChecked[i] ?? false}
                              onChange={(e) => setPlaybookChecked((p) => ({ ...p, [i]: e.target.checked }))}
                              className="rounded"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      Mensagem WhatsApp
                      <HelpTip helpKey="crm.stage.whatsTemplate" fallbackTitle="Template" fallbackText="Variáveis: {nome}, {vendedor}, {tipo}, {etapa}, {email}, {telefone}." />
                    </Label>
                    {!template ? (
                      <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded">Sem mensagem configurada para esta etapa. Peça ao Dono configurar no Admin CRM.</p>
                    ) : null}
                    <Textarea readOnly value={renderedMessage} className="min-h-[80px] text-sm bg-gray-50" />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        disabled={whatsOpening || !lead.phone?.trim()}
                        onClick={async () => {
                          setWhatsOpening(true);
                          try {
                            const res = await fetch(`/api/crm/leads/${leadId}/whatsapp-open`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ stageId: lead.stageId, messagePreview: renderedMessage.slice(0, 200) }),
                            });
                            if (!res.ok) throw new Error();
                            const url = buildWhatsAppUrl(normalizePhoneToE164BR(lead.phone), renderedMessage);
                            window.open(url, "_blank", "noopener,noreferrer");
                            toast.success("WhatsApp aberto com mensagem pronta.");
                            onUpdated();
                          } catch {
                            toast.error("Erro ao registrar. Tente novamente.");
                          } finally {
                            setWhatsOpening(false);
                          }
                        }}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {whatsOpening ? "Abrindo..." : "Abrir WhatsApp"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(renderedMessage);
                            fetch(`/api/crm/leads/${leadId}/whatsapp-copied`, { method: "POST" }).catch(() => {});
                            toast.success("Mensagem copiada.");
                          } catch {
                            toast.error("Não foi possível copiar.");
                          }
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar mensagem
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div ref={activityFormRef} className="border-t pt-4">
              <Label className="mb-2 block">Registrar atividade</Label>
              <form onSubmit={addActivity} className="space-y-2">
                <Select value={activityType} onValueChange={setActivityType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIVITY_TYPES.map((a) => (
                      <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <textarea
                  value={activityMessage}
                  onChange={(e) => setActivityMessage(e.target.value)}
                  placeholder="Mensagem ou resumo"
                  className="w-full min-h-[60px] px-3 py-2 border rounded-md text-sm"
                />
                <Button type="submit" disabled={addingActivity}>Adicionar</Button>
              </form>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Histórico de atividades</h4>
              <ul className="space-y-2 text-sm">
                {(lead.activities ?? []).length === 0 && <li className="text-gray-500">Nenhuma atividade ainda.</li>}
                {(lead.activities ?? []).map((a) => (
                  <li key={a.id} className="border-l-2 border-gray-200 pl-3 py-1">
                    <span className="font-medium">{a.type}</span> — {a.actor?.name ?? "—"} · {new Date(a.createdAt).toLocaleString("pt-BR")}
                    {a.message && <p className="text-gray-600 mt-1">{a.message}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          )}
        </div>

        <Dialog open={lossModalOpen} onOpenChange={setLossModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Motivo de perda</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600">Selecione o motivo e opcionalmente uma observação.</p>
            <div className="space-y-3">
              <Label>Motivo *</Label>
              <Select value={lossReasonId} onValueChange={setLossReasonId}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {lossReasons.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div>
                <Label>Observação (opcional)</Label>
                <Textarea
                  value={lossNote}
                  onChange={(e) => setLossNote(e.target.value)}
                  placeholder="Detalhes sobre a perda..."
                  className="min-h-[80px] mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setLossModalOpen(false)}>Cancelar</Button>
              <Button onClick={confirmLossMove} disabled={moving || !lossReasonId?.trim()}>
                {moving ? "..." : "Confirmar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>
  );
}