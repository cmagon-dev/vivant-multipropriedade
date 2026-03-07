import dynamic from "next/dynamic";
import { HelpTip } from "@/components/help/HelpTip";

const PropriedadesList = dynamic(
  () => import("@/components/comercial/propriedades-list").then((m) => ({ default: m.PropriedadesList })),
  { ssr: false, loading: () => <div className="animate-pulse h-48 bg-gray-100 rounded-lg" /> }
);

export default function ComercialPropriedadesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold text-vivant-navy">Propriedades</h1>
        <HelpTip helpKey="comercial.propriedades" fallbackTitle="Propriedades" fallbackText="Visualize destinos e o portfólio de casas para ofertas comerciais." />
      </div>
      <PropriedadesList />
    </div>
  );
}
