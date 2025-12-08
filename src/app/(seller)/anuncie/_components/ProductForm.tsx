'use client'

import Button from '@/components/Button/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { FieldInput } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import ImagePreview from './ImagePreview';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductFormSchema, productFormSchema, SimplifiedSpecGroup } from './ProductFormSchema';
import { URL_API } from '@/api/index.routes';
import axios from 'axios'
import AttributeFields from './AttributesFields';
import { axiosInterceptor } from '@/services/axios';

interface IPicture {
    file: File,
    image: string
}

interface ICategories{
    id: number,
    name: string
}


export default function ProductForm() {

    const [picture, setPicture] = useState<IPicture>({} as IPicture);
    const [categories, setCategories] = useState<ICategories[]>([]);
    const [loading, setLoading] = useState<boolean>(false)

    const { control, handleSubmit } = useForm<ProductFormSchema>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            title: "",
            description: "",
            productImage: "" as unknown as File,
            price: "" as unknown as number,
            stock: "" as unknown as number,
            idCategory: "" as unknown as number,
            specifications: []
        }
    })

    const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
        control,
        name: "specifications",
    });


    useEffect(() => {
        axiosInterceptor.get(`${URL_API}/category`)
        .then((resp) => {
            setCategories(resp.data)
        })

        console.log(categories)
    }, [])

    const onHandleSubmit = async (data: any) => {

        const productImage = data.productImage
        let formData = new FormData();
        formData.append("image", productImage)
        delete data.productImage;
        const productData = data

        productData.specification = JSON.stringify(data.specifications);
        delete productData.specifications;


        try {
            setLoading(true)
            const sellerId = 1;

            const response = await axiosInterceptor.post(`${URL_API}/product/${sellerId}`, productData)
            
            const productId = response.data.id
            
            const imageResponse = await axiosInterceptor.post(`${URL_API}/product/image/${productId}`, formData)

        } catch (err) {
            
        } finally {
            setLoading(false)
        }


    }

    return (
        <>
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
                                min={1}
                                step={1}
                                id={field.name}
                                {...field}
                                aria-invalid={fieldState.invalid}
                                className=''
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                        </Field>)
                        } />

                    <Controller name='idCategory' control={control}
                        render={({ field, fieldState }) =>
                        (<Field className='flex flex-col w-full md:w-[40%]'>
                            <FieldLabel className='font-semibold text-md'>Categoria</FieldLabel>
                            <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {categories.map((cat) => {
                                            return <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                        })}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                        </Field>)
                        } />

                    <div className='flex flex-col w-full md:w-[40%]'>
                    </div>

                </div>

                <hr className='w-[90%] md:my-6' />

                <div className='w-full'>
                    <h2 className='text-xl font-semibold mb-4'>Especificações Técnicas</h2>
                    <div className='flex flex-col w-[90%] mx-auto gap-6'>
                        {specFields.map((item, index) => (
                            <Card key={item.id} className="p-4 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <Controller
                                        control={control}
                                        name={`specifications.${index}.title`}
                                        render={({ field, fieldState }) => (
                                            <Field className='w-full mr-4'>
                                                <FieldLabel className='text-lg font-medium'>Tópico {index + 1}</FieldLabel>
                                                <FieldInput {...field} placeholder="Ex: Características Gerais" />
                                                {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                                            </Field>
                                        )}
                                    />
                                    <Button type="button" onClick={() => removeSpec(index)} variant="secondary" className="p-2 text-red-500! hover:text-red-700! h-10 mt-7">
                                        <i className='fa fa-trash'></i>
                                    </Button>
                                </div>
                                
                                <AttributeFields groupIndex={index} control={control} />
                            </Card>
                        ))}
                        {specFields.length < 15 && (
                            <Button 
                                type="button"
                                variant="secondary"
                                className='px-4 py-3 mx-auto'
                            onClick={() => appendSpec({ 
                                title: '', 
                                attributes: [{ id: '', text: '' }]
                            } as SimplifiedSpecGroup)}>
                                + Adicionar Especificações
                            </Button>
                        )}
                    </div>
                </div>
                

            </CardContent>
            <CardFooter>
                
                <Button variant="primary" onClick={handleSubmit(onHandleSubmit)} className='px-5 py-2 ms-auto' disabled={loading}>
                    {loading? "Cadastrando...": "Cadastrar"}
                </Button>
            </CardFooter>
        </>
    )
}
