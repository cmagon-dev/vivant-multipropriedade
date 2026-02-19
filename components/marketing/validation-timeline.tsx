"use client";

import { CheckCircle2, Clock, Rocket, FileCheck, Home } from "lucide-react";

interface TimelineStep {
  day: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export function ValidationTimeline(): JSX.Element {
  const steps: TimelineStep[] = [
    {
      day: "Dia 0",
      title: "Cadastro",
      description: "Proprietário cadastra imóvel no site",
      icon: <Home className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      day: "Dia 3",
      title: "Análise Vivant",
      description: "Avaliação e aprovação do imóvel",
      icon: <FileCheck className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
    },
    {
      day: "Dia 10",
      title: "Lançamento",
      description: "2 Founder Quotas no mercado",
      icon: <Rocket className="w-6 h-6" />,
      color: "from-vivant-gold to-yellow-600",
    },
    {
      day: "Dia 60",
      title: "Validação",
      description: "Checkpoint: Vendeu? Sim → SPE | Não → Sem custos",
      icon: <Clock className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600",
    },
    {
      day: "Dia 90",
      title: "Incorporação",
      description: "Escritura pública pronta (se validado)",
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: "from-vivant-green to-emerald-600",
    },
  ];

  return (
    <div className="w-full">
      {/* Desktop: Timeline Horizontal */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Linha conectora */}
          <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-vivant-gold/30 to-vivant-green/50 z-0" />
          
          <div className="grid grid-cols-5 gap-4 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                {/* Ícone */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} 
                                flex items-center justify-center text-white shadow-lg mb-4`}>
                  {step.icon}
                </div>
                
                {/* Dia */}
                <div className="text-sm font-bold text-[#1A2F4B] mb-2">
                  {step.day}
                </div>
                
                {/* Título */}
                <h4 className="font-bold text-[#1A2F4B] mb-2 text-sm lg:text-base">
                  {step.title}
                </h4>
                
                {/* Descrição */}
                <p className="text-xs lg:text-sm text-[#1A2F4B]/70 px-1">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Timeline Vertical */}
      <div className="md:hidden space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-4">
            {/* Linha vertical e ícone */}
            <div className="flex flex-col items-center">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.color} 
                              flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                {step.icon}
              </div>
              {index < steps.length - 1 && (
                <div className="w-1 flex-1 bg-gradient-to-b from-vivant-gold/30 to-vivant-green/20 mt-2" />
              )}
            </div>
            
            {/* Conteúdo */}
            <div className="flex-1 pb-6">
              <div className="text-xs font-bold text-[#1A2F4B]/60 mb-1">
                {step.day}
              </div>
              <h4 className="font-bold text-[#1A2F4B] mb-2 text-base">
                {step.title}
              </h4>
              <p className="text-sm text-[#1A2F4B]/70">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Nota explicativa */}
      <div className="mt-8 bg-vivant-gold/10 border-l-4 border-vivant-gold rounded-lg p-4">
        <p className="text-sm text-[#1A2F4B]">
          <strong>💡 Importante:</strong> Se as 2 cotas não venderem em 60 dias, a Opção de Prioridade expira 
          automaticamente. <strong>Zero custos para ambas as partes.</strong> Você fica livre para buscar outras alternativas.
        </p>
      </div>
    </div>
  );
}
