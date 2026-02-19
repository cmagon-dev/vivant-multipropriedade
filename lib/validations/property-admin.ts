import { z } from "zod";

export const propertyCreateSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  slug: z.string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  location: z.string().min(3),
  cidade: z.string().min(2),
  destinoId: z.string().cuid("ID de destino inválido"),
  condominio: z.string().min(3),
  type: z.string().min(3),
  priceValue: z.number().int().positive(),
  bedrooms: z.number().int().positive().max(20),
  bathrooms: z.number().int().positive().max(20),
  area: z.number().int().positive(),
  fraction: z.string().regex(/^\d+\/\d+$/, "Fração inválida (ex: 1/8)"),
  price: z.string().min(3),
  monthlyFee: z.string().min(3),
  weeks: z.string(),
  images: z.array(z.string().url()).min(1, "Pelo menos 1 imagem é necessária"),
  features: z.array(z.string()).min(1),
  appreciation: z.string(),
  status: z.enum(["DISPONIVEL", "ULTIMAS_COTAS", "PRE_LANCAMENTO", "VENDIDO"]),
  highlight: z.boolean().default(false),
  published: z.boolean().default(false),
});

export const propertyUpdateSchema = propertyCreateSchema.partial();

export type PropertyCreateInput = z.infer<typeof propertyCreateSchema>;
export type PropertyUpdateInput = z.infer<typeof propertyUpdateSchema>;
