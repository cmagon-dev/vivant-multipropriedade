"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContextualHelpAuto } from "@/components/help/ContextualHelpAuto";
import { HelpTip } from "@/components/help/HelpTip";
import { MicroOnboarding } from "@/components/help/MicroOnboarding";
import { Plus, Search } from "lucide-react";
import { NewLeadDialog } from "./new-lead-dialog";
import { LeadDetailSheet } from "./lead-detail-sheet";
import { NewLeadsAlert } from "./NewLeadsAlert";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type LeadType = {
  id: string;
  key: string;
  name: string;
  stages: { id: string; name: string; order: number; isFinal: boolean; finalStatus: string | null }[];
};

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string | null;
  status: string;
  leadTypeId: string;
  stageId: string;
  ownerUserId?: string;
  owner: { id: string; name: string; email: string } | null;
  stage: {
    id: string;
    name: string;
    order: number;
    slaEnabled?: boolean;
    slaHours?: number | null;
    slaThresholds?: unknown;
    isFinal?: boolean;
    finalStatus?: string | null;
  };
  leadType: { id: string; key: string; name: string };
  updatedAt: string;
  stageEnteredAt?: string | null;
  stageDueAt?: string | null;
};

const TYPE_DESCRIPTIONS: Record<string, string> = {
  IMOVEL: "Captação e negociação de imóveis para o portfólio.",
  INVESTIDOR: "Funil para captação de investidores e aportes.",
  COTISTA: "Funil de venda de cotas e relacionamento com cotistas.",
  MODELO: "Funil para quem quer conhecer melhor o modelo Vivant.",
};

