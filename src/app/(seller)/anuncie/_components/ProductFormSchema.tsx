import z, { number } from "zod";

const AttributeSchema = z.object({
    id: z.string().min(1, "A chave é obrigatória."),
    text: z.string().min(1, "O valor é obrigatório.")
});

const SimplifiedSpecGroupSchema = z.object({
    title: z.string().min(1, "O título do tópico é obrigatório."),
    attributes: z.array(AttributeSchema).max(15, "Máximo de 15 atributos por tópico."),
});

export const productFormSchema = z.object({
    productImage: z
        .file("Selecione uma imagem para o produto"),
    title: z
        .string({message: "Informe um título válido"})
        .nonempty({message: "Informe um título válido"})
        .min(5, "O título deve ter ao menos 5 caracteres")
        .max(100, "O título deve ter no máximo 100 caracteres"),
    description: z
        .string({message: "Informe uma descrição válida"})
        .nonempty({message: "Informe uma descrição válida"})
        .min(20, "A descrição deve ter ao menos 20 caracteres")
        .max(3000, "A descrição deve ter no máximo 3000 caracteres"),
    idCategory: z
        .number("Selecione uma categoria"),
    price: z
        .number("Informe o valor do produto").min(0.01, "O valor do produto deve ser maior que 0"),
    stock: z
        .number("Informe uma quantidade válida").min(1, "O numero de produtos em estoque deve ser maior que 0"),
    specifications: z
    .array(SimplifiedSpecGroupSchema)
    .max(15, "Máximo de 15 tópicos permitidos.")
    .optional(),
        
})

export type ProductFormSchema = z.infer<typeof productFormSchema>;
export type SimplifiedSpecGroup = z.infer<typeof SimplifiedSpecGroupSchema>;
export type Attribute = z.infer<typeof AttributeSchema>;