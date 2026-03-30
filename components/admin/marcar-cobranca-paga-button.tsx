"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  cobrancaId: string;
  status: string;
  /** Destaque quando já há comprovante enviado */
  temComprovante: boolean;
};

export function MarcarCobrancaPagaButton({
  cobrancaId,
  status,
  temComprovante,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (status === "PAGA" || status === "CANCELADA") {
    return null;
  }

  const confirmar = async () => {
    const msg = temComprovante
      ? "Confirmar que o comprovante está ok e marcar esta cobrança como PAGA?"
      : "Marcar esta cobrança como PAGA? (Não há comprovante anexado.)";
    if (!window.confirm(msg)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cobrancas/${cobrancaId}`, {
        method: "PATCH",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Cobrança marcada como paga. O cotista foi notificado.");
        router.refresh();
      } else {
        toast.error(data.error || "Não foi possível atualizar");
      }
    } catch {
      toast.error("Erro ao atualizar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      className={
        temComprovante
          ? "bg-vivant-green hover:bg-vivant-green/90 text-white"
          : "bg-vivant-navy hover:bg-vivant-navy/90 text-white"
      }
      disabled={loading}
      onClick={() => void confirmar()}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CheckCircle2 className="mr-2 h-4 w-4" />
      )}
      Marcar como paga
    </Button>
  );
}
