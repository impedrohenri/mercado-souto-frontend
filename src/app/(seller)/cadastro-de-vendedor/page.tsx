'use client'
import Button from "@/components/Button/Button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { FieldInput } from "@/components/ui/input";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CnpjFormSchema, cnpjFormSchema } from "./_components/CnpjFormSchema";
import Header from "@/components/header/Header";
import { axiosInterceptor } from "@/services/axios";
import { useAuthStore } from "@/store/auth";
import { cnpjMask } from "@/utils/inputMasks";


export default function CnpjForm() {

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { clientId } = useAuthStore();

  const { control, handleSubmit, setError } = useForm<CnpjFormSchema>({
    resolver: zodResolver(cnpjFormSchema),
    defaultValues: {
      cnpj: "",
    }
  });

  const onHandleSubmit = async (data: CnpjFormSchema) => {
    setIsLoading(true);
    try {

      console.log("Client ID:", data);
      const res = axiosInterceptor.post(`/api/seller/${clientId}`, data)

      const response = (await res).data

      if (response.success) {

        console.log(response.message);
        router.push('/anuncie');
      } else {

        setError("cnpj", {
          message: "O CNPJ não foi encontrado ou está inválido. Tente novamente."
        });
      }

    } catch (error: any) {
      console.error(error);
      // Erro de rede ou servidor
      setError("cnpj", {
        message: "Ocorreu um erro inesperado. Tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className='flex flex-col  items-center h-screen bg-gray-100'>

        <h2 className='text-2xl font-normal text-center my-32'>
            Ops! parece que você ainda não é vendedor.
          </h2>

        <div className='bg-white p-8 rounded-lg shadow-xl w-full max-w-md'>

          <h2 className='text-lg font-normal text-center mb-6'>
            Qual é o número de CNPJ?
          </h2>

          <form noValidate onSubmit={handleSubmit(onHandleSubmit)} className='flex flex-col gap-6'>
            <Controller name='cnpj' control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                
                  <div className="flex flex-col">
                    <FieldInput
                      type="text"
                      id={field.name}
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="CNPJ"
                      onChange={(e) => {
                        field.onChange(cnpjMask(e.target.value));
                      }}
                      maxLength={18} 
                      inputMode="numeric"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Escreva apenas números, sem traços ou pontos.
                    </p>
                  </div>

                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>
              )}
            />

            <Button
              variant='primary'
              type="submit"
              className="py-3 mt-4 font-bold bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Validando..." : "Continuar"}
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}