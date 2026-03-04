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
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, LogOut } from "lucide-react";
import { toast } from "sonner";

interface CheckoutFormProps {
  open: boolean;
  onClose: () => void;
  reservationId: string;
  propertyName: string;
}

export function CheckoutForm({ 
  open, 
  onClose, 
  reservationId,
  propertyName 
}: CheckoutFormProps) {
  const [solicitarLimpeza, setSolicitarLimpeza] = useState(true);
  const [observacoes, setObservacoes] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      const response = await fetch(`/api/cotistas/reservas/${reservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "FINALIZADA",
          limpezaSolicitada: solicitarLimpeza,
          observacoes,
        }),
      });

      if (response.ok) {
        toast.success("Check-out realizado com sucesso!");
        if (solicitarLimpeza) {
          toast.success("Limpeza solicitada para a equipe Vivant Care");
        }
        onClose();
        window.location.reload();
      } else {
        const data = await response.json();
        toast.error(data.error || "Erro ao realizar check-out");
      }
    } catch (error) {
      toast.error("Erro ao realizar check-out");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-[#1A2F4B] flex items-center gap-2">
            <LogOut className="w-6 h-6 text-vivant-green" />
            Check-out
          </DialogTitle>
          <DialogDescription>
            Finalize sua estadia em {propertyName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3 p-4 bg-vivant-green/10 border-2 border-vivant-green/30 rounded-lg">
            <Sparkles className="w-5 h-5 text-vivant-green mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-[#1A2F4B] font-medium mb-1">
                Solicitar Limpeza Pós-Uso
              </p>
              <p className="text-xs text-[#1A2F4B]/70">
                Deixe a casa pronta para o próximo cotista com nossa limpeza profissional
              </p>
            </div>
            <Checkbox
              checked={solicitarLimpeza}
              onCheckedChange={(checked) => setSolicitarLimpeza(checked as boolean)}
              className="data-[state=checked]:bg-vivant-green data-[state=checked]:border-vivant-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes" className="text-[#1A2F4B]">
              Observações sobre sua estadia (opcional)
            </Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Relate algo que notou durante sua estadia: manutenções necessárias, sugestões, etc."
              className="resize-none"
              rows={4}
            />
            <p className="text-xs text-[#1A2F4B]/50">
              Suas observações ajudam a manter a qualidade da propriedade
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 bg-vivant-green hover:bg-vivant-green/90"
              onClick={handleCheckout}
              disabled={processing}
            >
              {processing ? "Processando..." : "Confirmar Check-out"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={processing}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
