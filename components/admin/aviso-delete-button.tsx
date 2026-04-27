"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  avisoId: string;
  className?: string;
};

export function AvisoDeleteButton({ avisoId, className }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const onDelete = async () => {
    const ok = confirm("Deseja excluir este aviso? Esta ação não pode ser desfeita.");
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/avisos/${avisoId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Erro ao excluir aviso.");
        return;
      }
      toast.success("Aviso excluído com sucesso.");
      router.refresh();
    } catch {
      toast.error("Erro ao excluir aviso.");
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
      aria-label="Excluir aviso"
      title="Excluir aviso"
      className={className}
    >
      {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </Button>
  );
}
