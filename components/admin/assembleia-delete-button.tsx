"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  assembleiaId: string;
  className?: string;
  iconOnly?: boolean;
};

export function AssembleiaDeleteButton({ assembleiaId, className, iconOnly = false }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const onDelete = async () => {
    const ok = confirm("Deseja excluir esta assembleia? Esta ação não pode ser desfeita.");
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/assembleias/${assembleiaId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Erro ao excluir assembleia.");
        return;
      }
      toast.success("Assembleia excluída com sucesso.");
      router.refresh();
    } catch {
      toast.error("Erro ao excluir assembleia.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size={iconOnly ? "icon" : "sm"}
      onClick={onDelete}
      disabled={deleting}
      aria-label="Excluir assembleia"
      title="Excluir assembleia"
      className={className}
    >
      {deleting ? (
        <Loader2 className={`w-4 h-4 animate-spin ${iconOnly ? "" : "mr-1"}`} />
      ) : (
        <Trash2 className={`w-4 h-4 ${iconOnly ? "" : "mr-1"}`} />
      )}
      {!iconOnly ? "Excluir" : null}
    </Button>
  );
}
