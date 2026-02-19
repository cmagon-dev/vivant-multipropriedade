"use client";

import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateSlug } from "@/lib/utils/slug";

interface SlugInputProps {
  nameValue: string;
  value: string;
  onChange: (slug: string) => void;
  error?: string;
  urlPrefix?: string;
}

export function SlugInput({ nameValue, value, onChange, error, urlPrefix = "/casas/" }: SlugInputProps) {
  useEffect(() => {
    if (nameValue && !value) {
      onChange(generateSlug(nameValue));
    }
  }, [nameValue, value, onChange]);
  
  return (
    <div>
      <Label>Slug (URL amigável)</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="casa-porto-rico-marina"
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      <p className="text-xs text-gray-500 mt-1">
        URL final: {urlPrefix}{value || "slug-aqui"}
      </p>
    </div>
  );
}
