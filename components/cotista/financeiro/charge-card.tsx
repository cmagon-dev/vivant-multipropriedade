import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

interface ChargeCardProps {
  charge: {
    id: string;
    tipo: string;
    descricao: string;
    valor: number;
    dataVencimento: string;
    dataPagamento?: string;
    status: string;
    urlBoleto?: string;
    property: {
      name: string;
    };
  };
}

const tipoLabels: Record<string, string> = {
  CONDOMINIO: "Condomínio",
  LIMPEZA: "Limpeza",
  MANUTENCAO: "Manutenção",
  SEGURO: "Seguro",
  IPTU: "IPTU",
  TAXA_GESTAO: "Taxa de Gestão",
  OUTROS: "Outros"
};

const statusConfig = {
  PENDENTE: {
    label: "Pendente",
    color: "bg-orange-100 border-orange-300 text-orange-700",
    icon: Clock,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600"
  },
  VENCIDA: {
    label: "Vencida",
    color: "bg-red-100 border-red-300 text-red-700",
    icon: AlertCircle,
    iconBg: "bg-red-100",
    iconColor: "text-red-600"
  },
  PAGA: {
    label: "Paga",
    color: "bg-vivant-green/20 border-vivant-green/40 text-vivant-green",
    icon: CheckCircle2,
    iconBg: "bg-vivant-green/10",
    iconColor: "text-vivant-green"
  }
};

export function ChargeCard({ charge }: ChargeCardProps) {
  const config = statusConfig[charge.status as keyof typeof statusConfig] || statusConfig.PENDENTE;
  const StatusIcon = config.icon;
  const isOverdue = charge.status === "VENCIDA";
  const isPaid = charge.status === "PAGA";

  return (
    <Card className={`border-2 ${config.color.split(" ")[0]} ${config.color.split(" ")[1]} hover:shadow-lg transition-shadow`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-lg ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
            <DollarSign className={`w-6 h-6 ${config.iconColor}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-bold text-[#1A2F4B] text-base mb-0.5">
                  {tipoLabels[charge.tipo] || charge.tipo}
                </h3>
                <p className="text-xs text-[#1A2F4B]/60">{charge.descricao}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
                <StatusIcon className="w-3 h-3" />
                {config.label}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#1A2F4B]/60 mb-3">
              <span>{charge.property.name}</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-[#1A2F4B]">
                  R$ {charge.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <p className={`text-xs font-medium ${isOverdue ? "text-red-600" : "text-[#1A2F4B]/60"}`}>
                  {isPaid ? "Pago em " : isOverdue ? "Venceu em " : "Vence em "}
                  {format(new Date(isPaid ? charge.dataPagamento! : charge.dataVencimento), "dd/MM/yyyy")}
                </p>
              </div>
            </div>

            {!isPaid && (
              <div className="flex gap-2">
                {charge.urlBoleto && (
                  <Button 
                    asChild
                    size="sm" 
                    className="flex-1 bg-vivant-green hover:bg-vivant-green/90"
                  >
                    <a href={charge.urlBoleto} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Boleto
                    </a>
                  </Button>
                )}
                <Button 
                  asChild
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                >
                  <Link href={`/dashboard/financeiro/${charge.id}`}>
                    <Upload className="w-4 h-4 mr-2" />
                    Enviar Comprovante
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
