import { z } from "zod";

const featureSchema = z.object({
  icon: z.string(),
  title: z.string(),
  desc: z.string(),
});

export const destinationCreateSchema = z.object({
  name: z.string().min(3),
  slug: z.string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug inválido"),
  state: z.string().min(2),
  emoji: z.string(),
  color: z.string().regex(/^from-\w+-\d+\s+to-\w+-\d+$/, "Cor inválida (ex: from-blue-500 to-cyan-400)"),
  subtitle: z.string().min(10),
  location: z.string().min(10),
  description: z.string().min(50),
  climate: z.string().min(20),
  lifestyle: z.string().min(20),
  features: z.array(featureSchema).min(4).max(4),
  appreciation: z.string(),
  published: z.boolean().default(false),
  order: z.number().int().nonnegative().default(0),
});

export const destinationUpdateSchema = destinationCreateSchema.partial();

export type DestinationCreateInput = z.infer<typeof destinationCreateSchema>;
export type DestinationUpdateInput = z.infer<typeof destinationUpdateSchema>;
