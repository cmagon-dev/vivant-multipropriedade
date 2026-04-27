"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  propriedadeId: string;
  propriedadeNome?: string;
  className?: string;
};

export function PropriedadeDeleteButton({
  propriedadeId,
  propriedadeNome,
  className,
}: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const onDelete = async () => {
    const label = propriedadeNome ? ` "${propriedadeNome}"` : "";
    const ok = confirm(
      `Deseja excluir a propriedade${label}? Esta ação não pode ser desfeita.`
    );
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/propriedades/${propriedadeId}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Erro ao excluir propriedade.");
        return;
      }
      toast.success("Propriedade excluída com sucesso.");
      router.refresh();
    } catch {
      toast.error("Erro ao excluir propriedade.");
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
      aria-label="Excluir propriedade"
      title="Excluir propriedade"
      className={className}
    >
      {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </Button>
  );
}
