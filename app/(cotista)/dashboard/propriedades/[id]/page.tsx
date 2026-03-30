"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building2,
  Loader2,
  MapPin,
  Users,
  Maximize,
  Bath,
  Bed,
} from "lucide-react";
import {
  CotaWeekDatesLines,
  type SemanaAlocadaItem,
} from "@/components/cotista/cota-week-dates";

type Cota = {
  id: string;
  numeroCota: string;
  percentualCota: number;
  semanasAno: number;
  dataAquisicao: string;
  semanasAlocadas?: SemanaAlocadaItem[];
};

type Property = {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  cidade: string;
  condominio: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  maxGuests: number | null;
  fraction: string;
  weeks: string;
  totalCotas: number | null;
  images: unknown;
  features: unknown;
  published: boolean;
  destino: {
    id: string;
    name: string;
    slug: string;
    subtitle: string;
    location: string;
  };
};

export default function PropriedadePerfilCotistaPage() {
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [cotas, setCotas] = useState<Cota[]>([]);
  const [anoSemanas, setAnoSemanas] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/cotistas/me/propriedades/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          setError("Não foi possível carregar esta propriedade.");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setProperty(data.property);
        setCotas(data.cotas || []);
        setAnoSemanas(
          typeof data.anoSemanasAlocadas === "number"
            ? data.anoSemanasAlocadas
            : new Date().getFullYear()
        );
      })
      .catch(() => setError("Erro ao carregar."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[320px]">
        <Loader2 className="w-10 h-10 text-vivant-green animate-spin" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild className="gap-2 text-[#1A2F4B]">
          <Link href="/dashboard/propriedades">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </Button>
        <Card>
          <CardContent className="py-12 text-center text-[#1A2F4B]/70">
            {error ?? "Propriedade não encontrada."}
          </CardContent>
        </Card>
      </div>
    );
  }

  const images = Array.isArray(property.images) ? property.images.filter((u) => typeof u === "string") : [];
  const features = Array.isArray(property.features) ? property.features.filter((f) => typeof f === "string") : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="ghost" asChild className="gap-2 text-[#1A2F4B] w-fit -ml-2">
          <Link href="/dashboard/propriedades">
            <ArrowLeft className="w-4 h-4" />
            Minhas propriedades
          </Link>
        </Button>
        {property.published && (
          <Button asChild variant="outline" size="sm" className="border-vivant-green text-vivant-green">
            <Link href={`/casas/${property.slug}`} target="_blank" rel="noopener noreferrer">
              Ver página pública
            </Link>
          </Button>
        )}
      </div>

      {images[0] && (
        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md aspect-[21/9] max-h-72 bg-slate-100">
          <img src={images[0] as string} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B]">
          {property.name}
        </h1>
        <p className="text-[#1A2F4B]/70 flex items-center gap-2 mt-2">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          {property.destino.name} · {property.cidade}
        </p>
        <p className="text-sm text-[#1A2F4B]/60 mt-1">{property.location}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Bed className="w-8 h-8 text-vivant-green/80" />
            <div>
              <p className="text-xs text-[#1A2F4B]/55">Suítes</p>
              <p className="font-semibold text-[#1A2F4B]">{property.bedrooms}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Bath className="w-8 h-8 text-vivant-green/80" />
            <div>
              <p className="text-xs text-[#1A2F4B]/55">Banheiros</p>
              <p className="font-semibold text-[#1A2F4B]">{property.bathrooms}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Maximize className="w-8 h-8 text-vivant-green/80" />
            <div>
              <p className="text-xs text-[#1A2F4B]/55">Área</p>
              <p className="font-semibold text-[#1A2F4B]">{property.area} m²</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-vivant-green/80" />
            <div>
              <p className="text-xs text-[#1A2F4B]/55">Tipo</p>
              <p className="font-semibold text-[#1A2F4B] text-sm leading-tight">{property.type}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-vivant-green/25 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-serif flex items-center gap-2 text-[#1A2F4B]">
            <Users className="w-5 h-5 text-vivant-green" />
            Suas cotas nesta propriedade
          </CardTitle>
          {anoSemanas != null && (
            <p className="text-sm text-[#1A2F4B]/60">
              Datas abaixo referem-se ao calendário <strong>{anoSemanas}</strong> (semanas já
              distribuídas pelo administrador).
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {cotas.map((c) => (
            <div
              key={c.id}
              className="rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-[#1A2F4B]">{c.numeroCota}</p>
                  <p className="text-xs text-[#1A2F4B]/55">
                    {c.percentualCota}% · {c.semanasAno} semanas/ano (regra do contrato)
                  </p>
                </div>
              </div>
              <div className="border-t border-slate-200/80 pt-2">
                <CotaWeekDatesLines
                  items={c.semanasAlocadas ?? []}
                  anoReferencia={anoSemanas}
                  maxItems={12}
                />
              </div>
            </div>
          ))}
          {property.totalCotas != null && property.totalCotas > 0 && (
            <p className="text-sm text-[#1A2F4B]/60 pt-1">
              Total de cotas do imóvel: <strong className="text-[#1A2F4B]">{property.totalCotas}</strong> · Fração:{" "}
              {property.fraction} · Semanas/ano (regra): {property.weeks}
            </p>
          )}
        </CardContent>
      </Card>

      {property.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-serif text-[#1A2F4B]">Sobre o imóvel</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none text-[#1A2F4B]/85 prose-headings:text-[#1A2F4B]"
              dangerouslySetInnerHTML={{ __html: property.description }}
            />
          </CardContent>
        </Card>
      )}

      {features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-serif text-[#1A2F4B]">Características</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid sm:grid-cols-2 gap-2">
              {features.map((f, i) => (
                <li key={i} className="text-sm text-[#1A2F4B]/80 flex items-start gap-2">
                  <span className="text-vivant-green mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-[#1A2F4B]/45">
        Condomínio: {property.condominio}
      </p>
    </div>
  );
}
