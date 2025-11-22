'use client'

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { loginFormSchema, LoginFormSchema } from "./LoginFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldInput } from "@/components/ui/input";
import Link from "next/link";


export default function LoginForm() {

  const router = useRouter();

  const {control, handleSubmit} = useForm<LoginFormSchema>({
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        email: "",
        password: ""
      }
    });

  const onHandleSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <>
      <form noValidate onSubmit={handleSubmit(onHandleSubmit)} className='flex flex-col gap-4'>
        <Controller name='email' control={control}
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>E-mail ou telefone</FieldLabel>
              <FieldInput type="email" id={field.name} {...field} aria-invalid={fieldState.invalid} placeholder="E-mail"/>
              {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
            </Field>
          )}
        />

        <Controller name='password' control={control}
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Senha</FieldLabel>
              <FieldInput type="password" id={field.name} {...field} aria-invalid={fieldState.invalid} placeholder="Senha"/>
              {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
            </Field>
          )}
        />

        <Link href="/recuperar-senha" className="text-sm">Esqueceu a senha?</Link>

        <Button variant='primary' type="submit" className="py-3 mt-2 font-bold">Continuar</Button>
        <Button variant='secondary' type="button" className="py-3 font-medium" onClick={() => { router.push('/cadastro') }}>Criar conta</Button>
      </form>
    </>
  )
}
