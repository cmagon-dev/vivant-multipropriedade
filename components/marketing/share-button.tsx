"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast.error("Erro ao compartilhar");
        }
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado!");
    }
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleShare}>
      <Share2 className="w-4 h-4 mr-2" />
      Compartilhar
    </Button>
  );
}
