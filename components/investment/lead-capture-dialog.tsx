"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserCircle, Mail, Phone, Lock } from "lucide-react";

const leadCaptureSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  telefone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .regex(/^[0-9()\s-]+$/, "Telefone inválido"),
});

type LeadCaptureFormData = z.infer<typeof leadCaptureSchema>;

interface LeadCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadCaptured: (data: LeadCaptureFormData) => void;
}

export function LeadCaptureDialog({
  open,
  onOpenChange,
  onLeadCaptured,
}: LeadCaptureDialogProps): JSX.Element {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadCaptureFormData>({
    resolver: zodResolver(leadCaptureSchema),
  });

  const onSubmit = async (data: LeadCaptureFormData) => {
    setIsSubmitting(true);
    
    // Simula um pequeno delay para melhor UX
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Aqui você pode adicionar lógica para salvar o lead no banco de dados
    console.log("Lead capturado:", data);
    
    onLeadCaptured(data);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-[#1A2F4B] flex items-center gap-2">
            <Lock className="w-6 h-6 text-vivant-gold" />
            Análise Completa de Investimento
          </DialogTitle>
          <DialogDescription className="text-base text-[#1A2F4B]/70 pt-2">
            Para ter acesso aos resultados detalhados da análise, precisamos de
            algumas informações para contato.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label
              htmlFor="nome"
              className="text-sm font-semibold text-[#1A2F4B] flex items-center gap-2"
            >
              <UserCircle className="w-4 h-4" />
              Nome Completo
            </Label>
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              {...register("nome")}
              className={`h-11 ${
                errors.nome
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#1A2F4B]/30 focus:border-[#1A2F4B]"
              }`}
            />
            {errors.nome && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                ⚠ {errors.nome.message}
              </p>
            )}
          </div>

          {/* E-mail */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-[#1A2F4B] flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
              className={`h-11 ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#1A2F4B]/30 focus:border-[#1A2F4B]"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                ⚠ {errors.email.message}
              </p>
            )}
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label
              htmlFor="telefone"
              className="text-sm font-semibold text-[#1A2F4B] flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Telefone / WhatsApp
            </Label>
            <Input
              id="telefone"
              type="tel"
              placeholder="(00) 00000-0000"
              {...register("telefone")}
              className={`h-11 ${
                errors.telefone
                  ? "border-red-500 focus:border-red-500"
                  : "border-[#1A2F4B]/30 focus:border-[#1A2F4B]"
              }`}
            />
            {errors.telefone && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                ⚠ {errors.telefone.message}
              </p>
            )}
          </div>

          {/* Info sobre privacidade */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              🔒 <strong>Seus dados estão seguros.</strong> Utilizaremos essas
              informações apenas para enviar a análise completa e entrar em
              contato caso tenha interesse em saber mais sobre as oportunidades
              de investimento.
            </p>
          </div>

          {/* Botão */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base font-semibold bg-vivant-green hover:bg-vivant-green/90 transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processando...
              </span>
            ) : (
              "Liberar Análise Completa"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
