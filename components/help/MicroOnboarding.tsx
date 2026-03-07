"use client";

import { TutorialTour } from "./TutorialTour";
import { TutorialButton } from "./TutorialButton";
import type { TutorialStep } from "./TutorialTour";

type MicroOnboardingProps = {
  tutorialKey: string;
  steps: TutorialStep[];
  className?: string;
};

/**
 * Micro tutorial (3-5 passos curtos) por módulo.
 * Só aparece no primeiro acesso; botão "Rever" para repetir.
 */
export function MicroOnboarding({ tutorialKey, steps, className = "" }: MicroOnboardingProps) {
  if (steps.length === 0) return null;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TutorialTour tutorialKey={tutorialKey} steps={steps} autoStart />
      <TutorialButton tutorialKey={tutorialKey} steps={steps} label="Rever" />
    </div>
  );
}
