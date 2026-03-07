import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Plus, Users, Calendar, MapPin, Edit } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PropriedadesFilters } from "@/components/admin-portal/propriedades-filters";

export const dynamic = "force-dynamic";

interface SearchParams {
  search?: string;
  destinoId?: string;
  status?: string;
}

export default async function PropriedadesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { search, destinoId, status } = searchParams;
  
  const whereClause: any = {};
  
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { cidade: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
    ];
  }
  
  if (destinoId && destinoId !== 'all') {
    whereClause.destinoId = destinoId;
  }
  
  if (status && status !== 'all') {
    whereClause.status = status;
  }
  
  const [propriedades, destinations] = await Promise.all([
    prisma.property.findMany({
      where: whereClause,
      include: {
        destino: true,
        cotas: {
          include: {
            cotista: true,
            _count: {
              select: {
                reservas: true,
              },
            },
          },
        },
        _count: {
          select: {
            cotas: true,
            assembleias: true,
            mensagens: true,
            documentos: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    }),
    prisma.destination.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy flex items-center gap-3">
            <Home className="w-8 h-8 text-vivant-green" />
            Gestão de Propriedades
          </h1>
          <p className="text-gray-500 mt-1">
            Gerencie residências, cotas e alocações de cotistas
          </p>
        </div>
        <Button asChild className="bg-vivant-green hover:bg-vivant-green/90">
          <Link href="/admin-portal/propriedades/nova">
            <Plus className="w-4 h-4 mr-2" />
            Nova Propriedade
          </Link>
        </Button>
      </div>

      {/* Filtros */}
      <PropriedadesFilters destinations={destinations} />

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Propriedades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-vivant-navy">
              {propriedades.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Cotas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-vivant-navy">
              {propriedades.reduce((acc, p) => acc + p._count.cotas, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cotas Alocadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-vivant-green">
              {propriedades.reduce((acc, p) => acc + p.cotas.length, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Reservas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {propriedades.reduce((acc, p) => 
                acc + p.cotas.reduce((sum, cota) => sum + (cota._count?.reservas || 0), 0), 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Propriedades */}
      <div className="grid gap-6">
        {propriedades.map((propriedade) => {
          const cotasAlocadas = propriedade.cotas.length;
          const cotasTotal = propriedade.totalCotas || 0;
          const percentualAlocacao = cotasTotal > 0 ? (cotasAlocadas / cotasTotal) * 100 : 0;

          return (
            <Card key={propriedade.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Imagem e Info Principal */}
                  <div className="flex gap-4 flex-1">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {Array.isArray(propriedade.images) && propriedade.images[0] ? (
                        <img
                          src={String(propriedade.images[0])}
                          alt={propriedade.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="text-xl font-bold text-vivant-navy">
                          {propriedade.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{propriedade.destino?.name || 'Destino não definido'}</span>
                        </div>
                      </div>

                      {/* Estatísticas da Propriedade */}
                      <div className="grid grid-cols-3 gap-4 pt-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-vivant-green" />
                          <div>
                            <p className="text-xs text-gray-500">Cotas</p>
                            <p className="font-semibold text-vivant-navy">
                              {cotasAlocadas} / {cotasTotal}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-xs text-gray-500">Reservas</p>
                            <p className="font-semibold text-vivant-navy">
                              {propriedade.cotas.reduce((sum, cota) => sum + (cota._count?.reservas || 0), 0)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="text-xs text-gray-500">Quartos</p>
                            <p className="font-semibold text-vivant-navy">
                              {propriedade.bedrooms || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Barra de Progresso de Alocação */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Alocação de Cotas</span>
                          <span className="font-semibold">{percentualAlocacao.toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-vivant-green transition-all"
                            style={{ width: `${percentualAlocacao}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col gap-2">
                    <Button
                      asChild
                      size="sm"
                      className="bg-vivant-green hover:bg-vivant-green/90"
                    >
                      <Link href={`/admin-portal/propriedades/${propriedade.id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Gerenciar
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                    >
                      <Link href={`/admin-portal/propriedades/${propriedade.id}/calendario`}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Calendário
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Lista Rápida de Cotistas */}
                {propriedade.cotas.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Cotistas Alocados:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {propriedade.cotas.slice(0, 5).map((cota) => (
                        <span
                          key={cota.id}
                          className="px-3 py-1 bg-vivant-green/10 text-vivant-green rounded-full text-xs font-medium"
                        >
                          {cota.cotista.name} - {cota.numeroCota}
                        </span>
                      ))}
                      {propriedade.cotas.length > 5 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          +{propriedade.cotas.length - 5} mais
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {propriedades.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma propriedade cadastrada
              </h3>
              <p className="text-gray-600 mb-4">
                Comece cadastrando uma nova propriedade para gerenciar cotas e cotistas
              </p>
              <Button asChild className="bg-vivant-green hover:bg-vivant-green/90">
                <Link href="/admin-portal/propriedades/nova">
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Propriedade
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
