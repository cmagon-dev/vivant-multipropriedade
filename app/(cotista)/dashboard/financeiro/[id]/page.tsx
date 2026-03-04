"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Download, 
  Upload, 
  Loader2,
  CheckCircle2,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import Link from "next/link";
import { ChargeCard } from "@/components/cotista/financeiro/charge-card";

export default function ChargeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [charge, setCharge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [comprovante, setComprovante] = useState<File | null>(null);
  const [filtro, setFiltro] = useState<string | null>(null);
  const [todasCobrancas, setTodasCobrancas] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [chargeRes, cobrancasRes] = await Promise.all([
          fetch(`/api/cotistas/cobrancas/${params.id}`),
          fetch(`/api/cotistas/me/cobrancas`)
        ]);
        
        if (chargeRes.ok) {
          const data = await chargeRes.json();
          setCharge(data.cobranca);
        }
        
        if (cobrancasRes.ok) {
          const data = await cobrancasRes.json();
          setTodasCobrancas(data.cobrancas || []);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params.id]);

  const handleUploadComprovante = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comprovante) {
      toast.error("Selecione um arquivo");
      return;
    }

    setUploading(true);
    
    const formData = new FormData();
    formData.append("file", comprovante);

    try {
      const response = await fetch(`/api/cotistas/cobrancas/${params.id}/comprovante`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Comprovante enviado com sucesso!");
        router.push("/dashboard/financeiro");
      } else {
        toast.error("Erro ao enviar comprovante");
      }
    } catch (error) {
      toast.error("Erro ao enviar comprovante");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-vivant-green animate-spin" />
      </div>
    );
  }

  if (!charge) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-[#1A2F4B]/60">Cobrança não encontrada</p>
        </CardContent>
      </Card>
    );
  }

  const tipoLabels: Record<string, string> = {
    CONDOMINIO: "Condomínio",
    LIMPEZA: "Limpeza",
    MANUTENCAO: "Manutenção",
    SEGURO: "Seguro",
    IPTU: "IPTU",
    TAXA_GESTAO: "Taxa de Gestão",
    OUTROS: "Outros"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/financeiro">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1A2F4B]">
            Detalhes da Cobrança
          </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-serif text-[#1A2F4B]">
              Informações da Cobrança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-[#1A2F4B]/60 text-xs">Tipo</Label>
              <p className="text-lg font-semibold text-[#1A2F4B]">
                {tipoLabels[charge.tipo] || charge.tipo}
              </p>
            </div>

            <div>
              <Label className="text-[#1A2F4B]/60 text-xs">Descrição</Label>
              <p className="text-base text-[#1A2F4B]">{charge.descricao}</p>
            </div>

            <div>
              <Label className="text-[#1A2F4B]/60 text-xs">Propriedade</Label>
              <p className="text-base text-[#1A2F4B]">{charge.property.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[#1A2F4B]/60 text-xs">Valor</Label>
                <p className="text-2xl font-bold text-[#1A2F4B]">
                  R$ {charge.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div>
                <Label className="text-[#1A2F4B]/60 text-xs">Status</Label>
                <p className={`text-base font-semibold ${
                  charge.status === "PAGA" ? "text-vivant-green" :
                  charge.status === "VENCIDA" ? "text-red-600" :
                  "text-orange-600"
                }`}>
                  {charge.status}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-[#1A2F4B]/60 text-xs">Vencimento</Label>
              <p className="text-base text-[#1A2F4B]">
                {format(new Date(charge.dataVencimento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>

            {charge.dataPagamento && (
              <div>
                <Label className="text-[#1A2F4B]/60 text-xs">Data do Pagamento</Label>
                <p className="text-base text-vivant-green font-medium">
                  {format(new Date(charge.dataPagamento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
            )}

            {charge.urlBoleto && charge.status !== "PAGA" && (
              <Button asChild className="w-full bg-vivant-green hover:bg-vivant-green/90">
                <a href={charge.urlBoleto} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Boleto
                </a>
              </Button>
            )}
          </CardContent>
        </Card>

        {charge.status !== "PAGA" && (
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                Enviar Comprovante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUploadComprovante} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="comprovante" className="text-[#1A2F4B]">
                    Arquivo do Comprovante
                  </Label>
                  <Input
                    id="comprovante"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setComprovante(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                    disabled={uploading}
                  />
                  <p className="text-xs text-[#1A2F4B]/60">
                    Formatos aceitos: PDF, JPG, PNG (máx. 5MB)
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Após enviar
                      </p>
                      <p className="text-xs text-blue-800">
                        Nossa equipe financeira irá validar o comprovante em até 2 dias úteis.
                        Você receberá uma notificação quando o pagamento for confirmado.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-vivant-green hover:bg-vivant-green/90"
                  disabled={!comprovante || uploading}
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Enviar Comprovante
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {charge.status === "PAGA" && charge.urlComprovante && (
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-[#1A2F4B] flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-vivant-green" />
                Pagamento Confirmado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-vivant-green/10 border-2 border-vivant-green/30 rounded-lg mb-4">
                <p className="text-sm text-[#1A2F4B]">
                  Seu pagamento foi confirmado pela equipe Vivant Care.
                </p>
              </div>

              <Button asChild variant="outline" className="w-full">
                <a href={charge.urlComprovante} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Ver Comprovante
                </a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <h3 className="font-semibold text-[#1A2F4B] mb-4">Todas as Cobranças</h3>
          
          <div className="flex gap-2 mb-6">
            <Button
              size="sm"
              variant={filtro === null ? "default" : "outline"}
              onClick={() => setFiltro(null)}
            >
              Todas
            </Button>
            <Button
              size="sm"
              variant={filtro === "PENDENTE" ? "default" : "outline"}
              onClick={() => setFiltro("PENDENTE")}
            >
              Pendentes
            </Button>
            <Button
              size="sm"
              variant={filtro === "VENCIDA" ? "default" : "outline"}
              onClick={() => setFiltro("VENCIDA")}
            >
              Vencidas
            </Button>
            <Button
              size="sm"
              variant={filtro === "PAGA" ? "default" : "outline"}
              onClick={() => setFiltro("PAGA")}
            >
              Pagas
            </Button>
          </div>

          {(() => {
            const cobrancasFiltradas = filtro 
              ? todasCobrancas.filter((c) => c.status === filtro)
              : todasCobrancas;
            
            return cobrancasFiltradas.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#1A2F4B]/60 text-sm">
                  Nenhuma cobrança encontrada
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cobrancasFiltradas.map((c) => (
                  <ChargeCard key={c.id} charge={c} />
                ))}
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
