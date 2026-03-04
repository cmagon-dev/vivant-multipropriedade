"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Calendar, Plus, ArrowRightLeft } from "lucide-react";

export default function TrocasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B] mb-2">
            Troca de Semanas
          </h1>
          <p className="text-[#1A2F4B]/70">
            Troque suas semanas com outros cotistas
          </p>
        </div>
        <Button className="bg-vivant-green hover:bg-vivant-green/90">
          <Plus className="w-4 h-4 mr-2" />
          Nova Oferta
        </Button>
      </div>

      <Card className="border-none shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-vivant-green/10 flex items-center justify-center mx-auto mb-4">
              <ArrowRightLeft className="w-10 h-10 text-vivant-green" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[#1A2F4B] mb-3">
              Marketplace de Trocas
            </h2>
            <p className="text-[#1A2F4B]/70 mb-6">
              Em breve você poderá disponibilizar suas semanas para troca e encontrar
              ofertas de outros cotistas. Maximize o uso da sua multipropriedade!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <div className="flex items-start gap-2 text-sm text-[#1A2F4B]/80">
                <Home className="w-4 h-4 text-vivant-green flex-shrink-0 mt-0.5" />
                <span>Troque entre propriedades</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-[#1A2F4B]/80">
                <Calendar className="w-4 h-4 text-vivant-green flex-shrink-0 mt-0.5" />
                <span>Flexibilidade de datas</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
