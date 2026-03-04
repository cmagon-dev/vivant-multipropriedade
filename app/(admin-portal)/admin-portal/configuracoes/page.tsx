"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  DollarSign, 
  Bell, 
  Users, 
  Settings, 
  FileText, 
  Mail,
  Save,
  Shield,
  Clock,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

export default function ConfiguracoesPage() {
  const [saving, setSaving] = useState(false);

  // Estado para as configurações
  const [config, setConfig] = useState({
    // Calendário
    diasMinimoAntecedenciaReserva: 30,
    diasMaximoAntecedenciaReserva: 365,
    permitirReservasSimultaneas: false,
    horaCheckin: "14:00",
    horaCheckout: "11:00",
    
    // Financeiro
    diaVencimentoCobrancas: 10,
    multaAtraso: 2,
    jurosAtraso: 0.033,
    enviarBoletoEmail: true,
    diasAntesVencimentoLembrete: 5,
    
    // Notificações
    notificarNovaReserva: true,
    notificarCheckoutPendente: true,
    notificarPagamentoPendente: true,
    notificarNovaAssembleia: true,
    notificarNovaMensagem: true,
    
    // Trocas de Semanas
    permitirTrocasEntreCotistas: true,
    diasMinimoAntecedenciaTroca: 15,
    taxaTroca: 0,
    aprovarTrocasManualmente: true,
    
    // Assembleias
    quorumMinimo: 50,
    diasNotificacaoAssembleia: 15,
    permitirVotacaoOnline: true,
    
    // Geral
    permitirCadastroConvidados: true,
    limiteConvidadosPorReserva: 4,
    enviarEmailBoasVindas: true,
    exigirAceiteTermo: true,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simular salvamento (você implementará a API depois)
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy flex items-center gap-3">
            <Settings className="w-8 h-8 text-vivant-green" />
            Configurações do Portal
          </h1>
          <p className="text-gray-500 mt-1">
            Gerencie todos os parâmetros e configurações do portal de cotistas
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-vivant-green hover:bg-vivant-green/90"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      {/* Tabs de Configurações */}
      <Tabs defaultValue="calendario" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2">
          <TabsTrigger value="calendario">
            <Calendar className="w-4 h-4 mr-2" />
            Calendário
          </TabsTrigger>
          <TabsTrigger value="financeiro">
            <DollarSign className="w-4 h-4 mr-2" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="notificacoes">
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="trocas">
            <RefreshCw className="w-4 h-4 mr-2" />
            Trocas
          </TabsTrigger>
          <TabsTrigger value="assembleias">
            <Users className="w-4 h-4 mr-2" />
            Assembleias
          </TabsTrigger>
          <TabsTrigger value="geral">
            <Shield className="w-4 h-4 mr-2" />
            Geral
          </TabsTrigger>
        </TabsList>

        {/* Tab: Calendário */}
        <TabsContent value="calendario" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros do Calendário de Uso</CardTitle>
              <CardDescription>
                Configure as regras de reservas e uso das propriedades
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="diasMinimoAntecedencia">
                    Antecedência Mínima (dias)
                  </Label>
                  <Input
                    id="diasMinimoAntecedencia"
                    type="number"
                    value={config.diasMinimoAntecedenciaReserva}
                    onChange={(e) => setConfig({...config, diasMinimoAntecedenciaReserva: parseInt(e.target.value)})}
                  />
                  <p className="text-xs text-gray-500">
                    Quantos dias antes o cotista precisa reservar
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diasMaximoAntecedencia">
                    Antecedência Máxima (dias)
                  </Label>
                  <Input
                    id="diasMaximoAntecedencia"
                    type="number"
                    value={config.diasMaximoAntecedenciaReserva}
                    onChange={(e) => setConfig({...config, diasMaximoAntecedenciaReserva: parseInt(e.target.value)})}
                  />
                  <p className="text-xs text-gray-500">
                    Até quantos dias antes o cotista pode reservar
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horaCheckin">
                    Horário de Check-in
                  </Label>
                  <Input
                    id="horaCheckin"
                    type="time"
                    value={config.horaCheckin}
                    onChange={(e) => setConfig({...config, horaCheckin: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horaCheckout">
                    Horário de Check-out
                  </Label>
                  <Input
                    id="horaCheckout"
                    type="time"
                    value={config.horaCheckout}
                    onChange={(e) => setConfig({...config, horaCheckout: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                  <Label>Permitir Reservas Simultâneas</Label>
                  <p className="text-xs text-gray-500">
                    Permitir que um cotista faça múltiplas reservas ao mesmo tempo
                  </p>
                </div>
                <Switch
                  checked={config.permitirReservasSimultaneas}
                  onCheckedChange={(checked) => setConfig({...config, permitirReservasSimultaneas: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Financeiro */}
        <TabsContent value="financeiro" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Financeiras</CardTitle>
              <CardDescription>
                Gerencie cobranças, boletos e parâmetros financeiros
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="diaVencimento">
                    Dia de Vencimento das Cobranças
                  </Label>
                  <Input
                    id="diaVencimento"
                    type="number"
                    min="1"
                    max="28"
                    value={config.diaVencimentoCobrancas}
                    onChange={(e) => setConfig({...config, diaVencimentoCobrancas: parseInt(e.target.value)})}
                  />
                  <p className="text-xs text-gray-500">
                    Dia do mês para vencimento dos boletos
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="multaAtraso">
                    Multa por Atraso (%)
                  </Label>
                  <Input
                    id="multaAtraso"
                    type="number"
                    step="0.01"
                    value={config.multaAtraso}
                    onChange={(e) => setConfig({...config, multaAtraso: parseFloat(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jurosAtraso">
                    Juros por Atraso (% ao dia)
                  </Label>
                  <Input
                    id="jurosAtraso"
                    type="number"
                    step="0.001"
                    value={config.jurosAtraso}
                    onChange={(e) => setConfig({...config, jurosAtraso: parseFloat(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diasLembrete">
                    Lembrete antes do Vencimento (dias)
                  </Label>
                  <Input
                    id="diasLembrete"
                    type="number"
                    value={config.diasAntesVencimentoLembrete}
                    onChange={(e) => setConfig({...config, diasAntesVencimentoLembrete: parseInt(e.target.value)})}
                  />
                  <p className="text-xs text-gray-500">
                    Enviar lembrete X dias antes do vencimento
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                  <Label>Enviar Boleto por E-mail Automaticamente</Label>
                  <p className="text-xs text-gray-500">
                    Enviar boleto assim que a cobrança for gerada
                  </p>
                </div>
                <Switch
                  checked={config.enviarBoletoEmail}
                  onCheckedChange={(checked) => setConfig({...config, enviarBoletoEmail: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Notificações */}
        <TabsContent value="notificacoes" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificações</CardTitle>
              <CardDescription>
                Configure quando e como os cotistas serão notificados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'notificarNovaReserva', label: 'Nova Reserva Confirmada', desc: 'Avisar quando uma reserva for confirmada' },
                { key: 'notificarCheckoutPendente', label: 'Checkout Pendente', desc: 'Lembrar o cotista de fazer checkout' },
                { key: 'notificarPagamentoPendente', label: 'Pagamento Pendente', desc: 'Avisar sobre cobranças não pagas' },
                { key: 'notificarNovaAssembleia', label: 'Nova Assembleia', desc: 'Notificar sobre convocação de assembleia' },
                { key: 'notificarNovaMensagem', label: 'Nova Mensagem/Aviso', desc: 'Avisar sobre novas mensagens no mural' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-0.5">
                    <Label>{item.label}</Label>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <Switch
                    checked={config[item.key as keyof typeof config] as boolean}
                    onCheckedChange={(checked) => setConfig({...config, [item.key]: checked})}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Trocas */}
        <TabsContent value="trocas" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Troca de Semanas</CardTitle>
              <CardDescription>
                Configure como funcionam as trocas entre cotistas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                  <Label>Permitir Trocas Entre Cotistas</Label>
                  <p className="text-xs text-gray-500">
                    Habilitar sistema de troca de semanas
                  </p>
                </div>
                <Switch
                  checked={config.permitirTrocasEntreCotistas}
                  onCheckedChange={(checked) => setConfig({...config, permitirTrocasEntreCotistas: checked})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="diasAntecedenciaTroca">
                    Antecedência Mínima para Troca (dias)
                  </Label>
                  <Input
                    id="diasAntecedenciaTroca"
                    type="number"
                    value={config.diasMinimoAntecedenciaTroca}
                    onChange={(e) => setConfig({...config, diasMinimoAntecedenciaTroca: parseInt(e.target.value)})}
                    disabled={!config.permitirTrocasEntreCotistas}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxaTroca">
                    Taxa de Troca (R$)
                  </Label>
                  <Input
                    id="taxaTroca"
                    type="number"
                    step="0.01"
                    value={config.taxaTroca}
                    onChange={(e) => setConfig({...config, taxaTroca: parseFloat(e.target.value)})}
                    disabled={!config.permitirTrocasEntreCotistas}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                  <Label>Aprovar Trocas Manualmente</Label>
                  <p className="text-xs text-gray-500">
                    Admin deve aprovar cada troca antes de confirmar
                  </p>
                </div>
                <Switch
                  checked={config.aprovarTrocasManualmente}
                  onCheckedChange={(checked) => setConfig({...config, aprovarTrocasManualmente: checked})}
                  disabled={!config.permitirTrocasEntreCotistas}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Assembleias */}
        <TabsContent value="assembleias" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Assembleias</CardTitle>
              <CardDescription>
                Defina regras para assembleias e votações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="quorumMinimo">
                    Quorum Mínimo (%)
                  </Label>
                  <Input
                    id="quorumMinimo"
                    type="number"
                    min="1"
                    max="100"
                    value={config.quorumMinimo}
                    onChange={(e) => setConfig({...config, quorumMinimo: parseInt(e.target.value)})}
                  />
                  <p className="text-xs text-gray-500">
                    Percentual mínimo de cotistas presentes
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diasNotificacao">
                    Notificação Prévia (dias)
                  </Label>
                  <Input
                    id="diasNotificacao"
                    type="number"
                    value={config.diasNotificacaoAssembleia}
                    onChange={(e) => setConfig({...config, diasNotificacaoAssembleia: parseInt(e.target.value)})}
                  />
                  <p className="text-xs text-gray-500">
                    Avisar cotistas X dias antes da assembleia
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                  <Label>Permitir Votação Online</Label>
                  <p className="text-xs text-gray-500">
                    Cotistas podem votar pelo portal sem estar presentes
                  </p>
                </div>
                <Switch
                  checked={config.permitirVotacaoOnline}
                  onCheckedChange={(checked) => setConfig({...config, permitirVotacaoOnline: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Geral */}
        <TabsContent value="geral" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Outras configurações do portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="limiteConvidados">
                    Limite de Convidados por Reserva
                  </Label>
                  <Input
                    id="limiteConvidados"
                    type="number"
                    min="0"
                    value={config.limiteConvidadosPorReserva}
                    onChange={(e) => setConfig({...config, limiteConvidadosPorReserva: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'permitirCadastroConvidados', label: 'Permitir Cadastro de Convidados', desc: 'Cotistas podem cadastrar convidados para usar a propriedade' },
                  { key: 'enviarEmailBoasVindas', label: 'Enviar E-mail de Boas-vindas', desc: 'Enviar e-mail ao aceitar convite' },
                  { key: 'exigirAceiteTermo', label: 'Exigir Aceite do Termo de Uso', desc: 'Cotista deve aceitar termos ao criar conta' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-0.5">
                      <Label>{item.label}</Label>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <Switch
                      checked={config[item.key as keyof typeof config] as boolean}
                      onCheckedChange={(checked) => setConfig({...config, [item.key]: checked})}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botão de Salvar Fixo no Final */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-vivant-green hover:bg-vivant-green/90"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Salvando..." : "Salvar Todas as Configurações"}
        </Button>
      </div>
    </div>
  );
}
