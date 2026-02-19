"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface FeaturesInputProps {
  value: string[];
  onChange: (features: string[]) => void;
}

export function FeaturesInput({ value, onChange }: FeaturesInputProps) {
  const [newFeature, setNewFeature] = useState("");
  
  const addFeature = () => {
    if (newFeature.trim()) {
      onChange([...value, newFeature.trim()]);
      setNewFeature("");
    }
  };
  
  const removeFeature = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };
  
  return (
    <div className="space-y-3">
      {/* Lista atual */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 bg-gray-50 rounded border border-gray-200 text-sm">
                {feature}
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeFeature(index)}
                className="h-9 w-9"
              >
                <X className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input para novo */}
      <div className="flex gap-2">
        <Input
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="Ex: Marina privativa 12 vagas"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addFeature();
            }
          }}
        />
        <Button
          type="button"
          onClick={addFeature}
          disabled={!newFeature.trim()}
          size="icon"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
