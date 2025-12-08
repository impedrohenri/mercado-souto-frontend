'use client'

import Button from '@/components/Button/Button'

import { Controller, useForm } from 'react-hook-form';
import { SignUpFormSchema, signUpFormSchema } from './SignUpFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { FieldInput } from '@/components/ui/input';
import { cpfMask, phoneMask } from '@/utils/inputMasks';
import Link from 'next/link';
import { URL_API } from '@/api/index.routes';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner"
import { Toaster } from '@/components/ui/sonner';

export default function SignUpForm() {

  const router = useRouter();

  const {control, handleSubmit, setError} = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      phone: "",
      name: "",
      cpf: "",
      password: "",
      confirmPassword: ""
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onHandleSubmit = async (data: SignUpFormSchema) => {
    setIsLoading(true)
    setApiError(null)

    try {
      const payload = {
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        phone: data.phone,
        password: data.password,
      }

      const response = await axios.post(`${URL_API}/client`, payload);
      const userData = response.data;

      localStorage.setItem('user@clientId', userData.clientId);
      localStorage.setItem('user@token', userData.token);
      localStorage.setItem('user@roles', JSON.stringify(userData.roles));


      toast.success("Cadastro realizado com sucesso!");

      setTimeout(()=>{
        router.push('/');
      }, 1000)

    } catch (error: any) {

      if (error.response) {
        setApiError(error.response.data?.message || "Erro ao registrar usuário.")
      }

      if (error.status === 500 && error.response?.data?.includes("username")) {
        setError("email", {
          type: "server",
          message: "Este e-mail já está cadastrado."
        })
        toast.error("Este e-mail já está cadastrado.")

        return

      } else if (error.status === 500 && error.response?.data?.includes("cpf")) {
        setError("cpf", {
          type: "server",
          message: "Este cpf já está cadastrado."
        })
        toast.error("Este cpf já está cadastrado.")
        
        return
      }

      setApiError(error.response?.data)
      toast.error("Erro: " + String(error.message))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onHandleSubmit)} className='flex flex-col gap-y-3'>
      <Toaster position="top-center"/>

      <Controller name='email' control={control} render={({field, fieldState}) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>E-mail</FieldLabel>
          <FieldInput type="email" id={field.name} {...field} aria-invalid={fieldState.invalid} placeholder='exemplo@email.com'/>
          {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
        </Field>
      )}/>
      
      <Controller name='phone' control={control} render={({field, fieldState}) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Telefone</FieldLabel>
          <FieldInput type="numeric" id={field.name} {...field} aria-invalid={fieldState.invalid} onChange={(e) => field.onChange(phoneMask(e.target.value))} required maxLength={15} placeholder="(00) 0000-0000"/>
          {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
        </Field>
      )}/>

      <Controller name='name' control={control} render={({field, fieldState}) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Nome</FieldLabel>
          <FieldInput type="text" id={field.name} {...field} aria-invalid={fieldState.invalid}/>
          {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
        </Field>
      )}/>

      <Controller name='cpf' control={control} render={({field, fieldState}) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>CPF</FieldLabel>
          <FieldInput type="text" id={field.name} {...field} aria-invalid={fieldState.invalid} onChange={(e) => field.onChange(cpfMask(e.target.value))} placeholder='000.000.000-00'/>
          {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
        </Field>
      )}/>

      <Controller name='password' control={control} render={({field, fieldState}) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Senha</FieldLabel>
          <FieldInput type='password' id={field.name} {...field} aria-invalid={fieldState.invalid}/>
          {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
        </Field>
      )}/>

      <Controller name='confirmPassword' control={control} render={({field, fieldState}) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Confirmar senha</FieldLabel>
          <FieldInput type='password' id={field.name} {...field} aria-invalid={fieldState.invalid}/>
          {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
        </Field>
      )}/>

      <span className='text-sm py-4'>Ao "Continuar", aceito os <Link href="/termos-e-condicoes">Termos e condições</Link> e autorizo o uso dos meus dados de acordo com a <Link href="/declaracao-de-privacidade">Declaração de privacidade.</Link></span>

      <Button type='submit' variant='primary' className='py-3 mt-2' disabled={isLoading}>
        {isLoading ? "Enviando..." : "Continuar"}
      </Button>
      <Button variant='secondary' type="button" className="py-3 font-medium" onClick={() => { router.push('/login') }}>
        Fazer login
      </Button>
      
    </form>
  )
}
