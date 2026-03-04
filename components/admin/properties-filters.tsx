"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface PropertiesFiltersProps {
  destinations: Array<{ id: string; name: string }>;
}

export function PropertiesFilters({ destinations }: PropertiesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [destinoId, setDestinoId] = useState(searchParams.get("destinoId") || "all");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [published, setPublished] = useState(searchParams.get("published") || "all");
  
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (search) params.set("search", search);
    if (destinoId !== "all") params.set("destinoId", destinoId);
    if (status !== "all") params.set("status", status);
    if (published !== "all") params.set("published", published);
    
    const queryString = params.toString();
    router.push(`/admin/casas${queryString ? `?${queryString}` : ""}`);
  };
  
  const clearFilters = () => {
    setSearch("");
    setDestinoId("all");
    setStatus("all");
    setPublished("all");
    router.push("/admin/casas");
  };
  
  const hasActiveFilters = search || destinoId !== "all" || status !== "all" || published !== "all";
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nome, cidade..."
              className="pl-9"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applyFilters();
                }
              }}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="destinoId">Destino</Label>
          <Select value={destinoId} onValueChange={setDestinoId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os destinos</SelectItem>
              {destinations.map((dest) => (
                <SelectItem key={dest.id} value={dest.id}>
                  {dest.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="DISPONIVEL">Disponível</SelectItem>
              <SelectItem value="ULTIMAS_COTAS">Últimas Cotas</SelectItem>
              <SelectItem value="PRE_LANCAMENTO">Pré-lançamento</SelectItem>
              <SelectItem value="VENDIDO">Vendido</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="published">Publicação</Label>
          <Select value={published} onValueChange={setPublished}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="true">Publicadas</SelectItem>
              <SelectItem value="false">Não publicadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={applyFilters} className="bg-vivant-navy hover:bg-vivant-navy/90">
          <Search className="w-4 h-4 mr-2" />
          Aplicar Filtros
        </Button>
        
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Limpar Filtros
          </Button>
        )}
      </div>
    </div>
  );
}
