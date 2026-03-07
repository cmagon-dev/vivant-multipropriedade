"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";

export type TutorialStep = {
  id: string;
  target?: string; // selector ou data-tour
  title: string;
  content: string;
};

type TutorialTourProps = {
  tutorialKey: string;
  steps: TutorialStep[];
  autoStart?: boolean;
  onComplete?: () => void;
  onDismiss?: () => void;
};

export function TutorialTour({
  tutorialKey,
  steps,
  autoStart = true,
  onComplete,
  onDismiss,
}: TutorialTourProps) {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);

  const persistDismiss = useCallback(async () => {
    try {
      await fetch("/api/tutorial/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: tutorialKey, dismissed: true }),
      });
    } catch {
      // cotista: API não persiste, usar localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`tutorial-dismissed-${tutorialKey}`, "1");
        } catch {}
      }
    }
  }, [tutorialKey]);

  const persistComplete = useCallback(async () => {
    try {
      await fetch("/api/tutorial/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: tutorialKey, completed: true }),
      });
    } catch {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`tutorial-completed-${tutorialKey}`, "1");
        } catch {}
      }
    }
  }, [tutorialKey]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/tutorial/progress?key=${encodeURIComponent(tutorialKey)}`);
        const data = await res.json();
        if (cancelled) return;
        if (data?.completedAt || data?.dismissedAt) {
          setDone(true);
          setLoading(false);
          return;
        }
        const localDismiss = typeof window !== "undefined" && (localStorage.getItem(`tutorial-dismissed-${tutorialKey}`) || localStorage.getItem(`tutorial-completed-${tutorialKey}`));
        if (localDismiss) {
          setDone(true);
          setLoading(false);
          return;
        }
        if (autoStart && steps.length > 0) setActive(true);
      } catch {
        if (autoStart && steps.length > 0) setActive(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [tutorialKey, autoStart, steps.length]);

  const close = useCallback(() => {
    setActive(false);
    persistDismiss();
    onDismiss?.();
  }, [persistDismiss, onDismiss]);

  const next = useCallback(() => {
    if (stepIndex >= steps.length - 1) {
      setActive(false);
      persistComplete();
      onComplete?.();
    } else {
      setStepIndex((i) => i + 1);
    }
  }, [stepIndex, steps.length, persistComplete, onComplete]);

  if (loading || !active || done || steps.length === 0) return null;

  const step = steps[stepIndex];
  if (!step) return null;

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={close} aria-hidden />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
        <p className="text-gray-600 text-sm mb-6">{step.content}</p>
        <div className="flex justify-between items-center">
          <Button type="button" variant="ghost" size="sm" onClick={close}>
            Pular
          </Button>
          <div className="flex gap-2">
            {stepIndex > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStepIndex((i) => i - 1)}
              >
                Anterior
              </Button>
            )}
            <Button type="button" size="sm" onClick={next}>
              {stepIndex >= steps.length - 1 ? "Concluir" : "Próximo"}
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          {stepIndex + 1} / {steps.length}
        </p>
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(content, document.body);
  }
  return null;
}
