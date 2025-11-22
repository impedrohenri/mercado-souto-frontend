import z from "zod";


export const loginFormSchema = z.object({
    email: z.email("Email inválido"),
    password: z.string({message: "Informe uma senha válida"}).nonempty({message: "Informe uma senha válida"})
})

export type LoginFormSchema = z.infer<typeof loginFormSchema>;