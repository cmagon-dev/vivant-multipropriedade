"use client";

import { useState, useEffect, useRef } from "react";
import { HelpCircle, ExternalLink } from "lucide-react";

type HelpTipProps = {
  helpKey: string;
  fallbackTitle?: string;
  fallbackText?: string;
  className?: string;
};

type HelpContent = {
  id: string;
  key: string;
  title: string;
  description: string | null;
  shortText: string | null;
  videoUrl: string | null;
};

export function HelpTip({
  helpKey,
  fallbackTitle = "Ajuda",
  fallbackText,
  className = "",
}: HelpTipProps) {
  const [content, setContent] = useState<HelpContent | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!helpKey) return;
    setLoading(true);
    fetch(`/api/help/content?key=${encodeURIComponent(helpKey)}`)
      .then((r) => r.json())
      .then((data) => (data && data.id ? setContent(data) : setContent(null)))
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [helpKey]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const title = content?.title ?? fallbackTitle;
  const text = content?.shortText ?? content?.description ?? fallbackText ?? "";
  const hasContent = title !== "Ajuda" || text;

  return (
    <div className={`relative inline-flex ${className}`} ref={ref}>
      <button
        type="button"
        aria-label="Ajuda"
        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-gray-400 hover:text-vivant-navy hover:bg-gray-100 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute left-full ml-1 top-0 z-50 min-w-[200px] max-w-[320px] p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-left">
          {loading ? (
            <p className="text-sm text-gray-500">Carregando...</p>
          ) : (
            <>
              <p className="font-medium text-gray-900 text-sm">{title}</p>
              {(text || content?.description) && (
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                  {content?.shortText ?? content?.description ?? text}
                </p>
              )}
              {content?.videoUrl && (
                <a
                  href={content.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-vivant-navy hover:underline mt-2"
                >
                  Ver vídeo <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {!content && !fallbackText && (
                <p className="text-xs text-gray-400 mt-1">Conteúdo não configurado. Use Admin → Ajuda para editar.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
