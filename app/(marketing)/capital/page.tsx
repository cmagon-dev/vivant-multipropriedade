import type { Metadata } from "next";
import { SobreCapitalStepsClient } from "./steps-client";

export const metadata: Metadata = {
  title: "Vivant Capital - Investimentos em Multipropriedade",
  description: "Oportunidades exclusivas de investimento em imóveis fracionados com alta rentabilidade, segurança jurídica e estrutura CRI-ready.",
  openGraph: {
    title: "Vivant Capital - Investimentos de Alto Padrão",
    description: "Invista em multipropriedade com rentabilidade de IPCA + 12% a.a. e segurança total.",
    type: "website",
  },
};

export default function CapitalHomePage(): JSX.Element {
  return <SobreCapitalStepsClient />;
}

