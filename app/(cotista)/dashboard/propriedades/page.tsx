"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, ChevronRight, Loader2, MapPin } from "lucide-react";

type Item = {
  propertyId: string;
  name: string;
  cidade: string;
  location: string;
  destino: string;
  slug: string;
  totalCotas: number | null;
  coverImage: string | null;
  cotasCount: number;
};

export default function PropriedadesCotistaPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cotistas/me/propriedades", { credentials: "include", cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { propriedades: [] }))
      .then((data) => setItems(data.propriedades || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const totalPropriedadesLista = items.length;
  const totalCotasSuas = items.reduce((acc, p) => acc + p.cotasCount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B] mb-2">
          Minhas propriedades
        </h1>
        <p className="text-[#1A2F4B]/70">
          Imóveis em que você possui cota. Abra o perfil para ver detalhes e suas cotas.
        </p>
        {!loading && items.length > 0 && (
          <p className="mt-2 text-sm text-[#1A2F4B]/85">
            Nesta lista:{" "}
            <span className="font-semibold text-[#1A2F4B]">{totalCotasSuas}</span>{" "}
            {totalCotasSuas === 1 ? "cota sua" : "cotas suas"} em{" "}
            <span className="font-semibold text-[#1A2F4B]">{totalPropriedadesLista}</span>{" "}
            {totalPropriedadesLista === 1 ? "propriedade" : "propriedades"}.
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-vivant-green animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <Card className="border-none shadow-lg">
          <CardContent className="py-12 text-center text-[#1A2F4B]/70">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-[#1A2F4B]/30" />
            <p className="font-medium">Nenhuma propriedade vinculada</p>
            <p className="text-sm mt-1 max-w-md mx-auto">
              Quando o administrador alocar cotas ao seu cadastro, os imóveis aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-1">
          {items.map((p) => (
            <li key={p.propertyId}>
              <Link href={`/dashboard/propriedades/${p.propertyId}`}>
                <Card className="border border-slate-200 shadow-md hover:shadow-lg hover:border-vivant-green/40 transition-all overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row sm:items-stretch">
                      <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0 bg-slate-100">
                        {p.coverImage ? (
                          <img
                            src={p.coverImage}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Building2 className="w-12 h-12 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-center min-w-0">
                        <h2 className="text-lg font-semibold text-[#1A2F4B] truncate">
                          {p.name}
                        </h2>
                        <p className="text-sm text-[#1A2F4B]/65 flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            {p.destino} · {p.cidade}
                          </span>
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
                          <span className="inline-flex items-center rounded-full bg-vivant-green/15 px-3 py-1 font-medium text-vivant-green">
                            {p.cotasCount === 1 ? "1 cota sua" : `${p.cotasCount} cotas suas`}
                          </span>
                          {p.totalCotas != null && p.totalCotas > 0 && (
                            <span className="text-[#1A2F4B]/55">
                              Total do imóvel: {p.totalCotas} cota(s)
                            </span>
                          )}
                        </div>
                        <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-vivant-green">
                          Ver perfil da propriedade
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
