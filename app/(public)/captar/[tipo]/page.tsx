import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CaptarPageWithShell } from "@/components/captar/CaptarPageWithShell";

const TIPOS = ["imovel", "investidor", "cotas", "modelo"] as const;
const KEY_MAP: Record<string, "IMOVEL" | "INVESTIDOR" | "COTISTA" | "MODELO"> = {
  imovel: "IMOVEL",
  investidor: "INVESTIDOR",
  cotas: "COTISTA",
  modelo: "MODELO",
};

export async function generateStaticParams() {
  return TIPOS.map((tipo) => ({ tipo }));
}

export default async function CaptarTipoPage({ params }: { params: Promise<{ tipo: string }> }) {
  const { tipo } = await params;
  const normalized = tipo?.toLowerCase();
  const leadTypeKey = normalized ? KEY_MAP[normalized] : null;

  if (!leadTypeKey) notFound();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-vivant-navy text-white">Carregando...</div>}>
      <CaptarPageWithShell presetType={leadTypeKey} />
    </Suspense>
  );
}

export const metadata = {
  title: "Captação | Vivant",
  description: "Conte o que você precisa. Entraremos em contato pelo WhatsApp.",
};
