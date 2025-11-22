'use client'

import Button from '@/components/Button/Button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { recoverAccountForm, RecoverAccountFormSchema } from './RecoverAccountFormSchema'
import { FieldInput } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export default function RecoverAccountForm() {

  const router = useRouter();

  const {control, handleSubmit} = useForm<RecoverAccountFormSchema>({
    resolver: zodResolver(recoverAccountForm),
      defaultValues: {
        email: ""
      }
    })
  
  const onHandleSubmit = (data: object) => {
    console.log(data);
  }
  
  return (
    <form onSubmit={handleSubmit(onHandleSubmit)} className='flex flex-col gap-4'> 
      <Controller name='email' control={control}
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>E-mail ou telefone</FieldLabel>
              <FieldInput type="email" id={field.name} {...field} aria-invalid={fieldState.invalid} placeholder="E-mail"/>
              {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
            </Field>
          )}
        />
      <Button variant='primary' type="submit" className='py-3 mt-3'>Continuar</Button>  
      <Button variant="secondary" type="button" className='py-3 mt-3' onClick={() => {router.push("/login")}}>Voltar</Button>  
    </form>
  )
}
