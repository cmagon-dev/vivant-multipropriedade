import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { CasasClient } from "./casas-client";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Waves, Shield, Car, Sparkles } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

export default async function CasasPage() {
  // Buscar propriedades publicadas do banco
  const allProperties = await prisma.property.findMany({
    where: { published: true },
    include: {
      destino: {
        select: { slug: true, name: true }
      }
    },
    orderBy: [
      { highlight: "desc" },
      { createdAt: "desc" }
    ]
  });

  // Converter para formato esperado pelo componente cliente
  const propertiesFormatted = allProperties.map(prop => ({
    ...prop,
    images: prop.images as string[],
    features: prop.features as string[],
  }));

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      
      <CasasClient properties={propertiesFormatted} />

      {/* Por que Vivant Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-4 px-2">
              Por que escolher a Vivant?
            </h2>
            <p className="text-base sm:text-lg text-[#1A2F4B]/70 max-w-2xl mx-auto px-4">
              Multipropriedade inteligente com curadoria de destinos e
              propriedades de alto padrão
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Waves,
                title: "Destinos Premium",
                desc: "Localizações exclusivas em paraísos brasileiros",
              },
              {
                icon: Sparkles,
                title: "Alto Padrão",
                desc: "Casas mobiliadas e decoradas prontas para uso",
              },
              {
                icon: Shield,
                title: "Segurança Jurídica",
                desc: "Contratos registrados e assessoria completa",
              },
              {
                icon: Car,
                title: "Garagem e Acesso",
                desc: "Vagas privativas e acesso facilitado",
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="border-2 border-[#1A2F4B]/10 hover:border-[#1A2F4B]/30 transition-all"
              >
                <CardContent className="p-6 text-center">
                  <item.icon className="w-12 h-12 text-[#1A2F4B] mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#1A2F4B]/70">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B]">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 px-2">
            Interessado em uma dessas casas?
          </h2>
          <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto px-4">
            Fale com nossos especialistas e agende uma visita às propriedades
          </p>

          <Button
            asChild
            size="lg"
            className="bg-white text-[#1A2F4B] hover:bg-white/90 text-base sm:text-lg min-h-[48px] py-4 px-8 font-semibold"
          >
            <Link href="/contato">Fale Conosco</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
