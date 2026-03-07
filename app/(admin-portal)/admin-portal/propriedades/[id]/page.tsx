"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Home, 
  Users, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit,
  ArrowLeft,
  UserPlus,
  MapPin,
  Settings
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfigurarSemanasDialog } from "@/components/admin-portal/configurar-semanas-dialog";

interface Propriedade {
  id: string;
  name: string;
  destino?: { name: string };
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  totalCotas?: number;
  cotas: Array<{
    id: string;
    numeroCota: string;
    percentualCota: number;
    semanasAno: number;
    semanasConfig: any;
    ativo: boolean;
    cotista: {
      id: string;
      name: string;
      email: string;
    };
  }>;
}

interface Cotista {
  id: string;
  name: string;
  email: string;
}

export default function PropriedadeDetalhesPage({ params }: { params: { id: string } }) {
  const [propriedade, setPropriedade] = useState<Propriedade | null>(null);
  const [cotistas, setCotistas] = useState<Cotista[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNovaCota, setShowNovaCota] = useState(false);
  const [cotaParaConfigurar, setCotaParaConfigurar] = useState<any>(null);
  
  // Form para nova cota
  const [novaCota, setNovaCota] = useState({
    cotistaId: "",
    numeroCota: "",
    percentualCota: 0,
    semanasAno: 0,
  });

  useEffect(() => {
    carregarPropriedade();
    carregarCotistas();
  }, [params.id]);

  const carregarPropriedade = async () => {
    try {
      const response = await fetch(`/api/admin/propriedades/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setPropriedade(data);
      }
    } catch (error) {
      toast.error("Erro ao carregar propriedade");
    } finally {
      setLoading(false);
    }
  };

  const carregarCotistas = async () => {
    try {
      const response = await fetch("/api/admin/cotistas");
      if (response.ok) {
        const data = await response.json();
        setCotistas(data.cotistas || []);
      }
    } catch (error) {
      console.error("Erro ao carregar cotistas:", error);
    }
  };

  const handleCriarCota = async () => {
    if (!novaCota.cotistaId || !novaCota.numeroCota) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const response = await fetch(`/api/admin/propriedades/${params.id}/cotas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaCota),
      });

      if (response.ok) {
        toast.success("Cota criada com sucesso!");
        setShowNovaCota(false);
        setNovaCota({
          cotistaId: "",
          numeroCota: "",
          percentualCota: 0,
          semanasAno: 0,
        });
        carregarPropriedade();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao criar cota");
      }
    } catch (error) {
      toast.error("Erro ao criar cota");
    }
  };

  const handleRemoverCota = async (cotaId: string) => {
    if (!confirm("Tem certeza que deseja remover esta cota?")) return;

    try {
      const response = await fetch(`/api/admin/cotas/${cotaId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Cota removida com sucesso!");
        carregarPropriedade();
      } else {
        toast.error("Erro ao remover cota");
      }
    } catch (error) {
      toast.error("Erro ao remover cota");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-vivant-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!propriedade) {
    return (
      <div className="text-center py-12">
        <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Propriedade não encontrada</p>
        <Button asChild className="mt-4">
          <Link href="/admin-portal/propriedades">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </div>
    );
  }

  const cotasDisponiveis = (propriedade.totalCotas || 0) - propriedade.cotas.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin-portal/propriedades">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-vivant-navy">
              {propriedade.name}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{propriedade.destino?.name || 'Destino não definido'}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
          >
            <Link href={`/admin-portal/propriedades/${propriedade.id}/calendario`}>
              <Calendar className="w-4 h-4 mr-2" />
              Ver Calendário
            </Link>
          </Button>
          <Button
            asChild
            className="bg-vivant-green hover:bg-vivant-green/90"
          >
            <Link href={`/admin-portal/propriedades/${propriedade.id}/editar`}>
              <Edit className="w-4 h-4 mr-2" />
              Editar Propriedade
            </Link>
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Cotas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-vivant-navy">
              {propriedade.totalCotas || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cotas Alocadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-vivant-green">
              {propriedade.cotas.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cotas Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {cotasDisponiveis}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Capacidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {propriedade.maxGuests || 0}
            </div>
            <p className="text-xs text-gray-500">pessoas</p>
          </CardContent>
        </Card>
      </div>

      {/* Gerenciamento de Cotas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-vivant-green" />
              Cotas e Cotistas
            </CardTitle>
            <Dialog open={showNovaCota} onOpenChange={setShowNovaCota}>
              <DialogTrigger asChild>
                <Button className="bg-vivant-green hover:bg-vivant-green/90">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Alocar Nova Cota
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Alocar Nova Cota</DialogTitle>
                  <DialogDescription>
                    Vincule um cotista a uma cota desta propriedade
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Cotista *</Label>
                    <Select
                      value={novaCota.cotistaId}
                      onValueChange={(value) => setNovaCota({ ...novaCota, cotistaId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cotista" />
                      </SelectTrigger>
                      <SelectContent>
                        {cotistas.map((cotista) => (
                          <SelectItem key={cotista.id} value={cotista.id}>
                            {cotista.name} ({cotista.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Número da Cota *</Label>
                    <Input
                      placeholder="Ex: Cota 1 de 6"
                      value={novaCota.numeroCota}
                      onChange={(e) => setNovaCota({ ...novaCota, numeroCota: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Percentual (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="16.67"
                        value={novaCota.percentualCota}
                        onChange={(e) => setNovaCota({ ...novaCota, percentualCota: parseFloat(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Semanas/Ano</Label>
                      <Input
                        type="number"
                        placeholder="8"
                        value={novaCota.semanasAno}
                        onChange={(e) => setNovaCota({ ...novaCota, semanasAno: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleCriarCota}
                      className="flex-1 bg-vivant-green hover:bg-vivant-green/90"
                    >
                      Criar Cota
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowNovaCota(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {propriedade.cotas.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">Nenhuma cota alocada ainda</p>
              <p className="text-sm text-gray-500 mt-1">
                Clique em "Alocar Nova Cota" para começar
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {propriedade.cotas.map((cota) => (
                <div
                  key={cota.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-vivant-green/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-vivant-green" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-vivant-navy">
                        {cota.cotista.name}
                      </h4>
                      <p className="text-sm text-gray-600">{cota.cotista.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-vivant-navy">{cota.numeroCota}</p>
                      <p className="text-sm text-gray-600">
                        {cota.percentualCota}% • {cota.semanasAno} semanas/ano
                      </p>
                      {cota.semanasConfig?.weeks?.length > 0 && (
                        <p className="text-xs text-vivant-green mt-1">
                          {cota.semanasConfig.weeks.length} semanas configuradas
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCotaParaConfigurar(cota)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar Semanas
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoverCota(cota.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Configuração de Semanas */}
      {cotaParaConfigurar && (
        <ConfigurarSemanasDialog
          open={!!cotaParaConfigurar}
          onOpenChange={(open) => !open && setCotaParaConfigurar(null)}
          cota={cotaParaConfigurar}
          propriedadeId={params.id}
          onSuccess={carregarPropriedade}
        />
      )}
    </div>
  );
}
