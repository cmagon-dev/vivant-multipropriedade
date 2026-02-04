import { headers } from "next/headers";

export type VivantBrand = "capital" | "residences" | "care";

export interface BrandConfig {
  name: string;
  title: string;
  description: string;
  domain: string;
}

const BRAND_CONFIGS: Record<VivantBrand, BrandConfig> = {
  capital: {
    name: "Vivant Capital",
    title: "Vivant Capital | Engenharia Financeira e Viabilidade",
    description:
      "Análise de viabilidade e engenharia financeira para multipropriedade de alto padrão. Simulações precisas e modelagem de fluxo de caixa.",
    domain: "vivantcapital.com.br",
  },
  residences: {
    name: "Vivant Residences",
    title: "Vivant | \"A arte de viver bem\"",
    description:
      "Realize o sonho da casa de férias sem compromisso total. Adquira sua cota em residências de alto padrão e desfrute de momentos inesquecíveis com sua família em destinos exclusivos.",
    domain: "vivantresidences.com.br",
  },
  care: {
    name: "Vivant Care",
    title: "Vivant Care | Gestão de Propriedade e Pós-Venda",
    description:
      "Portal exclusivo para cotistas Vivant. Agende seu período de uso, acompanhe extratos e acesse serviços de concierge premium.",
    domain: "vivantcare.com.br",
  },
};

/**
 * Detecta a marca Vivant baseada no hostname da requisição
 * @returns A marca detectada (capital, residences ou care)
 */
export function detectBrand(): VivantBrand {
  const headersList = headers();
  const hostname = headersList.get("host") || "";
  const domain = hostname.split(":")[0];

  if (domain.includes("vivantcapital.com.br")) {
    return "capital";
  }

  if (domain.includes("vivantcare.com.br")) {
    return "care";
  }

  // Default: Vivant Residences
  return "residences";
}

/**
 * Retorna a configuração da marca atual
 * @returns Objeto com configurações da marca
 */
export function getBrandConfig(): BrandConfig {
  const brand = detectBrand();
  return BRAND_CONFIGS[brand];
}
