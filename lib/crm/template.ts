/**
 * Contexto para renderizar template de mensagem (variáveis do lead/etapa/vendedor).
 */
export type TemplateContext = {
  nome?: string | null;
  vendedor?: string | null;
  tipo?: string | null;
  etapa?: string | null;
  email?: string | null;
  telefone?: string | null;
};

const VAR_KEYS: (keyof TemplateContext)[] = ["nome", "vendedor", "tipo", "etapa", "email", "telefone"];

/**
 * Substitui variáveis no template por valores do contexto.
 * Variáveis: {nome}, {vendedor}, {tipo}, {etapa}, {email}, {telefone}
 * Fallback seguro: campo vazio vira string vazia (não quebra o texto).
 */
export function renderTemplate(template: string | null | undefined, ctx: TemplateContext): string {
  if (!template || typeof template !== "string") return "";
  let out = template;
  for (const key of VAR_KEYS) {
    const val = ctx[key];
    const safe = val != null && String(val).trim() !== "" ? String(val).trim() : "";
    const regex = new RegExp(`\\{${key}\\}`, "gi");
    out = out.replace(regex, safe);
  }
  return out;
}
