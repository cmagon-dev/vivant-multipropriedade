"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  CotistaOfficialWeek,
  CotistaWeekReservation,
} from "@/lib/vivant/cotista-calendar-types";
import { CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
  week: CotistaOfficialWeek;
  year: number;
  cotaId: string;
  reservation?: CotistaWeekReservation;
}

export function ReservationModal({
  open,
  onClose,
  week,
  year,
  cotaId,
  reservation,
}: ReservationModalProps) {
  const [observacoes, setObservacoes] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  const start = new Date(week.startDate);
  const end = new Date(week.endDate);

  const handleConfirm = async () => {
    setConfirmando(true);
    try {
      const response = await fetch(`/api/cotistas/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cotaId,
          propertyCalendarWeekId: week.id,
          observacoes,
        }),
      });

      if (response.ok) {
        toast.success("Reserva confirmada com sucesso!");
        onClose();
        window.location.reload();
      } else {
        const data = await response.json();
        toast.error(data.error || "Erro ao confirmar reserva");
      }
    } catch {
      toast.error("Erro ao confirmar reserva");
    } finally {
      setConfirmando(false);
    }
  };

  const handleCancel = async () => {
    if (!reservation) return;

    setCancelando(true);
    try {
      const response = await fetch(`/api/cotistas/reservas/${reservation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "NAO_UTILIZADA",
        }),
      });

      if (response.ok) {
        toast.success("Reserva marcada como não utilizada");
        onClose();
        window.location.reload();
      } else {
        toast.error("Erro ao cancelar reserva");
      }
    } catch {
      toast.error("Erro ao cancelar reserva");
    } finally {
      setCancelando(false);
    }
  };

  const hasReservation =
    reservation &&
    reservation.status !== "NAO_UTILIZADA" &&
    reservation.status !== "CANCELADA";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-[#1A2F4B]">
            Semana {week.weekIndex} · {year}
          </DialogTitle>
          <DialogDescription>
            {format(start, "dd 'de' MMMM", { locale: ptBR })} -{" "}
            {format(end, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {hasReservation ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Reserva ativa</span>
                </div>
                <p className="text-sm text-blue-800">
                  Status: {reservation.status}
                </p>
                {reservation.observacoes && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs text-blue-700 font-medium mb-1">Observações:</p>
                    <p className="text-sm text-blue-800">{reservation.observacoes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => void handleCancel()}
                  disabled={cancelando}
                >
                  {cancelando ? "Cancelando..." : "Não vou utilizar"}
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Fechar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-vivant-green/10 border-2 border-vivant-green/30 rounded-lg">
                <p className="text-sm text-[#1A2F4B]">
                  Confirme sua presença nesta semana ou deixe disponível para outros cotistas.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes" className="text-[#1A2F4B]">
                  Observações (opcional)
                </Label>
                <Textarea
                  id="observacoes"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex: Chegarei às 15h, preciso de berço para bebê..."
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-vivant-green hover:bg-vivant-green/90"
                  onClick={() => void handleConfirm()}
                  disabled={confirmando}
                >
                  {confirmando ? "Confirmando..." : "Confirmar Reserva"}
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
