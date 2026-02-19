"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  partnerLeadSchema,
  type PartnerLeadFormData,
} from "@/lib/validations/partner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Building2, Send, CheckCircle2 } from "lucide-react";

export function PartnerLeadForm(): JSX.Element {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [valorEstimado, setValorEstimado] = useState(1500000);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PartnerLeadFormData>({
    resolver: zodResolver(partnerLeadSchema),
    defaultValues: {
      valorEstimado: 1500000,
      aceitaContato: false,
    },
  });

  const handleValorChange = (values: number[]) => {
    const valor = values[0];
    setValorEstimado(valor);
    setValue("valorEstimado", valor);
  };

  const onSubmit = async (data: PartnerLeadFormData) => {
    console.log("Lead enviado:", data);
    
    // TODO: Integrar com API
    // await fetch("/api/leads/parceiros", {
    //   method: "POST",
    //   body: JSON.stringify(data),
    // });
    
    // Simula envio
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Card className="border-2 border-vivant-green shadow-xl max-w-2xl mx-auto">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-20 h-20 bg-vivant-green rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B] mb-4">
            Solicitação Enviada com Sucesso!
          </h3>
          <p className="text-lg text-[#1A2F4B]/70 mb-2">
            Nossa equipe entrará em contato em até <strong>48 horas</strong>.
          </p>
          <p className="text-sm text-[#1A2F4B]/60">
            Você receberá um e-mail de confirmação em breve.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-vivant-gold shadow-2xl max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-vivant-gold to-yellow-600 text-white py-6">
        <CardTitle className="text-2xl sm:text-3xl font-serif flex items-center gap-3">
          <Building2 className="w-7 h-7 sm:w-8 sm:h-8" />
          Avalie seu Imóvel Agora
        </CardTitle>
        <p className="text-white/90 text-sm sm:text-base mt-2">
          Preencha o formulário e receba uma proposta personalizada em até 48 horas
        </p>
      </CardHeader>
      
      <CardContent className="pt-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-base font-semibold text-vivant-navy">
              Nome Completo *
            </Label>
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              {...register("nome")}
              className={`h-12 text-base ${
                errors.nome ? "border-red-500" : "border-vivant-navy/30"
              }`}
            />
            {errors.nome && (
              <p className="text-sm text-red-600">{errors.nome.message}</p>
            )}
          </div>

          {/* Email e Telefone */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold text-vivant-navy">
                E-mail *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                className={`h-12 text-base ${
                  errors.email ? "border-red-500" : "border-vivant-navy/30"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-base font-semibold text-vivant-navy">
                Telefone (WhatsApp) *
              </Label>
              <Input
                id="telefone"
                type="tel"
                placeholder="11999999999"
                {...register("telefone")}
                className={`h-12 text-base ${
                  errors.telefone ? "border-red-500" : "border-vivant-navy/30"
                }`}
              />
              {errors.telefone && (
                <p className="text-sm text-red-600">{errors.telefone.message}</p>
              )}
            </div>
          </div>

          {/* Cidade e Estado */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="cidade" className="text-base font-semibold text-vivant-navy">
                Cidade do Imóvel *
              </Label>
              <Input
                id="cidade"
                type="text"
                placeholder="Ex: Porto Rico"
                {...register("cidade")}
                className={`h-12 text-base ${
                  errors.cidade ? "border-red-500" : "border-vivant-navy/30"
                }`}
              />
              {errors.cidade && (
                <p className="text-sm text-red-600">{errors.cidade.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado" className="text-base font-semibold text-vivant-navy">
                UF *
              </Label>
              <Input
                id="estado"
                type="text"
                placeholder="PR"
                maxLength={2}
                {...register("estado")}
                className={`h-12 text-base uppercase ${
                  errors.estado ? "border-red-500" : "border-vivant-navy/30"
                }`}
              />
              {errors.estado && (
                <p className="text-sm text-red-600">{errors.estado.message}</p>
              )}
            </div>
          </div>

          {/* Tipo de Imóvel */}
          <div className="space-y-2">
            <Label htmlFor="tipoImovel" className="text-base font-semibold text-vivant-navy">
              Tipo de Imóvel *
            </Label>
            <select
              id="tipoImovel"
              {...register("tipoImovel")}
              className={`w-full h-12 px-4 rounded-md border text-base bg-white ${
                errors.tipoImovel ? "border-red-500" : "border-vivant-navy/30"
              }`}
            >
              <option value="">Selecione...</option>
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="chacara">Chácara</option>
              <option value="outro">Outro</option>
            </select>
            {errors.tipoImovel && (
              <p className="text-sm text-red-600">{errors.tipoImovel.message}</p>
            )}
          </div>

          {/* Valor Estimado (Slider) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold text-vivant-navy">
                Valor Estimado do Imóvel *
              </Label>
              <span className="text-2xl font-bold text-vivant-gold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 0,
                }).format(valorEstimado)}
              </span>
            </div>
            
            <Slider
              min={500000}
              max={10000000}
              step={100000}
              value={[valorEstimado]}
              onValueChange={handleValorChange}
              className="py-4"
            />
            
            <div className="flex justify-between text-xs text-[#1A2F4B]/60">
              <span>R$ 500 mil</span>
              <span>R$ 10 milhões</span>
            </div>
            
            {errors.valorEstimado && (
              <p className="text-sm text-red-600">{errors.valorEstimado.message}</p>
            )}
          </div>

          {/* Descrição (Opcional) */}
          <div className="space-y-2">
            <Label htmlFor="descricaoImovel" className="text-base font-semibold text-vivant-navy">
              Descrição do Imóvel (Opcional)
            </Label>
            <textarea
              id="descricaoImovel"
              placeholder="Ex: Casa com 4 suítes, piscina, marina privativa..."
              {...register("descricaoImovel")}
              className={`w-full px-4 py-3 rounded-md border text-base min-h-[100px] resize-y ${
                errors.descricaoImovel ? "border-red-500" : "border-vivant-navy/30"
              }`}
              maxLength={500}
            />
            {errors.descricaoImovel && (
              <p className="text-sm text-red-600">{errors.descricaoImovel.message}</p>
            )}
          </div>

          {/* Aceita Contato */}
          <div className="flex items-start gap-3 bg-[#F8F9FA] p-4 rounded-lg border border-vivant-gold/30">
            <input
              type="checkbox"
              id="aceitaContato"
              {...register("aceitaContato")}
              className="mt-1 w-5 h-5 rounded border-vivant-navy/30 text-vivant-gold focus:ring-vivant-gold"
            />
            <Label htmlFor="aceitaContato" className="text-sm cursor-pointer">
              Autorizo a Vivant Partners a entrar em contato comigo por e-mail, telefone ou WhatsApp 
              para apresentar uma proposta personalizada de validação do meu imóvel. *
            </Label>
          </div>
          {errors.aceitaContato && (
            <p className="text-sm text-red-600">{errors.aceitaContato.message}</p>
          )}

          {/* Botão Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 text-lg font-semibold bg-vivant-gold hover:bg-vivant-gold/90 text-vivant-navy"
          >
            {isSubmitting ? (
              "Enviando..."
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Solicitar Avaliação Gratuita
              </>
            )}
          </Button>

          <p className="text-xs text-center text-[#1A2F4B]/60">
            Ao enviar, você concorda com nossos termos de privacidade
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
