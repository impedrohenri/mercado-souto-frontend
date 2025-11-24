import z, { number } from "zod";


export const productFormSchema = z.object({
    productImage: z
        .file("Formato de arquivo inválido"),
    title: z
        .string({message: "Informe um título válido"})
        .nonempty({message: "Informe um título válido"})
        .min(5, "O título deve ter ao menos 5 caracteres")
        .max(50, "O título deve ter no máximo 50 caracteres"),
    description: z
        .string({message: "Informe uma descrição válida"})
        .nonempty({message: "Informe uma descrição válida"})
        .min(20, "A descrição deve ter ao menos 20 caracteres")
        .max(250, "A descrição deve ter no máximo 250 caracteres"),
    categoryId: z
        .number("Selecione uma categoria"),
    price: z
        .number("Informe o valor do produto").min(0.01, "O valor do produto deve ser maior que 0"),
    stock: z
        .number("Informe uma quantidade válida").min(1, "O numero de produtos em estoque deve ser maior que 0")
        
})

export type ProductFormSchema = z.infer<typeof productFormSchema>;