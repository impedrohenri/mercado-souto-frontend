import { z } from "zod";


export const isCnpjValid = (cnpj: string): boolean => {
  return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(cnpj);
};


export const cnpjFormSchema = z.object({

  cnpj: z
    .string()
    .min(1, "O número do CNPJ é obrigatório.")
    .refine(isCnpjValid, "O CNPJ deve conter exatamente 14 números.")
});


export type CnpjFormSchema = z.infer<typeof cnpjFormSchema>;