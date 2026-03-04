"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfigurarSemanasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cota: {
    id: string;
    numeroCota: string;
    semanasConfig: any;
    cotista: {
      name: string;
    };
  };
  propriedadeId: string;
  onSuccess: () => void;
}

const MESES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

// Distribuir 52 semanas em 12 meses
const getSemanasDoMes = (mes: number): number[] => {
  const semanasPorMes = [
    [1, 2, 3, 4, 5],      // Janeiro
    [6, 7, 8, 9],         // Fevereiro
    [10, 11, 12, 13],     // Março
    [14, 15, 16, 17, 18], // Abril
    [19, 20, 21, 22],     // Maio
    [23, 24, 25, 26, 27], // Junho
    [28, 29, 30, 31],     // Julho
    [32, 33, 34, 35],     // Agosto
    [36, 37, 38, 39, 40], // Setembro
    [41, 42, 43, 44],     // Outubro
    [45, 46, 47, 48],     // Novembro
    [49, 50, 51, 52],     // Dezembro
  ];
  
  return semanasPorMes[mes] || [];
};

export function ConfigurarSemanasDialog({
  open,
  onOpenChange,
  cota,
  propriedadeId,
  onSuccess,
}: ConfigurarSemanasDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anoBase, setAnoBase] = useState(new Date().getFullYear());
  const [semanasSelecionadas, setSemanasSelecionadas] = useState<number[]>([]);

  useEffect(() => {
    if (open && cota.semanasConfig) {
      const config = cota.semanasConfig as any;
      setAnoBase(config.baseYear || new Date().getFullYear());
      setSemanasSelecionadas(config.weeks || []);
    }
  }, [open, cota]);

  const toggleSemana = (semana: number) => {
    if (semanasSelecionadas.includes(semana)) {
      setSemanasSelecionadas(semanasSelecionadas.filter(s => s !== semana));
    } else {
      setSemanasSelecionadas([...semanasSelecionadas, semana].sort((a, b) => a - b));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/propriedades/${propriedadeId}/cotas/${cota.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          semanasConfig: {
            baseYear: anoBase,
            weeks: semanasSelecionadas,
          }
        }),
      });

      if (res.ok) {
        toast.success("Semanas configuradas com sucesso!");
        onSuccess();
        onOpenChange(false);
      } else {
        const error = await res.json();
        toast.error(error.error || "Erro ao configurar semanas");
      }
    } catch (error) {
      toast.error("Erro ao configurar semanas");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-vivant-green" />
            Configurar Semanas - Cota {cota.numeroCota}
          </DialogTitle>
          <DialogDescription>
            Selecione as semanas do ano que pertencem a {cota.cotista.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="anoBase">Ano Base</Label>
            <Select
              value={anoBase.toString()}
              onValueChange={(value) => setAnoBase(parseInt(value))}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 1 + i;
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Semanas Selecionadas ({semanasSelecionadas.length})</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSemanasSelecionadas([])}
                >
                  Limpar Tudo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSemanasSelecionadas(Array.from({ length: 52 }, (_, i) => i + 1))}
                >
                  Selecionar Todas
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MESES.map((nomeMes, mesIndex) => {
                const semanasDoMes = getSemanasDoMes(mesIndex);
                
                return (
                  <div key={mesIndex} className="border rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-vivant-navy mb-2">
                      {nomeMes}
                    </h4>
                    <div className="grid grid-cols-5 gap-2">
                      {semanasDoMes.map((numeroSemana) => {
                        const isSelected = semanasSelecionadas.includes(numeroSemana);
                        
                        return (
                          <button
                            key={numeroSemana}
                            type="button"
                            onClick={() => toggleSemana(numeroSemana)}
                            className={cn(
                              "p-2 rounded text-xs font-semibold transition-all border-2",
                              isSelected
                                ? "bg-vivant-green text-white border-vivant-green hover:bg-vivant-green/90"
                                : "bg-white text-gray-700 border-gray-300 hover:border-vivant-green"
                            )}
                          >
                            {numeroSemana}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preview das Semanas Selecionadas */}
          {semanasSelecionadas.length > 0 && (
            <div className="bg-vivant-green/10 p-4 rounded-lg">
              <p className="text-sm font-medium text-vivant-navy mb-2">
                Semanas Selecionadas:
              </p>
              <p className="text-sm text-gray-700">
                {semanasSelecionadas.join(", ")}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || semanasSelecionadas.length === 0}
            className="bg-vivant-green hover:bg-vivant-green/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Configuração"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
