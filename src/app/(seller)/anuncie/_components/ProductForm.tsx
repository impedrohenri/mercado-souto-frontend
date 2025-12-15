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
import AttributeFields from './AttributesFields';
import { axiosInterceptor } from '@/services/axios';
import { useClienteStore } from '@/store/cliente';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { z } from 'zod'; // Importe o Zod aqui

interface IPicture {
    file: File | null,
    image: string
}

interface ICategories {
    id: number,
    name: string
}

interface ProductFormProps {
    productId?: string;
}

export default function ProductForm({ productId }: ProductFormProps) {

    const [picture, setPicture] = useState<IPicture>({ file: null, image: '' });
    const [categories, setCategories] = useState<ICategories[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter();

    const { seller } = useClienteStore();
    const [sellerId, setSellerId] = useState<number | null>(null);

    const isEditMode = !!productId;

    useEffect(() => {
        if (seller?.id) {
            setSellerId(seller.id);
        }
    }, [seller]);

    // --- CORREÇÃO DO SCHEMA ---
    // Se estiver editando, estendemos o schema original tornando a imagem opcional.
    // O .extend sobrescreve a regra do campo específico.
    const currentSchema = isEditMode
        ? productFormSchema.extend({
            productImage: z.any().optional(), 
          })
        : productFormSchema;

    const { control, handleSubmit, reset, formState: { errors } } = useForm<ProductFormSchema>({
        // Usamos o currentSchema que se adapta ao modo
        resolver: zodResolver(currentSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            productImage: undefined, 
            price: 0,
            stock: 0,
            idCategory: 0,
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
    }, [])

    useEffect(() => {
        if (isEditMode && productId) {
            setLoading(true);
            axiosInterceptor.get(`${URL_API}/product/${productId}`)
                .then((response) => {
                    const product = response.data;
                    
                    reset({
                        title: product.title,
                        description: product.description,
                        price: product.price,
                        stock: product.stock,
                        idCategory: product.category?.id, 
                        specifications: product.specification ? JSON.parse(product.specification) : [],
                    });

                    if (product.imageURL && product.imageURL.length > 0) {
                        setPicture({ file: null, image: product.imageURL[0] });
                    }
                })
                .catch((err) => {
                    console.error(err);
                    toast.error("Erro ao carregar dados do produto.");
                    router.push('/anuncios');
                })
                .finally(() => setLoading(false));
        }
    }, [isEditMode, productId, reset, router]);

    // Função auxiliar para debug de erros do formulário
    const onInvalid = (errors: any) => {
        console.error("Erros de validação do Zod:", errors);
        toast.warning("Verifique os campos obrigatórios.");
    }

    const onHandleSubmit = async (data: any) => {
        console.log("Submit iniciado com dados:", data);
        
        const productImage = data.productImage;
        let formData = new FormData();
        
        if (productImage instanceof File) {
            formData.append("image", productImage);
        }

        // Remove a imagem do payload JSON
        const payloadData = { ...data };
        delete payloadData.productImage;

        // Formatações
        payloadData.specification = JSON.stringify(data.specifications);
        // CUIDADO: Verifique se sua API espera description como string JSON ou texto puro.
        // Se for texto normal, remova a linha abaixo. Se for JSON, mantenha.
        // payloadData.description = JSON.stringify(data.description); 
        delete payloadData.specifications;

        if (payloadData.specification === "[]") {
            payloadData.specification = null;
        }

        try {
            setLoading(true);
            let currentProductId = productId;

            if (isEditMode) {
                // PUT
                await axiosInterceptor.put(`${URL_API}/product/${productId}`, payloadData);
                toast.success("Produto atualizado com sucesso!");
            } else {
                // POST
                const response = await axiosInterceptor.post(`${URL_API}/product/${sellerId}`, payloadData);
                currentProductId = response.data.id;
                toast.success("Produto cadastrado com sucesso!");
            }

            // Upload de imagem apenas se houver arquivo novo
            if (productImage instanceof File && currentProductId) {
                await axiosInterceptor.post(`${URL_API}/product/image/${currentProductId}`, formData);
            }

            // Redireciona sempre que der sucesso
            router.push('/anuncios');

        } catch (err) {
            console.error(err);
            toast.error(`Erro ao ${isEditMode ? 'atualizar' : 'cadastrar'} o produto.`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <CardHeader className='border-b gap-0'>
                <span className='text-lg text-(--text-primary) font-semibold'>
                    {isEditMode ? "Editar Dados" : "Dados principais"}
                </span>
                <span className='text-(--text-secondary)'>
                    {isEditMode ? "Atualize as informações do seu produto" : "Preencha o formulário abaixo com os principais dados do produto"}
                </span>
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
                            {/* Exibe erro se existir */}
                            {fieldState.error && <FieldError className='z-50 bg-amber-50 rounded-b-xl'>{fieldState.error.message}</FieldError>}
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
                            <Select 
                                value={field.value ? String(field.value) : undefined} 
                                onValueChange={(v) => field.onChange(Number(v))}
                            >
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
                {/* Adicionado onInvalid para mostrar erros no console se o submit não funcionar */}
                <Button 
                    variant="primary" 
                    onClick={handleSubmit(onHandleSubmit, onInvalid)} 
                    className='px-5 py-2 ms-auto' 
                    disabled={loading}
                >
                    {loading ? (isEditMode ? "Salvando..." : "Cadastrando...") : (isEditMode ? "Salvar Alterações" : "Cadastrar")}
                </Button>
            </CardFooter>
        </>
    )
}