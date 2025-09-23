import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  remember: z.boolean(),
});

export type loginFormValues = z.infer<typeof loginSchema>;
