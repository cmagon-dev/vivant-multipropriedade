import { z } from "zod";

export const userCreateSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  roleKey: z.string().min(1, "Role é obrigatório"),
  extraPermissionKeys: z.array(z.string()).optional().default([]),
});

export const userUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  roleKey: z.string().optional(),
  extraPermissionKeys: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  // Aceita string, null ou undefined; converte vazio para null e valida prefixo "/"
  defaultRoute: z
    .string()
    .nullable()
    .optional()
    .transform((s) =>
      s == null || String(s).trim() === "" ? null : String(s).trim()
    )
    .refine(
      (v) => v === null || v.startsWith("/"),
      "Rota deve começar com /"
    ),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
