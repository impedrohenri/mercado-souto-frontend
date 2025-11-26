import z from "zod";

const isEmailAlreadyUsed = (email: string): boolean =>{

    return true
}

export const signUpFormSchema = z.object({
    name: z
        .string({message: "Campo obrigatório."})
        .min(5, "O nome deve ter ao menos 5 letras.")
        .max(70, "Limite de 70 caracteres."),
    email: z
        .email("E-mail inválido!")
        .refine((email) => isEmailAlreadyUsed(email), "Email já cadastrado."),
    phone: z
        .string({message: "Campo obrigatório."}).nonempty("Campo obrigatório.").min(14, "Número de telefone inválido."),
    cpf: z
        .string({message: "Campo obrigatório."}).min(14, "O CPF deve ter 11 números"),
    password: z
        .string({message: "Campo obrigatório."})
        .min(8, "A senha deve ter no mínimo 8 caracteres")
        .max(50, "A senha deve conter menos de 51 caracteres"),
    confirmPassword: z.
        string({message: "Campo obrigatório."}),
}).refine(data => data.password === data.confirmPassword, {message: "As senhas não coincidem", path: ['confirmPassword']})

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;