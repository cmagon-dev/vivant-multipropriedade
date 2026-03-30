import type { Metadata } from "next";
import { ParceirosStepsClient } from "./steps-client";

export const metadata: Metadata = {
  title: "Cadastre seu Imóvel - Vivant Partners",
  description: "Transforme sua casa de férias em ativo líquido. Teste de mercado sem risco em 60 dias. Zero custos iniciais. Validação garantida.",
  openGraph: {
    title: "Vivant Partners - Monetize seu Imóvel",
    description: "Modelo de validação sem custos iniciais. Opção de Prioridade de 60 dias.",
    type: "website",
  },
};

export default function ParceirosPage(): JSX.Element {
  return <ParceirosStepsClient />;
}

