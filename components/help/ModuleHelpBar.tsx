"use client";

import { TutorialTour } from "./TutorialTour";
import { TutorialButton } from "./TutorialButton";
import type { TutorialStep } from "./TutorialTour";

type ModuleHelpBarProps = {
  tutorialKey: string;
  steps: TutorialStep[];
  className?: string;
};

/**
 * Barra padrão para módulos: inicia o tour no primeiro acesso e exibe botão "Rever tutorial".
 */
export function ModuleHelpBar({ tutorialKey, steps, className = "" }: ModuleHelpBarProps) {
  if (steps.length === 0) return null;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TutorialTour tutorialKey={tutorialKey} steps={steps} autoStart />
      <TutorialButton tutorialKey={tutorialKey} steps={steps} />
    </div>
  );
}
