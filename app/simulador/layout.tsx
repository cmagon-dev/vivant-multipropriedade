import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulador Vivant",
  robots: { index: false, follow: false },
};

export default function SimuladorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
