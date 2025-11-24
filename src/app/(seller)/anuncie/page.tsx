'use client'

import Header from '@/components/header/Header'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { FieldInput } from '@/components/ui/input'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { productFormSchema, ProductFormSchema } from './_components/ProductFormSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import ImagePreview from './_components/ImagePreview'
import { Textarea } from '@/components/ui/textarea'
import Button from '@/components/Button/Button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from '@/components/ui/select'


interface IPicture {
  file: File,
  image: string
}

const categorias = [
  {categoryId: "1", name: "Comida"},
  {categoryId: "2", name: "Eletrônicos"},
  {categoryId: "3", name: "Brinquedos"},
  {categoryId: "4", name: "Jogos de Mesa"},
  {categoryId: "5", name: "Automóveis"},
]

export default function CadastrarProduto() {

  const [picture, setPicture] = useState<IPicture>({} as IPicture);

  const { control, handleSubmit } = useForm<ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      description: "",
      productImage: "" as unknown as File,
      price: "" as unknown as number,
      stock: "" as unknown as number,
      categoryId: "" as unknown as number
    }
  })

  const onHandleSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <>
      <Header />
      <main className='flex flex-col md:pt-10 items-center '>
        <span className='text-2xl md:text-3xl font-semibold text-(--text-primary) md:w-[70vw] my-5 ps-4'>Preencha os dados do produto</span>
        <Card className='w-[95%] md:w-[70%] rounded-sm'>
          <CardHeader className='border-b gap-0'>
            <span className='text-lg text-(--text-primary) font-semibold'>Dados principais</span>
            <span className='text-(--text-secondary)'>Preecha o formulário abaixo com os principais dados do produto</span>
          </CardHeader>
          <CardContent className='flex flex-wrap justify-center md:justify-evenly gap-y-8 gap-x-8'>

            <div className='w-[90%] md:w-fit '>
              <Controller name='productImage' control={control}
                render={({ field, fieldState }) =>
                (<Field className='flex flex-col justify-center items-center relative text-center text-(--primary-blue) border hover:bg-(--terciary-blue) rounded-xl'>
                  <FieldInput type='file'
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className='w-[30%] h-64 relative z-20 opacity-0 cursor-pointer border'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                      if (file) setPicture({ file, image: URL.createObjectURL(file) })
                    }} />

                  <ImagePreview image={picture.image} />
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>)
                } />
            </div>

            <div className='flex flex-col gap-y-6 w-full md:w-[400px] '>
              <Controller name='title' control={control}
                render={({ field, fieldState }) =>
                (<Field className='flex flex-col'>
                  <FieldLabel className='font-semibold text-md'>Nome do Produto</FieldLabel>
                  <FieldInput type='text'
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className=''
                  />
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>)
                } />

              <Controller name='description' control={control}
                render={({ field, fieldState }) =>
                (<Field className='flex flex-col'>
                  <FieldLabel className='font-semibold text-md'>Descrição</FieldLabel>
                  <Textarea
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className='max-h-36'
                  />
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>)
                } />

            </div>

            <hr className='w-[90%] md:my-6' />

            <div className='flex flex-wrap justify-around w-full gap-y-6'>
              <Controller name='price' control={control}
                render={({ field, fieldState }) =>
                (<Field className='flex flex-col w-full md:w-[40%]'>
                  <FieldLabel className='font-semibold text-md'>Preço</FieldLabel>
                  <FieldInput type='number' step="00.01" min={0.01}
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className=''
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>)
                } />

              <Controller name='stock' control={control}
                render={({ field, fieldState }) =>
                (<Field className='flex flex-col w-full md:w-[40%]'>
                  <FieldLabel className='font-semibold text-md'>Quantidade</FieldLabel>
                  <FieldInput type='number'
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className=''
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>)
                } />

              <Controller name='categoryId' control={control}
                render={({ field, fieldState }) =>
                (<Field className='flex flex-col w-full md:w-[40%]'>
                  <FieldLabel className='font-semibold text-md'>Categoria</FieldLabel>
                  <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categorias.map((cat) => {
                      return <SelectItem value={cat.categoryId}>{cat.name}</SelectItem>
                      })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>)
                } />
            </div>

          </CardContent>
          <CardFooter>
            <Button variant="primary" onClick={handleSubmit(onHandleSubmit)} className='px-5 py-2 ms-auto'>
              Cadastrar
            </Button>
          </CardFooter>
        </Card>
      </main>
    </>
  )
}
