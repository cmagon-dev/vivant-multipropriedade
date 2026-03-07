import { cn } from "@/lib/utils";

export type StageStyle = {
  barClass: string;
  titleClass: string;
  badgeClass: string;
};

type StageConcept =
  | "NEW"
  | "CONTACT"
  | "EVALUATION"
  | "PROPOSAL";

// Normaliza nomes de etapas vindos do banco / API
export function normalizeStageName(name: string | null | undefined): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Sinônimos por conceito (match por substring no nome normalizado)
const STAGE_CONCEPT_PATTERNS: Record<StageConcept, string[]> = {
  // "entrada" ~ "novo"
  NEW: [
    "novo lead",
    "novo contato",
    "novo",
    "entrada",
  ],
  // "coleta" ~ "qualificacao" ~ "contato"
  CONTACT: [
    "coleta",
    "qualific",
    "primeiro contato",
    "primeiro",
    "contato",
  ],
  // "avaliacao" ~ "visita" ~ "tour" + etapas de análise/validação/apresentação
  EVALUATION: [
    "pre analise",
    "pré analise",
    "analise",
    "avaliacao",
    "visita",
    "tour",
    "perfil",
    "simulacao",
    "explicacao",
    "apresentacao",
    "validacao",
  ],
  // "fechamento" ~ "proposta" ~ "negociacao" ~ "documentos" ~ "contrato"
  PROPOSAL: [
    "proposta",
    "negociac",
    "fechamento",
    "documento",
    "contrato",
    "termos",
  ],
};

const CONCEPT_COLORS: Record<StageConcept, StageStyle> = {
  NEW: {
    barClass: "bg-blue-600",
    titleClass: "text-blue-800",
    badgeClass:
      "bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold",
  },
  CONTACT: {
    barClass: "bg-amber-500",
    titleClass: "text-amber-800",
    badgeClass:
      "bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold",
  },
  EVALUATION: {
    barClass: "bg-violet-600",
    titleClass: "text-violet-800",
    badgeClass:
      "bg-violet-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold",
  },
  PROPOSAL: {
    barClass: "bg-orange-600",
    titleClass: "text-orange-800",
    badgeClass:
      "bg-orange-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold",
  },
};

// Paleta energética para fallback determinístico via hash
const HASH_COLOR_SCHEMES: StageStyle[] = [
  CONCEPT_COLORS.NEW,
  CONCEPT_COLORS.CONTACT,
  CONCEPT_COLORS.EVALUATION,
  CONCEPT_COLORS.PROPOSAL,
  {
    barClass: "bg-teal-600",
    titleClass: "text-teal-800",
    badgeClass:
      "bg-teal-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold",
  },
  {
    barClass: "bg-pink-600",
    titleClass: "text-pink-800",
    badgeClass:
      "bg-pink-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold",
  },
];

function inferConcept(normalized: string): StageConcept | null {
  if (!normalized) return null;

  // Ordem de prioridade entre conceitos
  const conceptsInOrder: StageConcept[] = [
    "NEW",
    "CONTACT",
    "EVALUATION",
    "PROPOSAL",
  ];

  for (const concept of conceptsInOrder) {
    const patterns = STAGE_CONCEPT_PATTERNS[concept];
    if (patterns.some((p) => normalized.includes(p))) {
      return concept;
    }
  }

  return null;
}

function hashStringToIndex(value: string, modulo: number): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % modulo;
}

export function getStageStyle(
  stageName: string,
  isFinal?: boolean,
  finalStatus?: string | null
): StageStyle {
  const n = normalizeStageName(stageName);
  const status = (finalStatus || "").toUpperCase();

  // Finais (prioridade): por isFinal+finalStatus ou por nome normalizado
  if ((isFinal && status === "WON") || /^(won|ganho)/.test(n)) {
    return {
      barClass: "bg-green-600",
      titleClass: "text-green-800",
      badgeClass: cn(
        "bg-green-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold"
      ),
    };
  }
  if ((isFinal && status === "LOST") || /^(lost|perdido)/.test(n)) {
    return {
      barClass: "bg-gray-500",
      titleClass: "text-gray-700",
      badgeClass: cn(
        "bg-gray-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold"
      ),
    };
  }

  const concept = inferConcept(n);
  if (concept) {
    return CONCEPT_COLORS[concept];
  }

  // Fallback determinístico por hash: nunca deixa a coluna neutra
  const index = hashStringToIndex(n || stageName, HASH_COLOR_SCHEMES.length);
  return HASH_COLOR_SCHEMES[index];
}

