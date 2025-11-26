'use client'

import Button from '@/components/Button/Button'

import { Controller, useForm } from 'react-hook-form';
import { SignUpFormSchema, signUpFormSchema } from './SignUpFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { FieldInput } from '@/components/ui/input';
import { cpfMask, phoneMask } from '@/utils/inputMasks';
import Link from 'next/link';


export default function SignUpForm() {

  const {control, handleSubmit} = useForm<SignUpFormSchema>({
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

  
  const onHandleSubmit = (data: any) => {
    console.log(data)

    fetch('http://localhost:3000/users', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }


  return (
    <form noValidate onSubmit={handleSubmit(onHandleSubmit)} className='flex flex-col gap-y-3'>
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

      <Button type='submit' variant='primary' className='py-3 mt-2'>Continuar</Button>
    </form>
  )
}
