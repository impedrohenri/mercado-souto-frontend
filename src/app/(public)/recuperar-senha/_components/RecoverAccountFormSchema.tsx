import z from "zod";

export const recoverAccountForm = z.object({
    email: z.email("Email inválido"),
})

export type RecoverAccountFormSchema = z.infer<typeof recoverAccountForm>;