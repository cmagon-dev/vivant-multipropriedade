import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { ShareButton } from "@/components/marketing/share-button";
import { ImageLightbox } from "@/components/marketing/image-lightbox";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  TrendingUp,
  Calendar,
  DollarSign,
  Home,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

interface CasaPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const properties = await prisma.property.findMany({
    where: { published: true },
    select: { slug: true },
  });

  return properties.map((property) => ({
    slug: property.slug,
  }));
}

export default async function CasaPage({ params }: CasaPageProps) {
  const property = await prisma.property.findUnique({
    where: { slug: params.slug, published: true },
    include: {
      destino: {
        select: { name: true, slug: true, emoji: true },
      },
    },
  });

  if (!property) {
    notFound();
  }

  const images = property.images as string[];
  const features = property.features as string[];

  const statusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      DISPONIVEL: "Disponível",
      ULTIMAS_COTAS: "Últimas cotas",
      PRE_LANCAMENTO: "Pré-lançamento",
      VENDIDO: "Vendido",
    };
    return labels[status] || status;
  };

  const statusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      DISPONIVEL: "bg-green-100 text-green-800",
      ULTIMAS_COTAS: "bg-orange-100 text-orange-800",
      PRE_LANCAMENTO: "bg-blue-100 text-blue-800",
      VENDIDO: "bg-gray-100 text-gray-800",
    };
    return colors[status] || colors["DISPONIVEL"];
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-vivant-navy">
              Início
            </Link>
            <span>/</span>
            <Link href="/casas" className="hover:text-vivant-navy">
              Casas
            </Link>
            <span>/</span>
            <span className="text-vivant-navy font-semibold">{property.name}</span>
          </div>
        </div>
      </div>

      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-vivant-navy mb-2">
                  {property.name}
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5 text-vivant-gold" />
                  <span className="text-lg">{property.location}</span>
                </div>
              </div>
              <Badge className={statusColor(property.status)}>
                {statusLabel(property.status)}
              </Badge>
            </div>

            {property.destino && (
              <Link
                href={`/destinos`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-vivant-gold transition-colors"
              >
                <span className="text-2xl">{property.destino.emoji}</span>
                <span className="font-semibold text-vivant-navy">
                  {property.destino.name}
                </span>
              </Link>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Coluna Principal - Imagens e Descrição */}
            <div className="lg:col-span-2 space-y-6">
              {/* Galeria de Imagens */}
              <Card className="overflow-hidden">
                <ImageLightbox images={images} alt={property.name} />
              </Card>

              {/* Características */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-vivant-navy mb-4">
                    Características
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                      <Bed className="w-8 h-8 text-vivant-gold mb-2" />
                      <span className="text-2xl font-bold text-vivant-navy">
                        {property.bedrooms}
                      </span>
                      <span className="text-sm text-gray-600">Suítes</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                      <Bath className="w-8 h-8 text-vivant-gold mb-2" />
                      <span className="text-2xl font-bold text-vivant-navy">
                        {property.bathrooms}
                      </span>
                      <span className="text-sm text-gray-600">Banheiros</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                      <Maximize className="w-8 h-8 text-vivant-gold mb-2" />
                      <span className="text-2xl font-bold text-vivant-navy">
                        {property.area}m²
                      </span>
                      <span className="text-sm text-gray-600">Área</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                      <Home className="w-8 h-8 text-vivant-gold mb-2" />
                      <span className="text-2xl font-bold text-vivant-navy">
                        {property.fraction}
                      </span>
                      <span className="text-sm text-gray-600">Fração</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Descrição */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-vivant-navy mb-4">
                    Sobre a Propriedade
                  </h2>
                  <div
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: property.description }}
                  />
                </CardContent>
              </Card>

              {/* Comodidades */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-vivant-navy mb-4">
                    Comodidades e Diferenciais
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Informações de Investimento */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Card de Preço */}
                <Card className="border-2 border-vivant-gold">
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Investimento total
                      </p>
                      <p className="text-3xl font-bold text-vivant-navy">
                        {property.price}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Taxa mensal</span>
                        <span className="font-semibold text-vivant-navy">
                          {property.monthlyFee}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Semanas/ano</span>
                        <span className="font-semibold text-vivant-navy">
                          {property.weeks} semanas
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tipo</span>
                        <span className="font-semibold text-vivant-navy">
                          {property.type}
                        </span>
                      </div>
                    </div>

                    {property.appreciation && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-xs text-green-600 font-semibold">
                              Valorização
                            </p>
                            <p className="text-sm text-green-800 font-bold">
                              {property.appreciation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      asChild
                      className="w-full bg-vivant-navy hover:bg-vivant-navy/90 text-white"
                      size="lg"
                    >
                      <a
                        href={`https://wa.me/5511999999999?text=Olá! Tenho interesse na ${encodeURIComponent(
                          property.name
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Tenho Interesse
                      </a>
                    </Button>

                    <ShareButton
                      title={property.name}
                      text={`Conheça ${property.name} - ${property.location}`}
                      url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/casas/${property.slug}`}
                    />
                  </CardContent>
                </Card>

                {/* Card Condomínio */}
                {property.condominio && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-vivant-navy mb-2">
                        Condomínio
                      </h3>
                      <p className="text-gray-700">{property.condominio}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Card Cidade */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-vivant-navy mb-2">Localização</h3>
                    <p className="text-gray-700 mb-1">{property.cidade}</p>
                    <p className="text-sm text-gray-600">{property.location}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <Card className="mt-12 bg-gradient-to-br from-vivant-navy to-[#2A4F6B] text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-serif font-bold mb-4">
                Interessado nesta propriedade?
              </h2>
              <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                Fale com nossos especialistas e agende uma visita para conhecer
                esta casa de perto
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-vivant-navy hover:bg-white/90"
                >
                  <a
                    href={`https://wa.me/5511999999999?text=Olá! Quero agendar uma visita à ${encodeURIComponent(
                      property.name
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Agendar Visita
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10"
                >
                  <Link href="/contato">Fale Conosco</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
