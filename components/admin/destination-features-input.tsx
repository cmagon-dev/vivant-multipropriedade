"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Plus, Edit2, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  
  const addFeature = () => {
    if (newFeature.icon.trim() && newFeature.title.trim() && newFeature.desc.trim()) {
      if (value.length >= 4) {
        alert("Máximo de 4 destaques permitidos");
        return;
      }
      onChange([...value, newFeature]);
      setNewFeature({ icon: "", title: "", desc: "" });
    }
  };
  
  const removeFeature = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingFeature({ ...value[index] });
  };

  const saveEdit = () => {
    if (editingIndex !== null && editingFeature) {
      const newFeatures = [...value];
      newFeatures[editingIndex] = editingFeature;
      onChange(newFeatures);
      setEditingIndex(null);
      setEditingFeature(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingFeature(null);
  };
  
  return (
    <div className="space-y-4">
      {/* Lista atual */}
      {value.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {value.map((feature, index) => (
            <Card key={index} className="border-2 border-gray-200 hover:border-vivant-gold transition-colors">
              <CardContent className="p-4">
                {editingIndex === index && editingFeature ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Emoji</Label>
                      <Input
                        value={editingFeature.icon}
                        onChange={(e) => setEditingFeature({ ...editingFeature, icon: e.target.value })}
                        placeholder="🚤"
                        maxLength={2}
                        className="text-2xl h-12"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Título</Label>
                      <Input
                        value={editingFeature.title}
                        onChange={(e) => setEditingFeature({ ...editingFeature, title: e.target.value })}
                        placeholder="Título do destaque"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Descrição</Label>
                      <Textarea
                        value={editingFeature.desc}
                        onChange={(e) => setEditingFeature({ ...editingFeature, desc: e.target.value })}
                        placeholder="Descrição detalhada"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={saveEdit}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Salvar
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-3xl">{feature.icon}</div>
                        <div className="flex-1">
                          <div className="font-bold text-vivant-navy mb-1">{feature.title}</div>
                          <div className="text-sm text-gray-600 leading-relaxed">{feature.desc}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(index)}
                        className="flex-1"
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeFeature(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Input para novo (se ainda não tiver 4) */}
      {value.length < 4 && (
        <Card className="border-2 border-dashed border-vivant-gold/50 bg-amber-50/30">
          <CardContent className="p-4 space-y-3">
            <p className="text-sm font-semibold text-vivant-navy flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Destaque ({value.length}/4)
            </p>
            
            <div className="grid gap-3">
              <div>
                <Label htmlFor="new-icon" className="text-xs">Emoji</Label>
                <Input
                  id="new-icon"
                  value={newFeature.icon}
                  onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
                  placeholder="🚤"
                  maxLength={2}
                  className="text-2xl h-12"
                />
              </div>
              
              <div>
                <Label htmlFor="new-title" className="text-xs">Título</Label>
                <Input
                  id="new-title"
                  value={newFeature.title}
                  onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                  placeholder="Esportes Náuticos"
                />
              </div>
              
              <div>
                <Label htmlFor="new-desc" className="text-xs">Descrição</Label>
                <Textarea
                  id="new-desc"
                  value={newFeature.desc}
                  onChange={(e) => setNewFeature({ ...newFeature, desc: e.target.value })}
                  placeholder="Jet-ski, lancha e wakeboard disponíveis"
                  rows={2}
                />
              </div>
              
              <Button
                type="button"
                onClick={addFeature}
                disabled={!newFeature.icon.trim() || !newFeature.title.trim() || !newFeature.desc.trim()}
                className="w-full bg-vivant-navy hover:bg-vivant-navy/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Destaque
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {value.length === 0 && (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-3">
          ⚠️ É obrigatório adicionar exatamente 4 destaques para o destino.
        </p>
      )}
    </div>
  );
}
