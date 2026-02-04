import { z } from "zod";

/**
 * Schema de validação para os dados de entrada da propriedade
 */
export const propertyInputSchema = z.object({
  precoCota: z
    .number({
      required_error: "O preço da cota é obrigatório",
      invalid_type_error: "O preço da cota deve ser um número",
    })
    .positive("O preço da cota deve ser maior que zero")
    .min(1000, "O preço da cota deve ser no mínimo R$ 1.000,00")
    .max(10000000, "O preço da cota deve ser no máximo R$ 10.000.000,00"),
  
  quantidadeCotas: z
    .number({
      required_error: "A quantidade de cotas é obrigatória",
      invalid_type_error: "A quantidade de cotas deve ser um número",
    })
    .int("A quantidade de cotas deve ser um número inteiro")
    .positive("A quantidade de cotas deve ser maior que zero")
    .min(1, "Deve haver pelo menos 1 cota")
    .max(1000, "A quantidade máxima é de 1.000 cotas"),
  
  custoMobilia: z
    .number({
      required_error: "O custo de mobília é obrigatório",
      invalid_type_error: "O custo de mobília deve ser um número",
    })
    .nonnegative("O custo de mobília não pode ser negativo")
    .max(5000000, "O custo de mobília deve ser no máximo R$ 5.000.000,00"),
});

/**
 * Tipo inferido do schema de validação
 */
export type PropertyInputFormData = z.infer<typeof propertyInputSchema>;
