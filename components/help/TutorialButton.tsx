"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import type { TutorialStep } from "./TutorialTour";

type TutorialButtonProps = {
  tutorialKey: string;
  steps: TutorialStep[];
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
};

export function TutorialButton({
  tutorialKey,
  steps,
  variant = "outline",
  size = "sm",
  className,
  label = "Rever tutorial",
}: TutorialButtonProps) {
  const [running, setRunning] = useState(false);

  if (steps.length === 0) return null;

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={() => setRunning(true)}
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        {label}
      </Button>
      {running && (
        <TutorialTourInline
          tutorialKey={tutorialKey}
          steps={steps}
          autoStart={true}
          onComplete={() => setRunning(false)}
          onDismiss={() => setRunning(false)}
        />
      )}
    </>
  );
}

function TutorialTourInline({
  tutorialKey,
  steps,
  autoStart,
  onComplete,
  onDismiss,
}: {
  tutorialKey: string;
  steps: TutorialStep[];
  autoStart: boolean;
  onComplete?: () => void;
  onDismiss?: () => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  if (!step) return null;

  const next = () => {
    if (stepIndex >= steps.length - 1) {
      onComplete?.();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} aria-hidden />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
        <p className="text-gray-600 text-sm mb-6">{step.content}</p>
        <div className="flex justify-between items-center">
          <Button type="button" variant="ghost" size="sm" onClick={onDismiss}>
            Fechar
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
}
