"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getStageStyle } from "@/lib/crm/stageColors";
import { getSlaStatus, getSlaBorderClass, parseStageThresholds } from "@/lib/crm/sla";
import { cn } from "@/lib/utils";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  owner?: { id: string; name: string; email: string } | null;
  stage: {
    name: string;
    slaEnabled?: boolean;
    slaHours?: number | null;
    slaThresholds?: unknown;
    isFinal?: boolean;
  };
  stageEnteredAt?: string | null;
  stageDueAt?: string | null;
  updatedAt: string;
};

export function LeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  const style = getStageStyle(lead.stage.name);
  const thresholds = parseStageThresholds(lead.stage?.slaThresholds ?? null);
  const slaResult = getSlaStatus({
    stageDueAt: lead.stageDueAt ?? null,
    stageEnteredAt: lead.stageEnteredAt ?? null,
    slaEnabled: lead.stage?.slaEnabled !== false,
    slaHours: lead.stage?.slaHours ?? null,
    thresholds,
  });
  const borderClass = getSlaBorderClass(slaResult.status);
  const overdueTitle =
    slaResult.status === "RED" && slaResult.overdueHours != null
      ? `Atrasado há ${Math.round(slaResult.overdueHours)}h`
      : undefined;

  return (
    <Card
      className={cn(
        "cursor-pointer border border-transparent transition-colors hover:border-vivant-navy/40",
        borderClass
      )}
      title={overdueTitle}
      onClick={onClick}
    >
      <CardContent className="space-y-1.5 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-sm truncate">{lead.name}</p>
        </div>
        <p className="text-xs text-gray-500">
          Responsável: {lead.owner?.name ?? "Não atribuído"}
        </p>
        <p className="text-xs text-gray-500 truncate">{lead.phone}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className={cn(style.badgeClass, "max-w-[70%] truncate")}>
            {lead.stage.name}
          </span>
          <span className="text-[10px] text-gray-400">
            {new Date(lead.updatedAt).toLocaleDateString("pt-BR")}
          </span>
        </div>
        {slaResult.status === "RED" && slaResult.overdueHours != null && (
          <p className="text-[10px] text-red-600 font-medium">
            Atrasado há {Math.round(slaResult.overdueHours)}h
          </p>
        )}
      </CardContent>
    </Card>
  );
}
