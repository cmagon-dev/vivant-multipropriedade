"use client";

import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const TAILWIND_COLORS = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
] as const;

const INTENSITIES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

const REGEX = /^from-(\w+)-(\d+)\s+to-(\w+)-(\d+)$/;

function parseGradient(value: string): {
  fromColor: string;
  fromIntensity: number;
  toColor: string;
  toIntensity: number;
} {
  const m = value?.trim().match(REGEX);
  if (m) {
    return {
      fromColor: m[1],
      fromIntensity: Number(m[2]),
      toColor: m[3],
      toIntensity: Number(m[4]),
    };
  }
  return {
    fromColor: "blue",
    fromIntensity: 500,
    toColor: "cyan",
    toIntensity: 400,
  };
}

function buildGradient(fromColor: string, fromIntensity: number, toColor: string, toIntensity: number): string {
  return `from-${fromColor}-${fromIntensity} to-${toColor}-${toIntensity}`;
}

/** Hex aproximados para preview (Tailwind default palette). */
const COLOR_HEX: Record<string, Record<number, string>> = {
  blue: { 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb" },
  cyan: { 400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2" },
  green: { 400: "#4ade80", 500: "#22c55e", 600: "#16a34a" },
  emerald: { 400: "#34d399", 500: "#10b981", 600: "#059669" },
  teal: { 400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488" },
  sky: { 400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7" },
  indigo: { 400: "#818cf8", 500: "#6366f1", 600: "#4f46e5" },
  violet: { 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed" },
  purple: { 400: "#c084fc", 500: "#a855f7", 600: "#9333ea" },
  fuchsia: { 400: "#e879f9", 500: "#d946ef", 600: "#c026d3" },
  pink: { 400: "#f472b6", 500: "#ec4899", 600: "#db2777" },
  rose: { 400: "#fb7185", 500: "#f43f5e", 600: "#e11d48" },
  red: { 400: "#f87171", 500: "#ef4444", 600: "#dc2626" },
  orange: { 400: "#fb923c", 500: "#f97316", 600: "#ea580c" },
  amber: { 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706" },
  yellow: { 400: "#facc15", 500: "#eab308", 600: "#ca8a04" },
  lime: { 400: "#a3e635", 500: "#84cc16", 600: "#65a30d" },
  slate: { 400: "#94a3b8", 500: "#64748b", 600: "#475569" },
  gray: { 400: "#9ca3af", 500: "#6b7280", 600: "#4b5563" },
  zinc: { 400: "#a1a1aa", 500: "#71717a", 600: "#52525b" },
  neutral: { 400: "#a3a3a3", 500: "#737373", 600: "#525252" },
  stone: { 400: "#a8a29e", 500: "#78716c", 600: "#57534e" },
};

function getHex(color: string, intensity: number): string {
  const c = COLOR_HEX[color] ?? COLOR_HEX.blue;
  return c[intensity as keyof typeof c] ?? c[500] ?? "#3b82f6";
}

interface GradientColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  error?: string;
  className?: string;
}

export function GradientColorPicker({ value, onChange, id, error, className }: GradientColorPickerProps) {
  const { fromColor, fromIntensity, toColor, toIntensity } = useMemo(() => parseGradient(value || ""), [value]);

  const safeFromColor = TAILWIND_COLORS.includes(fromColor as any) ? fromColor : "blue";
  const safeToColor = TAILWIND_COLORS.includes(toColor as any) ? toColor : "cyan";
  const safeFromInt = INTENSITIES.includes(fromIntensity as any) ? fromIntensity : 500;
  const safeToInt = INTENSITIES.includes(toIntensity as any) ? toIntensity : 400;

  const update = (part: "fromColor" | "fromIntensity" | "toColor" | "toIntensity", val: string | number) => {
    const next = {
      fromColor: safeFromColor,
      fromIntensity: safeFromInt,
      toColor: safeToColor,
      toIntensity: safeToInt,
      [part]: typeof val === "number" ? val : val,
    };
    onChange(
      buildGradient(
        next.fromColor,
        next.fromIntensity,
        next.toColor,
        next.toIntensity
      )
    );
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Cor inicial (from)</Label>
          <div className="flex gap-2">
            <Select
              value={safeFromColor}
              onValueChange={(v) => update("fromColor", v)}
            >
              <SelectTrigger id={id}>
                <SelectValue placeholder="Cor" />
              </SelectTrigger>
              <SelectContent>
                {TAILWIND_COLORS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(safeFromInt)}
              onValueChange={(v) => update("fromIntensity", Number(v))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Int." />
              </SelectTrigger>
              <SelectContent>
                {INTENSITIES.map((i) => (
                  <SelectItem key={i} value={String(i)}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Cor final (to)</Label>
          <div className="flex gap-2">
            <Select value={safeToColor} onValueChange={(v) => update("toColor", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Cor" />
              </SelectTrigger>
              <SelectContent>
                {TAILWIND_COLORS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(safeToInt)}
              onValueChange={(v) => update("toIntensity", Number(v))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Int." />
              </SelectTrigger>
              <SelectContent>
                {INTENSITIES.map((i) => (
                  <SelectItem key={i} value={String(i)}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="flex items-center gap-3">
        <Label className="text-xs text-gray-500 shrink-0">Preview:</Label>
        <div
          className="h-10 flex-1 rounded-lg border border-gray-200"
          style={{
            background: `linear-gradient(to right, ${getHex(safeFromColor, safeFromInt)}, ${getHex(safeToColor, safeToInt)})`,
          }}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
