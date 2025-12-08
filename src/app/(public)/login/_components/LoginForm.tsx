'use client'

import Button from "@/components/Button/Button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { loginFormSchema, LoginFormSchema } from "./LoginFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldInput } from "@/components/ui/input";
import Link from "next/link";
import axios from "axios";
import { URL_API } from "@/api/index.routes";
import { useState } from "react";


export default function LoginForm() {

  const [isLoading, setIsLoading] =  useState(false);

  const router = useRouter();

  const {control, handleSubmit, setError} = useForm<LoginFormSchema>({
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        email: "",
        password: ""
      }
    });

  const onHandleSubmit = async (data: LoginFormSchema) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${URL_API}/login`, data);

      const userData = res.data

      localStorage.setItem('user@clientId', userData.clientId);
      localStorage.setItem('user@token', userData.token);
      localStorage.setItem('user@roles', JSON.stringify(userData.roles));

      router.push('/');

    } catch (error: any) {

      
      if (error.response?.status === 401) {
        setError("email", { message: "E-mail ou senha incorretos." });
        return;
      }

      
      setError("email", {
        message: "Ocorreu um erro ao tentar fazer login. Tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

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

        <Button variant='primary' type="submit" className="py-3 mt-2 font-bold" disabled={isLoading}>{isLoading ? "Enviando..." : "Continuar"}</Button>
        <Button variant='secondary' type="button" className="py-3 font-medium" onClick={() => { router.push('/cadastro') }}>Criar conta</Button>
      </form>
    </>
  )
}
