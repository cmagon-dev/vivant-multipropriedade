"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Home, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  CotaWeekDatesLines,
  type SemanaAlocadaItem,
} from "@/components/cotista/cota-week-dates";
import { weekDisplayName } from "@/lib/vivant/week-ui-labels";

interface Property {
  id: string;
  name: string;
  location: string;
  numeroCota: string;
  semanasAlocadas?: SemanaAlocadaItem[];
}

export function PropertySelector() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [anoSemanas, setAnoSemanas] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      try {
        const response = await fetch("/api/cotistas/me/cotas", {
          credentials: "include",
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          const list = (data.cotas || []) as Property[];
          setProperties(list);
          setAnoSemanas(
            typeof data.anoSemanasAlocadas === "number"
              ? data.anoSemanasAlocadas
              : new Date().getFullYear()
          );
          if (list.length > 0) {
            const saved = localStorage.getItem("selectedPropertyId");
            const selected = list.find((p: Property) => p.id === saved) || list[0];
            setSelectedProperty(selected);
            localStorage.setItem("selectedPropertyId", selected.id);
            window.dispatchEvent(
              new CustomEvent("propertyChanged", { detail: selected })
            );
          }
        }
      } catch (error) {
        console.error("Erro ao carregar propriedades:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, []);

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    localStorage.setItem("selectedPropertyId", property.id);
    window.dispatchEvent(new CustomEvent("propertyChanged", { detail: property }));
  };

  if (loading || !selectedProperty) {
    return (
      <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg animate-pulse">
        <Home className="w-4 h-4 text-slate-400" />
        <div className="h-4 w-32 bg-slate-200 rounded" />
      </div>
    );
  }

  const dates = selectedProperty.semanasAlocadas ?? [];

  if (properties.length === 1) {
    return (
      <div className="hidden sm:flex w-[20rem] shrink-0 flex-col gap-1 rounded-lg border border-vivant-green/20 bg-vivant-green/5 px-3 py-2 overflow-hidden">
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 flex-shrink-0 text-vivant-green" />
          <div className="min-w-0 flex-1 text-sm">
            <p className="truncate font-medium text-[#1A2F4B]">{selectedProperty.name}</p>
            <p className="truncate text-xs text-[#1A2F4B]/60">{selectedProperty.numeroCota}</p>
          </div>
        </div>
        <p className="pl-6 text-[11px] leading-tight text-[#1A2F4B]/70">
          {dates.length > 0
            ? `${dates.length} semana(s) alocada(s) em ${anoSemanas ?? new Date().getFullYear()}`
            : `Sem datas em ${anoSemanas ?? new Date().getFullYear()} — o administrador ainda não distribuiu suas semanas neste calendário.`}
        </p>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="hidden h-auto min-h-[2.75rem] w-[20rem] shrink-0 flex-col items-stretch gap-1 border-vivant-green/30 py-2 hover:border-vivant-green hover:bg-vivant-green/5 sm:flex overflow-hidden"
        >
          <div className="flex w-full items-center gap-2">
            <Home className="h-4 w-4 flex-shrink-0 text-vivant-green" />
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-medium text-[#1A2F4B]">
                {selectedProperty.name}
              </p>
              <p className="truncate text-xs text-[#1A2F4B]/60">{selectedProperty.numeroCota}</p>
            </div>
            <ChevronDown className="h-4 w-4 flex-shrink-0 text-[#1A2F4B]/60" />
          </div>
          <p className="w-full pl-6 text-left text-[10px] leading-tight text-[#1A2F4B]/70 truncate">
            {dates.length > 0
              ? `${dates.length} semana(s) alocada(s) em ${anoSemanas ?? new Date().getFullYear()}`
              : `Sem datas em ${anoSemanas ?? new Date().getFullYear()}`}
          </p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[24rem] max-h-[min(70vh,28rem)] overflow-y-auto">
        <DropdownMenuLabel>Minhas cotas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {properties.map((property) => (
          <DropdownMenuItem
            key={property.id}
            onClick={() => handleSelectProperty(property)}
            className={`flex cursor-pointer flex-col items-stretch gap-2 p-3 ${
              property.id === selectedProperty.id ? "bg-vivant-green/10" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <Home className="mt-0.5 h-4 w-4 flex-shrink-0 text-vivant-green" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#1A2F4B]">{property.name}</p>
                <p className="text-xs text-[#1A2F4B]/60">{property.location}</p>
                <p className="mt-0.5 text-xs font-medium text-vivant-green">
                  {property.numeroCota}
                </p>
                <div className="mt-2 border-t border-slate-100 pt-2">
                  <CotaWeekDatesLines
                    items={property.semanasAlocadas ?? []}
                    anoReferencia={anoSemanas}
                    maxItems={4}
                    compact
                  />
                </div>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function formatRangeShort(s: SemanaAlocadaItem) {
  const a = format(parseISO(s.startDate), "dd/MM/yyyy", { locale: ptBR });
  const b = format(parseISO(s.endDate), "dd/MM/yyyy", { locale: ptBR });
  const nome = weekDisplayName(s.description, s.weekIndex);
  return `${nome}: ${a} – ${b}`;
}
