"use client";

import { useState, useEffect } from "react";
import { Home, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Property {
  id: string;
  name: string;
  location: string;
  numeroCota: string;
}

export function PropertySelector() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      try {
        const response = await fetch("/api/cotistas/me/cotas");
        if (response.ok) {
          const data = await response.json();
          setProperties(data.cotas || []);
          if (data.cotas && data.cotas.length > 0) {
            const saved = localStorage.getItem("selectedPropertyId");
            const selected = data.cotas.find((p: Property) => p.id === saved) || data.cotas[0];
            setSelectedProperty(selected);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar propriedades:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, []);

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    localStorage.setItem("selectedPropertyId", property.id);
    window.dispatchEvent(new CustomEvent("propertyChanged", { detail: property }));
  };

  if (loading || !selectedProperty) {
    return (
      <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg animate-pulse">
        <Home className="w-4 h-4 text-slate-400" />
        <div className="h-4 w-32 bg-slate-200 rounded" />
      </div>
    );
  }

  if (properties.length === 1) {
    return (
      <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-vivant-green/5 rounded-lg border border-vivant-green/20">
        <Home className="w-4 h-4 text-vivant-green" />
        <div className="text-sm">
          <p className="font-medium text-[#1A2F4B]">{selectedProperty.name}</p>
          <p className="text-xs text-[#1A2F4B]/60">{selectedProperty.numeroCota}</p>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="hidden sm:flex items-center gap-2 border-vivant-green/30 hover:border-vivant-green hover:bg-vivant-green/5"
        >
          <Home className="w-4 h-4 text-vivant-green" />
          <div className="text-left">
            <p className="text-sm font-medium text-[#1A2F4B]">{selectedProperty.name}</p>
            <p className="text-xs text-[#1A2F4B]/60">{selectedProperty.numeroCota}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-[#1A2F4B]/60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Minhas Propriedades</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {properties.map((property) => (
          <DropdownMenuItem
            key={property.id}
            onClick={() => handleSelectProperty(property)}
            className={`flex items-start gap-3 p-3 cursor-pointer ${
              property.id === selectedProperty.id ? "bg-vivant-green/10" : ""
            }`}
          >
            <Home className="w-4 h-4 text-vivant-green mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm text-[#1A2F4B]">{property.name}</p>
              <p className="text-xs text-[#1A2F4B]/60">{property.location}</p>
              <p className="text-xs text-vivant-green mt-0.5">{property.numeroCota}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