export function LeadsBoard() {
  const [types, setTypes] = useState<LeadType[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode] = useState<"kanban" | "table">("table");
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [newLeadOpen, setNewLeadOpen] = useState(false);
  const [detailLeadId, setDetailLeadId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterOwner, setFilterOwner] = useState<"all" | "mine">("all");
  const [responsibleFilter, setResponsibleFilter] = useState<string>("all");
  const [canEditInlineResponsible, setCanEditInlineResponsible] = useState(false);
  const [savingResponsibleLeadId, setSavingResponsibleLeadId] = useState<string | null>(null);
  const [responsibleOptions, setResponsibleOptions] = useState<
    { id: string; name: string; email: string }[]
  >([]);
  const [responsibleUsers, setResponsibleUsers] = useState<
    { id: string; name: string; email: string }[]
  >([]);
  const [canFilterByResponsible, setCanFilterByResponsible] = useState(false);
  const kanbanRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const [movingLeadId, setMovingLeadId] = useState<string | null>(null);
  const [pendingLostDrop, setPendingLostDrop] = useState<{ leadId: string; stageId: string } | null>(null);
  const [lossReasons, setLossReasons] = useState<{ id: string; name: string }[]>([]);
  const [lossReasonId, setLossReasonId] = useState("");
  const [lossNote, setLossNote] = useState("");
  const [confirmingLost, setConfirmingLost] = useState(false);
  const [refreshDetailTrigger, setRefreshDetailTrigger] = useState(0);
  const detailLeadIdRef = useRef<string | null>(null);
  useEffect(() => {
    detailLeadIdRef.current = detailLeadId;
  }, [detailLeadId]);

  const fetchTypes = () =>
    fetch("/api/crm/lead-types")
      .then((r) => r.json())
      .then((data) => {
        setTypes(Array.isArray(data) ? data : []);
        if (!selectedTypeId && Array.isArray(data) && data.length) setSelectedTypeId(data[0].id);
      })
      .catch(() => toast.error("Erro ao carregar tipos"));

  const fetchLeads = () => {
    const params = new URLSearchParams();
    if (selectedTypeId) params.set("leadTypeId", selectedTypeId);
    if (filterOwner === "mine") params.set("mine", "true");
    if (canFilterByResponsible && responsibleFilter !== "all") {
      params.set("responsibleUserId", responsibleFilter);
    }
    return fetch(`/api/crm/leads?${params}`)
      .then((r) => r.json())
      .then(setLeads)
      .catch(() => toast.error("Erro ao carregar leads"));
  };

  const fetchResponsibleUsers = () =>
    fetch("/api/crm/assignments")
      .then(async (r) => {
        if (!r.ok) {
          setCanFilterByResponsible(false);
          setResponsibleUsers([]);
          return;
        }
        const data = await r.json();
        const users = Array.isArray(data?.commercialUsers) ? data.commercialUsers : [];
        setResponsibleUsers(users);
        setCanFilterByResponsible(true);
      })
      .catch(() => {
        setCanFilterByResponsible(false);
        setResponsibleUsers([]);
      });

  const fetchResponsibleContext = () =>
    fetch("/api/crm/leads/responsibles")
      .then((r) => r.json())
      .then((data: unknown) => {
        const d = data as {
          canEditInlineResponsible?: boolean;
          users?: { id: string; name: string; email: string }[];
        };
        setCanEditInlineResponsible(!!d?.canEditInlineResponsible);
        setResponsibleOptions(Array.isArray(d?.users) ? d.users : []);
      })
      .catch(() => {
        setCanEditInlineResponsible(false);
        setResponsibleOptions([]);
      });

  useEffect(() => {
    Promise.all([fetchTypes(), fetchResponsibleUsers(), fetchResponsibleContext(), fetchLeads()]).finally(() =>
      setLoading(false)
    );
  }, []);

  useEffect(() => {
    if (selectedTypeId) fetchLeads();
  }, [selectedTypeId, filterOwner, responsibleFilter, canFilterByResponsible]);

  const currentType = types.find((t) => t.id === selectedTypeId);
  const stages = currentType?.stages ?? [];
  const filteredLeads = search.trim()
    ? leads.filter(
        (l) =>
          l.name.toLowerCase().includes(search.toLowerCase()) ||
          l.phone.includes(search) ||
          l.email?.toLowerCase().includes(search.toLowerCase())
      )
    : leads;

  const leadsByStage = stages.reduce(
    (acc, s) => {
      acc[s.id] = filteredLeads.filter((l) => l.stageId === s.id);
      return acc;
    },
    {} as Record<string, Lead[]>
  );

  const refreshLeads = () => {
    fetchLeads();
    if (detailLeadId) setDetailLeadId(null);
  };

  const updateLeadResponsibleInline = async (
    leadId: string,
    nextResponsible: string
  ) => {
    setSavingResponsibleLeadId(leadId);
    try {
      const payload =
        nextResponsible === "__unassigned__"
          ? { responsibleUserId: null }
          : { responsibleUserId: nextResponsible };
      const res = await fetch(`/api/crm/leads/${leadId}/responsible`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Não foi possível atualizar responsável.");
        return;
      }
      const updated = (await res.json()) as {
        id: string;
        ownerUserId: string | null;
        owner: { id: string; name: string; email: string } | null;
      };
      setLeads((prev) =>
        prev.map((l) =>
          l.id === updated.id
            ? {
                ...l,
                ownerUserId: updated.ownerUserId ?? undefined,
                owner: updated.owner as Lead["owner"],
              }
            : l
        )
      );
      toast.success("Responsável atualizado.");
    } finally {
      setSavingResponsibleLeadId(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!kanbanRef.current) return;
    const target = e.target as Node;
    // Não inicia scroll se o clique foi em um card (arrastável) ou dentro dele
    if (kanbanRef.current.contains(target) && target !== kanbanRef.current) {
      const isOnCard = (target as HTMLElement).closest?.("[draggable=true]");
      if (isOnCard) return;
    }
    if (target !== kanbanRef.current) return;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    scrollStartRef.current = kanbanRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !kanbanRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    kanbanRef.current.scrollLeft = scrollStartRef.current - dx;
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  const scrollColumns = (direction: "left" | "right") => {
    if (!kanbanRef.current) return;
    const delta = direction === "left" ? -360 : 360;
    kanbanRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  const moveLeadToStage = useCallback(
    async (leadId: string, stageId: string, lossReasonId?: string, lossNote?: string) => {
      setMovingLeadId(leadId);
      try {
        const res = await fetch(`/api/crm/leads/${leadId}/move-stage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stageId,
            ...(lossReasonId && { lossReasonId }),
            ...(lossNote?.trim() && { lossNote: lossNote.trim() }),
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          toast.error(data.error ?? "Erro ao mover lead");
          return;
        }
        toast.success("Lead movido para a nova etapa.");
        fetchLeads();
        if (detailLeadIdRef.current === leadId) {
          setRefreshDetailTrigger((t) => t + 1);
        }
      } finally {
        setMovingLeadId(null);
      }
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, stageId: string) => {
      e.preventDefault();
      const leadId = e.dataTransfer.getData("text/plain");
      if (!leadId || !currentType) return;
      const lead = leads.find((l) => l.id === leadId);
      if (!lead || lead.stageId === stageId) return;
      const stage = stages.find((s) => s.id === stageId);
      if (!stage) return;
      const isLost = stage.isFinal && stage.finalStatus === "LOST";
      if (isLost) {
        setPendingLostDrop({ leadId, stageId });
        setLossReasonId("");
        setLossNote("");
      } else {
        moveLeadToStage(leadId, stageId);
      }
    },
    [currentType, stages, leads, moveLeadToStage]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const confirmLostDrop = useCallback(async () => {
    if (!pendingLostDrop || !lossReasonId.trim()) {
      toast.error("Selecione o motivo de perda.");
      return;
    }
    setConfirmingLost(true);
    try {
      await moveLeadToStage(
        pendingLostDrop.leadId,
        pendingLostDrop.stageId,
        lossReasonId.trim(),
        lossNote.trim()
      );
      setPendingLostDrop(null);
      setLossReasonId("");
      setLossNote("");
    } finally {
      setConfirmingLost(false);
    }
  }, [pendingLostDrop, lossReasonId, lossNote, moveLeadToStage]);

  useEffect(() => {
    if (pendingLostDrop && currentType) {
      fetch(`/api/crm/loss-reasons?leadTypeId=${currentType.id}`)
        .then((r) => (r.ok ? r.json() : []))
        .then((list: { id: string; name: string }[]) => setLossReasons(list))
        .catch(() => setLossReasons([]));
    } else {
      setLossReasons([]);
    }
  }, [pendingLostDrop, currentType?.id]);

  return (
    <div className="flex h-[calc(100vh-180px)] flex-col gap-4">
      <ContextualHelpAuto />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-vivant-navy">Leads</h1>
          <NewLeadsAlert />
          <HelpTip helpKey="crm.leads" fallbackTitle="Leads" fallbackText="Gerencie seus contatos e oportunidades por tipo de funil. Mova entre etapas e registre atividades." />
        </div>
        <div className="flex items-center gap-2">
          <MicroOnboarding
            tutorialKey="comercial.leads"
            steps={[
              { id: "1", title: "Produtos", content: "Escolha o produto (Imóvel, Investidor, Cotista) no seletor acima." },
              { id: "2", title: "Lista", content: "Os leads aparecem em lista por etapa. Clique em Abrir para ver detalhes e mover." },
              { id: "3", title: "Novo lead", content: "Use o botão Novo Lead para cadastrar um contato." },
            ]}
          />
          <Button onClick={() => setNewLeadOpen(true)} disabled={!currentType}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        <>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-600 uppercase">Produto</p>
                <Select
                  value={selectedTypeId ?? ""}
                  onValueChange={(v) => setSelectedTypeId(v || null)}
                >
                  <SelectTrigger className="w-60">
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {currentType && (
                <p className="text-xs text-gray-500 max-w-md">
                  {TYPE_DESCRIPTIONS[currentType.key] ?? "Funil de leads para este produto."}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-gray-600 uppercase">Leads</p>
                <div className="flex rounded-md border border-gray-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setFilterOwner("all")}
                    className={`px-3 py-2 text-sm font-medium ${filterOwner === "all" ? "bg-vivant-navy text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                  >
                    Todos os leads
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterOwner("mine")}
                    className={`px-3 py-2 text-sm font-medium ${filterOwner === "mine" ? "bg-vivant-navy text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                  >
                    Meus leads
                  </button>
                </div>
              </div>
              {canFilterByResponsible && (
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-gray-600 uppercase">
                    Responsável
                  </p>
                  <Select value={responsibleFilter} onValueChange={setResponsibleFilter}>
                    <SelectTrigger className="w-56">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="__unassigned__">Não distribuído</SelectItem>
                      {responsibleUsers.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, telefone, e-mail..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border rounded-md text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 pt-2">
              <div className="h-full overflow-y-auto">
                <Card>
                  <CardContent className="p-0">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-3">Produto</th>
                          <th className="text-left p-3">Nome</th>
                          <th className="text-left p-3">Responsável</th>
                          <th className="text-left p-3">Telefone</th>
                          <th className="text-left p-3">Etapa</th>
                          <th className="text-left p-3">Atualizado</th>
                          <th className="w-20 p-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead) => (
                          <tr key={lead.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 text-gray-700">{lead.leadType?.name ?? "-"}</td>
                            <td className="p-3 font-medium">{lead.name}</td>
                            <td className="p-3 text-sm text-gray-600">
                              {canEditInlineResponsible ? (
                                <div className="flex items-center gap-2">
                                  <Select
                                    value={lead.owner?.id ?? "__unassigned__"}
                                    onValueChange={(value) => void updateLeadResponsibleInline(lead.id, value)}
                                    disabled={savingResponsibleLeadId === lead.id}
                                  >
                                    <SelectTrigger className="w-56 bg-white">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="__unassigned__">Não distribuído</SelectItem>
                                      {responsibleOptions.map((u) => (
                                        <SelectItem key={u.id} value={u.id}>
                                          {u.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {savingResponsibleLeadId === lead.id && (
                                    <span className="text-xs text-gray-500">Salvando...</span>
                                  )}
                                </div>
                              ) : (
                                (lead.owner?.name ?? "Não distribuído")
                              )}
                            </td>
                            <td className="p-3">{lead.phone}</td>
                            <td className="p-3">{lead.stage.name}</td>
                            <td className="p-3 text-gray-500">
                              {new Date(lead.updatedAt).toLocaleDateString("pt-BR")}
                            </td>
                            <td className="p-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDetailLeadId(lead.id)}
                              >
                                Abrir
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredLeads.length === 0 && (
                      <p className="p-6 text-center text-gray-500">
                        Nenhum lead neste funil.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
          </div>
        </>
      )}

      <Dialog open={!!pendingLostDrop} onOpenChange={(open) => !open && setPendingLostDrop(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Marcar lead como perdido</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Motivo de perda *</Label>
              <Select value={lossReasonId} onValueChange={setLossReasonId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o motivo" />
                </SelectTrigger>
                <SelectContent>
                  {lossReasons.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Observação (opcional)</Label>
              <Textarea
                value={lossNote}
                onChange={(e) => setLossNote(e.target.value)}
                placeholder="Ex: cliente desistiu por preço"
                rows={2}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingLostDrop(null)}>
              Cancelar
            </Button>
            <Button onClick={confirmLostDrop} disabled={confirmingLost || !lossReasonId.trim()}>
              {confirmingLost ? "Salvando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NewLeadDialog
        open={newLeadOpen}
        onOpenChange={setNewLeadOpen}
        leadTypes={types}
        defaultTypeId={selectedTypeId ?? undefined}
        onSuccess={refreshLeads}
      />
      <LeadDetailSheet
        leadId={detailLeadId}
        onClose={() => setDetailLeadId(null)}
        onUpdated={refreshLeads}
        refreshTrigger={refreshDetailTrigger}
      />
    </div>
  );
}
