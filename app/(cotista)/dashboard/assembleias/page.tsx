"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Vote } from "lucide-react";

export default function AssembleiasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B] mb-2">
          Assembleias e Votações
        </h1>
        <p className="text-[#1A2F4B]/70">
          Participe das decisões do condomínio
        </p>
      </div>

      <Card className="border-none shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-vivant-green/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-vivant-green" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[#1A2F4B] mb-3">
              Sistema de Assembleias
            </h2>
            <p className="text-[#1A2F4B]/70 mb-6">
              Em breve você poderá participar de assembleias online, votar em pautas
              importantes e acompanhar as decisões do condomínio em tempo real.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <div className="flex items-start gap-2 text-sm text-[#1A2F4B]/80">
                <Calendar className="w-4 h-4 text-vivant-green flex-shrink-0 mt-0.5" />
                <span>Assembleias programadas</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-[#1A2F4B]/80">
                <Vote className="w-4 h-4 text-vivant-green flex-shrink-0 mt-0.5" />
                <span>Votação online segura</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
