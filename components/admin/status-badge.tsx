import { Badge } from "@/components/ui/badge";

const statusConfig = {
  DISPONIVEL: { label: "Disponível", variant: "default" as const },
  ULTIMAS_COTAS: { label: "Últimas Cotas", variant: "destructive" as const },
  PRE_LANCAMENTO: { label: "Pré-lançamento", variant: "secondary" as const },
  VENDIDO: { label: "Vendido", variant: "outline" as const },
};

interface StatusBadgeProps {
  status: keyof typeof statusConfig;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
