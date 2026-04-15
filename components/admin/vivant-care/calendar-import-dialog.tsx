"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, FileSpreadsheet, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
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

type ValidateOk = {
  ok: true;
  rows: unknown[];
  preview: {
    totalWeeks: number;
    extraCount: number;
    byCota: Record<string, number>;
    yearsInSheet: number[];
    cotaLettersNeeded: string[];
  };
  warnings: string[];
  cotasWillBeCreated: string[];
  existingCalendar: {
    id: string;
    year: number;
    status: string;
    weekCount: number;
  } | null;
  property: { id: string; name: string };
};

type ValidateErr = {
  ok: false;
  errors: string[];
  warnings: string[];
  existingCalendar: ValidateOk["existingCalendar"];
  property?: { id: string; name: string };
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  defaultYear: number;
  onImported: () => void;
};

export function CalendarImportDialog({
  open,
  onOpenChange,
  propertyId,
  defaultYear,
  onImported,
}: Props) {
  const [year, setYear] = useState(defaultYear);
  const [file, setFile] = useState<File | null>(null);
  const [validating, setValidating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [validated, setValidated] = useState<ValidateOk | null>(null);
  const [validateError, setValidateError] = useState<ValidateErr | null>(null);
  /** Com calendário existente: escolha explícita (abort = não importar neste passo). */
  const [conflictMode, setConflictMode] = useState<"replace" | "merge" | "abort" | null>(null);
  const [publishAfter, setPublishAfter] = useState(false);
  const [lastImportCalendarYearId, setLastImportCalendarYearId] = useState<string | null>(null);
  const [publishPromptOpen, setPublishPromptOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setYear(defaultYear);
    }
  }, [open, defaultYear]);

  const reset = () => {
    setFile(null);
    setValidated(null);
    setValidateError(null);
    setConflictMode(null);
    setPublishAfter(false);
    setLastImportCalendarYearId(null);
    setYear(defaultYear);
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const runValidate = async () => {
    if (!file) {
      toast.error("Selecione um arquivo .xlsx");
      return;
    }
    setValidating(true);
    setValidated(null);
    setValidateError(null);
    setConflictMode(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("year", String(year));
      const res = await fetch(
        `/api/admin/propriedades/${propertyId}/calendar-import/validate`,
        { method: "POST", body: fd }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao validar");
        return;
      }
      if (!data.ok) {
        setValidateError(data as ValidateErr);
        toast.error("Validação encontrou erros.");
        return;
      }
      setValidated(data as ValidateOk);
      if (data.existingCalendar) {
        setConflictMode(null);
        toast.message("Já existe calendário neste ano — escolha como deseja prosseguir.");
      } else {
        setConflictMode("merge");
        toast.success("Planilha válida.");
      }
    } catch {
      toast.error("Falha ao validar");
    } finally {
      setValidating(false);
    }
  };

  const runImport = async () => {
    if (!validated?.rows?.length) return;
    if (validated.existingCalendar) {
      if (!conflictMode || conflictMode === "abort") {
        toast.error("Escolha substituir ou atualizar o calendário, ou cancele e feche o modal.");
        return;
      }
    }
    const mode = validated.existingCalendar ? conflictMode : "merge";
    setImporting(true);
    try {
      const res = await fetch(
        `/api/admin/propriedades/${propertyId}/calendar-import/apply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            year,
            rows: validated.rows,
            mode,
            publish: publishAfter,
          }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Erro na importação");
        return;
      }
      const r = data.result as {
        calendarYearId?: string;
        weeksCreated?: number;
        weeksUpdated?: number;
        assignmentsCreated?: number;
        extrasCount?: number;
        cotasAutoCreated?: number;
        published?: boolean;
      };
      toast.success(
        `Importação concluída: ${r.weeksCreated ?? 0} novas, ${r.weeksUpdated ?? 0} atualizadas, ` +
          `${r.assignmentsCreated ?? 0} vínculos cota–semana, ${r.extrasCount ?? 0} extras` +
          (r.cotasAutoCreated ? `, ${r.cotasAutoCreated} cotas criadas` : "") +
          "."
      );
      const cyId = r.calendarYearId;
      if (cyId) setLastImportCalendarYearId(cyId);
      if (publishAfter || data.result?.published) {
        onImported();
        handleClose(false);
        return;
      }
      setPublishPromptOpen(true);
    } catch {
      toast.error("Erro na importação");
    } finally {
      setImporting(false);
    }
  };

  const publishNow = async () => {
    setPublishPromptOpen(false);
    const cyId = lastImportCalendarYearId;
    if (!cyId) {
      onImported();
      handleClose(false);
      return;
    }
    try {
      const pub = await fetch(
        `/api/admin/propriedades/${propertyId}/calendar-years/${cyId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "PUBLISHED" }),
        }
      );
      if (pub.ok) toast.success("Calendário publicado.");
      else toast.error("Não foi possível publicar");
    } finally {
      onImported();
      handleClose(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Importar calendário (Excel)
            </DialogTitle>
            <DialogDescription>
              Colunas esperadas: Semana, Início (quinta), Fim (quarta), Categoria (Gold/Silver/Black),
              Evento, Cotas (A–F ou Extra). Opcional: Tempo do último uso.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Ano do calendário</Label>
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10) || year)}
                className="w-32"
              />
            </div>
            <div className="space-y-2">
              <Label>Arquivo (.xlsx)</Label>
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" disabled={validating} onClick={() => void runValidate()}>
                {validating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Validar
              </Button>
            </div>

            {validateError?.errors?.length ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                <p className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Erros
                </p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  {validateError.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {validated?.warnings?.length ? (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
                <p className="font-medium">Avisos</p>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  {validated.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {validated ? (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm space-y-2">
                <p>
                  <strong>{validated.preview.totalWeeks}</strong> semanas ·{" "}
                  <strong>{validated.preview.extraCount}</strong> extras
                </p>
                <p className="text-gray-600">
                  Cotas na planilha: {validated.preview.cotaLettersNeeded.join(", ") || "—"}
                </p>
                {validated.cotasWillBeCreated.length > 0 ? (
                  <p className="text-vivant-navy font-medium">
                    Serão criadas cotas: {validated.cotasWillBeCreated.join(", ")} (cotista placeholder)
                  </p>
                ) : null}
                {validated.existingCalendar ? (
                  <div className="space-y-3 pt-2 border-t border-slate-200">
                    <p className="font-medium text-gray-800">
                      Já existe calendário em {validated.existingCalendar.year} (
                      {validated.existingCalendar.weekCount} semanas · status{" "}
                      {validated.existingCalendar.status})
                    </p>
                    <p className="text-gray-600">
                      Como deseja usar a planilha? Marque uma opção antes de confirmar a importação.
                    </p>
                    <div className="flex flex-col gap-3">
                      <label className="flex cursor-pointer gap-3 rounded-md border border-slate-200 bg-white p-3 has-[:checked]:border-vivant-navy has-[:checked]:ring-1 has-[:checked]:ring-vivant-navy">
                        <input
                          type="radio"
                          name="cmode"
                          className="mt-1 shrink-0"
                          checked={conflictMode === "replace"}
                          onChange={() => setConflictMode("replace")}
                        />
                        <span className="space-y-1 text-left">
                          <span className="font-medium text-gray-900">Substituir calendário</span>
                          <span className="block text-gray-600">
                            Remove tudo deste ano (semanas, distribuição, reservas e trocas ligadas) e
                            recria com base na planilha — como um ano novo importado do zero.
                          </span>
                        </span>
                      </label>
                      <label className="flex cursor-pointer gap-3 rounded-md border border-slate-200 bg-white p-3 has-[:checked]:border-vivant-navy has-[:checked]:ring-1 has-[:checked]:ring-vivant-navy">
                        <input
                          type="radio"
                          name="cmode"
                          className="mt-1 shrink-0"
                          checked={conflictMode === "merge"}
                          onChange={() => setConflictMode("merge")}
                        />
                        <span className="space-y-1 text-left">
                          <span className="font-medium text-gray-900">Atualizar calendário (mesclar)</span>
                          <span className="block text-gray-600">
                            Mantém o que já existe e ajusta conforme a planilha (atualiza semanas e a
                            distribuição desta importação sem apagar o ano inteiro).
                          </span>
                        </span>
                      </label>
                      <label className="flex cursor-pointer gap-3 rounded-md border border-slate-200 bg-white p-3 has-[:checked]:border-amber-300 has-[:checked]:ring-1 has-[:checked]:ring-amber-400">
                        <input
                          type="radio"
                          name="cmode"
                          className="mt-1 shrink-0"
                          checked={conflictMode === "abort"}
                          onChange={() => setConflictMode("abort")}
                        />
                        <span className="space-y-1 text-left">
                          <span className="font-medium text-gray-900">Cancelar importação</span>
                          <span className="block text-gray-600">
                            Não altera o calendário atual. Feche o modal ou escolha substituir/atualizar
                            se quiser importar depois.
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>
                ) : null}
                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    id="pub"
                    checked={publishAfter}
                    onCheckedChange={(c) => setPublishAfter(c === true)}
                  />
                  <Label htmlFor="pub" className="cursor-pointer font-normal">
                    Publicar calendário após importar
                  </Label>
                </div>
              </div>
            ) : null}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              Fechar
            </Button>
            <Button
              type="button"
              className="bg-vivant-green hover:bg-vivant-green/90"
              disabled={
                importing ||
                !validated ||
                (validated?.existingCalendar
                  ? !conflictMode || conflictMode === "abort"
                  : false)
              }
              onClick={() => void runImport()}
            >
              {importing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirmar importação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={publishPromptOpen} onOpenChange={setPublishPromptOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publicar calendário agora?</AlertDialogTitle>
            <AlertDialogDescription>
              O ano foi importado em rascunho. Você pode publicar para liberar no portal do cotista,
              ou publicar depois pelo botão &quot;Publicar calendário&quot; nesta página.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setPublishPromptOpen(false);
                onImported();
                handleClose(false);
              }}
            >
              Depois
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => void publishNow()}>Publicar agora</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
