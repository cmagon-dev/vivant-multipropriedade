import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { DestinosClient } from "./destinos-client";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function DestinosPage() {
  // Buscar destinos publicados do banco
  const allDestinations = await prisma.destination.findMany({
    where: { published: true },
    orderBy: { order: "asc" }
  });

  // Converter para formato esperado pelo componente cliente
  const destinationsFormatted = allDestinations.map(dest => ({
    ...dest,
    features: dest.features as Array<{
      icon: string;
      title: string;
      desc: string;
    }>
  }));

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      <DestinosClient destinations={destinationsFormatted} />
      <Footer />
    </div>
  );
}
