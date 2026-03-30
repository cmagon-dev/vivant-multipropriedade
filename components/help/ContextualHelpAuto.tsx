"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { getHelpSlugForRoute } from "@/lib/help/route-to-help";
import { getHelpTopicBySlug } from "@/lib/help/help-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen, X } from "lucide-react";

const STORAGE_PREFIX = "help-dismissed-";

function getStorageKey(pathname: string): string {
  // Mantém compatibilidade geral e força nova exibição no comercial após ajuste de layout.
  if (pathname.startsWith("/dashboard/comercial")) {
    return `${STORAGE_PREFIX}comercial-v2-${pathname}`;
  }
  return `${STORAGE_PREFIX}${pathname}`;
}

export function ContextualHelpAuto() {
  const pathname = usePathname();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Não exibir ajuda automática nas próprias páginas de ajuda
  const isHelpPage = pathname?.startsWith("/admin/help");
  const slug = pathname && !isHelpPage ? getHelpSlugForRoute(pathname) : undefined;
  const topic = slug ? getHelpTopicBySlug(slug) : undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !pathname || !slug) {
      setDismissed(true);
      return;
    }
    try {
      const key = getStorageKey(pathname);
      const stored = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      setDismissed(stored === "1");
    } catch {
      setDismissed(true);
    }
  }, [mounted, pathname, slug]);

  const handleDismiss = () => {
    if (!pathname) return;
    try {
      window.localStorage.setItem(getStorageKey(pathname), "1");
      setDismissed(true);
    } catch {
      setDismissed(true);
    }
  };

  const handleReadFull = () => {
    if (!slug) return;
    handleDismiss();
    router.push(`/admin/help/${slug}`);
  };

  if (!mounted || dismissed || !topic) {
    return null;
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50/80 dark:border-blue-900/50 dark:bg-blue-950/20">
      <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-vivant-navy">
          <BookOpen className="h-5 w-5 shrink-0 text-blue-700 dark:text-blue-400" />
          <span className="font-semibold text-sm">Ajuda rápida — primeira vez nesta tela</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-gray-500 hover:text-gray-700"
          onClick={handleDismiss}
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0 space-y-3">
        <p className="font-medium text-vivant-navy text-sm">{topic.title}</p>
        <p className="text-sm text-blue-800/80 dark:text-blue-200/80 line-clamp-2">{topic.shortDescription}</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="default" size="sm" className="gap-1.5" onClick={handleReadFull} asChild>
            <Link href={`/admin/help/${slug}`}>Ler ajuda completa</Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleDismiss}>
            Entendi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
