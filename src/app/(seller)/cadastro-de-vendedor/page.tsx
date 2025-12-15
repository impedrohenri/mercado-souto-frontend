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
import { useClienteStore } from "@/store/cliente";


export default function CnpjForm() {

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { clientId } = useAuthStore();
  const { setClient } = useClienteStore();

  const { control, handleSubmit, setError } = useForm<CnpjFormSchema>({
    resolver: zodResolver(cnpjFormSchema),
    defaultValues: {
      cnpj: "",
    }
  });

  const onHandleSubmit = async (data: CnpjFormSchema) => {
    setIsLoading(true);
    try {

      await axiosInterceptor.post(`/seller/${clientId}`, { cnpj: data.cnpj });

      const clientData = await axiosInterceptor.get(`client/${clientId}`);
      setClient(clientData.data);
      document.cookie = `user@roles=${clientData.data.user.authorities.map((role: any) => role.name)
        .join(',')}; path=/`;

      router.push('/anuncie');

    } catch (error: any) {

      if (error.response?.status === 409) {
        setError("cnpj", {
          message: "Já existe um vendedor cadastrado com este CNPJ."
        });
      } else if (error.response?.status === 400) {
        setError("cnpj", {
          message: "CNPJ inválido. Verifique e tente novamente."
        });
      } else {
        setError("cnpj", {
          message: "Ocorreu um erro inesperado. Tente novamente."
        });
      }
      return;
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