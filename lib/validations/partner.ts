import { z } from "zod";

/**
 * Schema de validação para o formulário de lead de parceiros (proprietários)
 * Validação de dados para captação de imóveis através do modelo Soft Launch
 */

export const partnerLeadSchema = z.object({
  nome: z
    .string()
    .min(3, "Nome deve ter ao menos 3 caracteres")
    .max(100, "Nome muito longo"),
  
  email: z
    .string()
    .email("E-mail inválido")
    .toLowerCase(),
  
  telefone: z
    .string()
    .regex(/^\d{10,11}$/, "Telefone inválido. Use apenas números (DDD + número)")
    .transform((val) => val.replace(/\D/g, "")), // Remove caracteres não numéricos
  
  cidade: z
    .string()
    .min(3, "Cidade obrigatória")
    .max(100, "Nome da cidade muito longo"),
  
  estado: z
    .string()
    .min(2, "Estado obrigatório")
    .max(2, "Use a sigla do estado (ex: SP, RJ)")
    .toUpperCase(),
  
  tipoImovel: z.enum(["casa", "apartamento", "chacara", "outro"], {
    errorMap: () => ({ message: "Selecione um tipo de imóvel válido" }),
  }),
  
  valorEstimado: z
    .number()
    .min(500000, "Valor mínimo: R$ 500.000")
    .max(10000000, "Valor máximo: R$ 10.000.000"),
  
  descricaoImovel: z
    .string()
    .max(500, "Descrição muito longa (máximo 500 caracteres)")
    .optional(),
  
  aceitaContato: z
    .boolean()
    .refine((val) => val === true, {
      message: "Você deve aceitar ser contatado para continuar",
    }),
});

export type PartnerLeadFormData = z.infer<typeof partnerLeadSchema>;

/**
 * Schema para input do formulário (antes da transformação)
 * Útil para trabalhar com valores brutos do formulário
 */
export const partnerLeadInputSchema = partnerLeadSchema.extend({
  telefone: z.string(), // Aceita string com máscara antes da transformação
  valorEstimado: z.union([z.number(), z.string()]).transform((val) => {
    if (typeof val === "string") {
      return parseFloat(val.replace(/\D/g, ""));
    }
    return val;
  }),
});

export type PartnerLeadInputFormData = z.input<typeof partnerLeadInputSchema>;
