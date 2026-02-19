"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Home,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Waves,
  Car,
  Shield,
  Sparkles,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  X,
  SlidersHorizontal,
} from "lucide-react";

interface Property {
  id: string;
  slug: string;
  name: string;
  location: string;
  cidade: string;
  destino: { slug: string; name: string };
  condominio: string;
  type: string;
  priceValue: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  fraction: string;
  price: string;
  monthlyFee: string;
  weeks: string;
  images: string[];
  features: string[];
  appreciation: string;
  status: string;
  highlight: boolean;
}

interface CasasClientProps {
  properties: Property[];
}

export function CasasClient({ properties }: CasasClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  
  const [selectedDestino, setSelectedDestino] = useState("todos");
  const [selectedCidade, setSelectedCidade] = useState("todos");
  const [selectedFaixaPreco, setSelectedFaixaPreco] = useState("todos");
  const [selectedQuartos, setSelectedQuartos] = useState("todos");
  const [selectedAreaMin, setSelectedAreaMin] = useState("todos");
  const [selectedCondominio, setSelectedCondominio] = useState("todos");
  
  const itemsPerPage = 4;
  const [imageIndexes, setImageIndexes] = useState<{[key: string]: number}>({});

  const handlePrevImage = (propertyId: string, totalImages: number) => {
    setImageIndexes(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const handleNextImage = (propertyId: string, totalImages: number) => {
    setImageIndexes(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) + 1) % totalImages
    }));
  };

  const filteredProperties = properties.filter(property => {
    const destinoMatch = selectedDestino === "todos" || property.destino.slug === selectedDestino;
    const cidadeMatch = selectedCidade === "todos" || property.cidade === selectedCidade;
    const condominioMatch = selectedCondominio === "todos" || property.condominio === selectedCondominio;
    
    let precoMatch = true;
    if (selectedFaixaPreco === "ate-300k") {
      precoMatch = property.priceValue <= 300000;
    } else if (selectedFaixaPreco === "300k-400k") {
      precoMatch = property.priceValue > 300000 && property.priceValue <= 400000;
    } else if (selectedFaixaPreco === "acima-400k") {
      precoMatch = property.priceValue > 400000;
    }
    
    let quartosMatch = true;
    if (selectedQuartos === "2") {
      quartosMatch = property.bedrooms === 2;
    } else if (selectedQuartos === "3") {
      quartosMatch = property.bedrooms === 3;
    } else if (selectedQuartos === "4+") {
      quartosMatch = property.bedrooms >= 4;
    }
    
    let areaMatch = true;
    if (selectedAreaMin === "ate-200") {
      areaMatch = property.area <= 200;
    } else if (selectedAreaMin === "200-250") {
      areaMatch = property.area > 200 && property.area <= 250;
    } else if (selectedAreaMin === "250+") {
      areaMatch = property.area > 250;
    }
    
    return destinoMatch && cidadeMatch && condominioMatch && precoMatch && quartosMatch && areaMatch;
  });

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedDestino("todos");
    setSelectedCidade("todos");
    setSelectedFaixaPreco("todos");
    setSelectedQuartos("todos");
    setSelectedAreaMin("todos");
    setSelectedCondominio("todos");
    setCurrentPage(1);
  };

  const activeFiltersCount = [
    selectedDestino !== "todos",
    selectedCidade !== "todos",
    selectedFaixaPreco !== "todos",
    selectedQuartos !== "todos",
    selectedAreaMin !== "todos",
    selectedCondominio !== "todos",
  ].filter(Boolean).length;

  const destinos = Array.from(new Set(properties.map(p => p.destino.slug)));
  const cidades = Array.from(new Set(properties.map(p => p.cidade)));
  const condominios = Array.from(new Set(properties.map(p => p.condominio)));

  const statusBadgeColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      "DISPONIVEL": "bg-green-100 text-green-800",
      "ULTIMAS_COTAS": "bg-orange-100 text-orange-800",
      "PRE_LANCAMENTO": "bg-blue-100 text-blue-800",
      "VENDIDO": "bg-gray-100 text-gray-800",
    };
    return statusMap[status] || statusMap["DISPONIVEL"];
  };

  const statusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      "DISPONIVEL": "Disponível",
      "ULTIMAS_COTAS": "Últimas cotas",
      "PRE_LANCAMENTO": "Pré-lançamento",
      "VENDIDO": "Vendido",
    };
    return labels[status] || status;
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A2F4B]/70 via-[#1A2F4B]/60 to-[#F8F9FA]" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center py-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6">
            Nossas Casas
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Descubra propriedades exclusivas em destinos paradisíacos.
            Multipropriedade inteligente com valorização garantida.
          </p>
        </div>
      </section>

      <main className="py-16 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Filtros */}
          <div className="mb-8 flex items-center justify-between">
            <div className="text-gray-600">
              <span className="font-semibold text-vivant-navy">
                {filteredProperties.length}
              </span>{" "}
              {filteredProperties.length === 1 ? "casa encontrada" : "casas encontradas"}
            </div>

            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 relative"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-vivant-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-vivant-navy">Filtrar Casas</SheetTitle>
                  <SheetDescription>
                    Refine sua busca para encontrar a casa ideal
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                  {/* Destino */}
                  <div className="space-y-2">
                    <Label className="text-vivant-navy font-semibold">
                      Destino
                    </Label>
                    <select
                      value={selectedDestino}
                      onChange={(e) => {
                        setSelectedDestino(e.target.value);
                        handleFilterChange();
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vivant-gold"
                    >
                      <option value="todos">Todos os destinos</option>
                      {destinos.map(dest => (
                        <option key={dest} value={dest}>
                          {dest.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cidade */}
                  <div className="space-y-2">
                    <Label className="text-vivant-navy font-semibold">
                      Cidade
                    </Label>
                    <select
                      value={selectedCidade}
                      onChange={(e) => {
                        setSelectedCidade(e.target.value);
                        handleFilterChange();
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vivant-gold"
                    >
                      <option value="todos">Todas as cidades</option>
                      {cidades.map(cidade => (
                        <option key={cidade} value={cidade}>{cidade}</option>
                      ))}
                    </select>
                  </div>

                  {/* Condomínio */}
                  <div className="space-y-2">
                    <Label className="text-vivant-navy font-semibold">
                      Condomínio
                    </Label>
                    <select
                      value={selectedCondominio}
                      onChange={(e) => {
                        setSelectedCondominio(e.target.value);
                        handleFilterChange();
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vivant-gold"
                    >
                      <option value="todos">Todos os condomínios</option>
                      {condominios.map(cond => (
                        <option key={cond} value={cond}>{cond}</option>
                      ))}
                    </select>
                  </div>

                  {/* Faixa de Preço */}
                  <div className="space-y-2">
                    <Label className="text-vivant-navy font-semibold">
                      Faixa de Preço
                    </Label>
                    <select
                      value={selectedFaixaPreco}
                      onChange={(e) => {
                        setSelectedFaixaPreco(e.target.value);
                        handleFilterChange();
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vivant-gold"
                    >
                      <option value="todos">Todas as faixas</option>
                      <option value="ate-300k">Até R$ 300.000</option>
                      <option value="300k-400k">R$ 300.000 - R$ 400.000</option>
                      <option value="acima-400k">Acima de R$ 400.000</option>
                    </select>
                  </div>

                  {/* Quartos */}
                  <div className="space-y-2">
                    <Label className="text-vivant-navy font-semibold">
                      Suítes
                    </Label>
                    <select
                      value={selectedQuartos}
                      onChange={(e) => {
                        setSelectedQuartos(e.target.value);
                        handleFilterChange();
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vivant-gold"
                    >
                      <option value="todos">Qualquer quantidade</option>
                      <option value="2">2 suítes</option>
                      <option value="3">3 suítes</option>
                      <option value="4+">4+ suítes</option>
                    </select>
                  </div>

                  {/* Área */}
                  <div className="space-y-2">
                    <Label className="text-vivant-navy font-semibold">
                      Área (m²)
                    </Label>
                    <select
                      value={selectedAreaMin}
                      onChange={(e) => {
                        setSelectedAreaMin(e.target.value);
                        handleFilterChange();
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-vivant-gold"
                    >
                      <option value="todos">Qualquer área</option>
                      <option value="ate-200">Até 200m²</option>
                      <option value="200-250">200m² - 250m²</option>
                      <option value="250+">Acima de 250m²</option>
                    </select>
                  </div>
                </div>

                <SheetFooter className="mt-6">
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Limpar Filtros
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* Lista de Casas */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {currentProperties.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-vivant-gold"
              >
                {/* Carousel de Imagens */}
                <div className="relative h-64 bg-gray-200 group">
                  <img
                    src={property.images[imageIndexes[property.id] || 0]}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />

                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={() => handlePrevImage(property.id, property.images.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Imagem anterior"
                      >
                        <ChevronLeft className="w-5 h-5 text-vivant-navy" />
                      </button>
                      <button
                        onClick={() => handleNextImage(property.id, property.images.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Próxima imagem"
                      >
                        <ChevronRight className="w-5 h-5 text-vivant-navy" />
                      </button>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {property.images.map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all ${
                              idx === (imageIndexes[property.id] || 0)
                                ? "w-6 bg-white"
                                : "w-1.5 bg-white/60"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {property.highlight && (
                    <div className="absolute top-4 left-4 bg-vivant-gold text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {statusLabel(property.status)}
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-2xl text-vivant-navy font-serif">
                    {property.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-base">
                    <MapPin className="w-4 h-4 text-vivant-gold" />
                    {property.location}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
                    <div className="flex flex-col items-center">
                      <Bed className="w-5 h-5 text-vivant-gold mb-1" />
                      <span className="text-sm font-semibold text-vivant-navy">
                        {property.bedrooms} suítes
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Bath className="w-5 h-5 text-vivant-gold mb-1" />
                      <span className="text-sm font-semibold text-vivant-navy">
                        {property.bathrooms} banheiros
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Maximize className="w-5 h-5 text-vivant-gold mb-1" />
                      <span className="text-sm font-semibold text-vivant-navy">
                        {property.area}m²
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Fração</span>
                      <span className="font-semibold text-vivant-navy">
                        {property.fraction}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Semanas/ano</span>
                      <span className="font-semibold text-vivant-navy">
                        {property.weeks} semanas
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Investimento</span>
                      <span className="text-2xl font-bold text-vivant-navy">
                        {property.price}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Taxa mensal</span>
                      <span className="text-gray-700 font-semibold">
                        {property.monthlyFee}
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-semibold text-green-800">
                        Valorização: {property.appreciation}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 border-2 border-vivant-navy text-vivant-navy hover:bg-vivant-navy hover:text-white"
                    >
                      <Link href={`/casas/${property.slug}`}>
                        Ver Mais
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="flex-1 bg-vivant-navy hover:bg-vivant-navy/90 text-white"
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className={
                      currentPage === page
                        ? "bg-vivant-navy hover:bg-vivant-navy/90"
                        : ""
                    }
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
