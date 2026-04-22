import { z } from "zod";

export const partnersSimulatorInputSchema = z.object({
  valorImovel: z
    .number({ invalid_type_error: "Informe o valor do imóvel" })
    .min(100000, "Valor mínimo: R$ 100.000")
    .max(50000000, "Valor máximo: R$ 50.000.000"),
  ipcaProjetado: z
    .number({ invalid_type_error: "Informe o IPCA projetado" })
    .min(0.03, "IPCA mínimo: 3%")
    .max(0.10, "IPCA máximo: 10%"),
  cenario: z.enum(["otimista", "realista", "pessimista"], {
    errorMap: () => ({ message: "Selecione um cenário de vendas" }),
  }),
});

export type PartnersSimulatorInputData = z.infer<typeof partnersSimulatorInputSchema>;
