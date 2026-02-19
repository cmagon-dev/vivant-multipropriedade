"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

interface DestinationFeaturesInputProps {
  value: Feature[];
  onChange: (features: Feature[]) => void;
}

export function DestinationFeaturesInput({ value, onChange }: DestinationFeaturesInputProps) {
  const [newFeature, setNewFeature] = useState<Feature>({
    icon: "",
    title: "",
    desc: "",
  });
  
  const addFeature = () => {
    if (newFeature.icon.trim() && newFeature.title.trim() && newFeature.desc.trim()) {
      if (value.length >= 4) {
        alert("Máximo de 4 features permitidas");
        return;
      }
      onChange([...value, newFeature]);
      setNewFeature({ icon: "", title: "", desc: "" });
    }
  };
  
  const removeFeature = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };
  
  return (
    <div className="space-y-4">
      {/* Lista atual */}
      {value.length > 0 && (
        <div className="space-y-3">
          {value.map((feature, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl">{feature.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{feature.title}</div>
                    <div className="text-sm text-gray-600">{feature.desc}</div>
                  </div>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeFeature(index)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Input para novo (se ainda não tiver 4) */}
      {value.length < 4 && (
        <div className="p-4 bg-gray-50 rounded border-2 border-dashed border-gray-300 space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Adicionar Feature ({value.length}/4)
          </p>
          
          <div className="grid gap-3">
            <div>
              <Label htmlFor="icon">Emoji</Label>
              <Input
                id="icon"
                value={newFeature.icon}
                onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
                placeholder="🚤"
                maxLength={2}
              />
            </div>
            
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newFeature.title}
                onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                placeholder="Esportes Náuticos"
              />
            </div>
            
            <div>
              <Label htmlFor="desc">Descrição</Label>
              <Input
                id="desc"
                value={newFeature.desc}
                onChange={(e) => setNewFeature({ ...newFeature, desc: e.target.value })}
                placeholder="Jet-ski, lancha e wakeboard"
              />
            </div>
            
            <Button
              type="button"
              onClick={addFeature}
              disabled={!newFeature.icon.trim() || !newFeature.title.trim() || !newFeature.desc.trim()}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Feature
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
