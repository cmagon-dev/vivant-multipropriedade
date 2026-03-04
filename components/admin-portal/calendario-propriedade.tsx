"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarioData {
  propriedade: {
    id: string;
    name: string;
    totalCotas: number;
    cotasAlocadas: number;
  };
  ano: number;
  calendario: Array<{
    semana: number;
    reserva: any;
    cota: any;
    disponivel: boolean;
    cotasComDireito: any[];
  }>;
}

interface CalendarioPropriedadeProps {
  propriedadeId: string;
}

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const getStatusColor = (semana: any) => {
  if (!semana.reserva) {
    return "bg-gray-100 hover:bg-gray-200 border-gray-300";
  }
  
  switch (semana.reserva.status) {
    case "CONFIRMADA":
    case "EM_USO":
    case "FINALIZADA":
      return "bg-green-100 hover:bg-green-200 border-green-400 text-green-800";
    case "PENDENTE":
      return "bg-yellow-100 hover:bg-yellow-200 border-yellow-400 text-yellow-800";
    case "DISPONIVEL_TROCA":
      return "bg-blue-100 hover:bg-blue-200 border-blue-400 text-blue-800";
    case "CANCELADA":
    case "NAO_UTILIZADA":
      return "bg-red-100 hover:bg-red-200 border-red-400 text-red-800";
    default:
      return "bg-gray-100 hover:bg-gray-200 border-gray-300";
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    CONFIRMADA: "Confirmada",
    PENDENTE: "Pendente",
    EM_USO: "Em Uso",
    FINALIZADA: "Finalizada",
    CANCELADA: "Cancelada",
    NAO_UTILIZADA: "Não Utilizada",
    DISPONIVEL_TROCA: "Disponível p/ Troca",
  };
  return labels[status] || status;
};

// Distribuir 52 semanas em 12 meses (aproximadamente 4-5 semanas por mês)
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

export function CalendarioPropriedade({ propriedadeId }: CalendarioPropriedadeProps) {
  const [data, setData] = useState<CalendarioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [semanaHover, setSemanaHover] = useState<number | null>(null);

  useEffect(() => {
    fetchCalendario();
  }, [ano]);

  const fetchCalendario = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/propriedades/${propriedadeId}/calendario?ano=${ano}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error("Erro ao buscar calendário:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSemanaInfo = (numeroSemana: number) => {
    if (!data) return null;
    return data.calendario.find(s => s.semana === numeroSemana);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-vivant-navy" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-600">Erro ao carregar calendário</p>
        </CardContent>
      </Card>
    );
  }

  const semanaInfo = semanaHover ? getSemanaInfo(semanaHover) : null;

  return (
    <div className="space-y-6">
      {/* Header com Seletor de Ano */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-vivant-green" />
              Calendário Anual - {data.propriedade.name}
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAno(ano - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Select
                value={ano.toString()}
                onValueChange={(value) => setAno(parseInt(value))}
              >
                <SelectTrigger className="w-32">
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
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAno(ano + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Legenda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-100 border-2 border-gray-300 rounded" />
              <span>Disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 border-2 border-green-400 rounded" />
              <span>Confirmada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-400 rounded" />
              <span>Pendente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 border-2 border-blue-400 rounded" />
              <span>Disponível p/ Troca</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-100 border-2 border-red-400 rounded" />
              <span>Cancelada</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendário por Meses */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MESES.map((nomeMes, mesIndex) => {
          const semanasDoMes = getSemanasDoMes(mesIndex);
          
          return (
            <Card key={mesIndex}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-vivant-navy">
                  {nomeMes}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {semanasDoMes.map((numeroSemana) => {
                    const semana = getSemanaInfo(numeroSemana);
                    if (!semana) return null;
                    
                    return (
                      <div
                        key={numeroSemana}
                        className={cn(
                          "relative p-2 rounded border-2 text-center cursor-pointer transition-all",
                          getStatusColor(semana)
                        )}
                        onMouseEnter={() => setSemanaHover(numeroSemana)}
                        onMouseLeave={() => setSemanaHover(null)}
                        title={semana.cota ? `${semana.cota.cotista.name} - Cota ${semana.cota.numeroCota}` : "Disponível"}
                      >
                        <div className="text-xs font-bold">{numeroSemana}</div>
                        {semana.cota && (
                          <div className="text-[10px] mt-1 truncate">
                            {semana.cota.numeroCota}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tooltip de Detalhes */}
      {semanaInfo && (
        <Card className="border-2 border-vivant-navy">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Semana {semanaInfo.semana} - {ano}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {semanaInfo.reserva ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-semibold",
                    semanaInfo.reserva.status === "CONFIRMADA" && "bg-green-100 text-green-800",
                    semanaInfo.reserva.status === "PENDENTE" && "bg-yellow-100 text-yellow-800",
                    semanaInfo.reserva.status === "DISPONIVEL_TROCA" && "bg-blue-100 text-blue-800"
                  )}>
                    {getStatusLabel(semanaInfo.reserva.status)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Cotista:</span>
                  <span className="text-sm font-semibold">{semanaInfo.cota.cotista.name}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Cota:</span>
                  <span className="text-sm font-semibold">{semanaInfo.cota.numeroCota}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Check-in:</span>
                  <span className="text-sm">
                    {new Date(semanaInfo.reserva.dataInicio).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Check-out:</span>
                  <span className="text-sm">
                    {new Date(semanaInfo.reserva.dataFim).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Semana disponível</p>
                
                {semanaInfo.cotasComDireito.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Cotas com direito a esta semana:
                    </p>
                    <div className="space-y-1">
                      {semanaInfo.cotasComDireito.map((c: any) => (
                        <div key={c.id} className="text-xs bg-vivant-green/10 px-2 py-1 rounded">
                          {c.cotista.name} - Cota {c.numeroCota}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resumo */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-vivant-navy">
                {data.calendario.filter(s => s.reserva?.status === "CONFIRMADA").length}
              </p>
              <p className="text-xs text-gray-600">Reservas Confirmadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {data.calendario.filter(s => s.reserva?.status === "PENDENTE").length}
              </p>
              <p className="text-xs text-gray-600">Pendentes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">
                {data.calendario.filter(s => s.disponivel).length}
              </p>
              <p className="text-xs text-gray-600">Disponíveis</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {data.calendario.filter(s => s.reserva?.status === "DISPONIVEL_TROCA").length}
              </p>
              <p className="text-xs text-gray-600">Em Troca</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
