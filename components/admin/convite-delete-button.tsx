"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  conviteId: string;
  className?: string;
};

export function ConviteDeleteButton({ conviteId, className }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const onDelete = async () => {
    const ok = confirm("Deseja excluir este convite? Esta ação não pode ser desfeita.");
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/cotistas/invite/${conviteId}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Erro ao excluir convite.");
        return;
      }
      toast.success("Convite excluído com sucesso.");
      router.refresh();
    } catch {
      toast.error("Erro ao excluir convite.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onDelete}
      disabled={deleting}
      aria-label="Excluir convite"
      title="Excluir convite"
      className={className}
    >
      {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </Button>
  );
}
