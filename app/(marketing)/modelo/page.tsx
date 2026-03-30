import type { Metadata } from "next";
import { ModeloStepsClient } from "./steps-client";

export const metadata: Metadata = {
  title: "O Modelo Vivant - Multipropriedade Inteligente",
  description:
    "Entenda como a multipropriedade Vivant transforma o sonho da casa de lazer em realidade, com custo acessível, liquidez garantida e valorização patrimonial.",
  openGraph: {
    title: "O Modelo Vivant - Multipropriedade Inteligente",
    description:
      "Entenda como funciona a multipropriedade Vivant: acesso democrático a casas de alto padrão, custo fracionado e liquidez garantida.",
    type: "website",
  },
};

export default function ModeloPage(): JSX.Element {
  return <ModeloStepsClient />;
}
