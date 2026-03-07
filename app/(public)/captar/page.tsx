import { Suspense } from "react";
import { CaptarPageWithShell } from "@/components/captar/CaptarPageWithShell";

export const metadata = {
  title: "Captação | Vivant",
  description: "Conte o que você precisa. Entraremos em contato pelo WhatsApp.",
};

export default function CaptarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-vivant-navy text-white">Carregando...</div>}>
      <CaptarPageWithShell />
    </Suspense>
  );
}
