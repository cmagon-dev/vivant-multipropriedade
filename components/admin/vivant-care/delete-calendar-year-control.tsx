"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  propertyId: string;
  year: number;
  /** true quando já existe PropertyCalendarYear para o ano (via API weeks). */
  hasCalendar: boolean;
  onDeleted: () => void;
};

export function DeleteCalendarYearControl({
  propertyId,
  year,
  hasCalendar,
  onDeleted,
}: Props) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!hasCalendar) return null;

  const runDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/propriedades/${propertyId}/calendar-year?year=${year}`,
        { method: "DELETE" }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Não foi possível excluir");
        return;
      }
      toast.success("Calendário do ano excluído.");
      setOpen(false);
      onDeleted();
    } catch {
      toast.error("Erro ao excluir calendário");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="shrink-0 border-red-300 text-red-700 hover:bg-red-50"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="mr-2 h-4 w-4 shrink-0" />
        Excluir calendário
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir calendário de {year}?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-left text-sm text-gray-700">
                <p className="font-semibold text-red-800">
                  ATENÇÃO: isso vai apagar todas as semanas, distribuição, reservas e trocas desse ano.
                </p>
                <p className="font-medium text-gray-900">Deseja continuar?</p>
                <p className="text-muted-foreground">
                  Esta ação não pode ser desfeita. Depois você pode usar &quot;Importar calendário&quot; ou
                  &quot;Gerar semanas&quot; para montar o ano de novo.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={() => void runDelete()}
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
              ) : null}
              Confirmar exclusão
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
