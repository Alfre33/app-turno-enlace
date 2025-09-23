import z from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "Ingresa tu nombre"),
    lastName: z.string().min(2, "Ingresa tu apellido"),
    email: z.string().email("Correo inválido"),
    phone: z
      .string()
      .min(10, "Teléfono de 10 dígitos")
      .max(15, "Demasiados dígitos"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirma tu contraseña"),
    accept: z.boolean().refine((v) => v, {
      message: "Debes aceptar los Términos y la Política",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

export type registerFormValues = z.infer<typeof registerSchema>;
