'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, ArrowLeft } from 'lucide-react'
import axios from 'axios' // Axios puro para o ViaCEP

import { axiosInterceptor } from '@/services/axios' // Seu axios configurado
import { useClienteStore } from '@/store/cliente'
import Button from '@/components/Button/Button'
import Input from '@/components/Input/Input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import Header from '@/components/header/Header'


const addressSchema = z.object({
    cep: z.string().regex(/^\d{5}-?\d{3}$/, "Formato inválido (00000-000)"),
    street: z.string().min(3, "Mínimo de 3 caracteres").max(150),
    number: z.string().min(1, "Obrigatório").max(10),
    complement: z.string().max(50).optional(),
    additionalInfo: z.string().max(100).optional(),
    contactName: z.string().min(5, "Mínimo de 5 caracteres").max(70),
    contactPhone: z.string().min(11, "Mínimo de 11 dígitos (DDD + 9)").max(16),
    home: z.boolean(), // <--- MUDANÇA AQUI: Apenas z.boolean()
})

type AddressFormValues = z.infer<typeof addressSchema>

export default function Endereco() {
    const router = useRouter()
    const { client } = useClienteStore()
    const [loadingCep, setLoadingCep] = useState(false)

    // Redireciona se não estiver logado
    if (!client?.id && typeof window !== 'undefined') {
        router.push('/login')
    }

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            home: true,
            complement: '',
            additionalInfo: '',
            contactName: client?.name || '', // Já preenche com o nome do usuário se tiver
            contactPhone: ''
        }
    })

    const { register, handleSubmit, setValue, getValues, setFocus, formState: { errors, isSubmitting } } = form

    // 2. Função para Buscar CEP (ViaCEP)
    const handleBlurCep = async () => {
        const cep = getValues('cep')?.replace(/\D/g, '')

        if (cep?.length === 8) {
            setLoadingCep(true)
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)

                if (response.data.erro) {
                    toast.error("CEP não encontrado.")
                    return
                }

                setValue('street', response.data.logradouro)
                setFocus('number')
            } catch (error) {
                console.error(error)
                toast.error("Erro ao buscar CEP.")
            } finally {
                setLoadingCep(false)
            }
        }
    }

    // 3. Envio para sua API
    const onSubmit = async (data: AddressFormValues) => {
        if (!client?.id) return;

        try {
            // Endpoint: POST /api/address/{idClient}
            await axiosInterceptor.post(`/address/${client.id}`, {
                ...data,
                // Garante formatação correta se necessário
                contactPhone: data.contactPhone.replace(/\D/g, '')
            })

            toast.success("Endereço cadastrado com sucesso!")

            // Volta para a página anterior (útil se veio do checkout)
            router.back()

        } catch (error) {
            console.error(error)
            toast.error("Erro ao salvar endereço.")
        }
    }

    return (
        <>
            <Header />

            <div className="container max-w-2xl mx-auto py-10 px-4">
                <Button variant="secondary" onClick={() => router.back()} className="mb-4 pl-0 hover:bg-transparent hover:text-primary/80">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl text-(--primary-blue)">Novo Endereço</CardTitle>
                        <CardDescription>
                            Preencha os dados abaixo para entrega.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* --- CEP --- */}
                            <div className="space-y-2">
                                <Label htmlFor="cep">CEP</Label>
                                <div className="relative">
                                    <Input
                                        id="cep"
                                        placeholder="00000-000"
                                        maxLength={9}
                                        {...register('cep')}
                                        onBlur={handleBlurCep}
                                        className={errors.cep ? "border-red-500" : ""}
                                    />
                                    {loadingCep && (
                                        <div className="absolute right-3 top-3">
                                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                {errors.cep && <p className="text-red-500 text-xs">{errors.cep.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* --- RUA --- */}
                                <div className="md:col-span-3 space-y-2">
                                    <Label htmlFor="street">Logradouro (Rua, Av...)</Label>
                                    <Input id="street" {...register('street')} className={errors.street ? "border-red-500" : ""} />
                                    {errors.street && <p className="text-red-500 text-xs">{errors.street.message}</p>}
                                </div>

                                {/* --- NÚMERO --- */}
                                <div className="md:col-span-1 space-y-2">
                                    <Label htmlFor="number">Número</Label>
                                    <Input id="number" {...register('number')} className={errors.number ? "border-red-500" : ""} />
                                    {errors.number && <p className="text-red-500 text-xs">{errors.number.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* --- COMPLEMENTO --- */}
                                <div className="space-y-2">
                                    <Label htmlFor="complement">Complemento <span className="text-gray-400 font-normal">(Opcional)</span></Label>
                                    <Input id="complement" placeholder="Apto 101, Bloco B" {...register('complement')} />
                                </div>

                                {/* --- INFO ADICIONAL --- */}
                                <div className="space-y-2">
                                    <Label htmlFor="additionalInfo">Ponto de Referência <span className="text-gray-400 font-normal">(Opcional)</span></Label>
                                    <Input id="additionalInfo" placeholder="Próximo ao mercado..." {...register('additionalInfo')} />
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <h3 className="font-medium mb-4 text-gray-700">Quem irá receber?</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* --- NOME CONTATO --- */}
                                    <div className="space-y-2">
                                        <Label htmlFor="contactName">Nome do Destinatário</Label>
                                        <Input id="contactName" {...register('contactName')} className={errors.contactName ? "border-red-500" : ""} />
                                        {errors.contactName && <p className="text-red-500 text-xs">{errors.contactName.message}</p>}
                                    </div>

                                    {/* --- TELEFONE CONTATO --- */}
                                    <div className="space-y-2">
                                        <Label htmlFor="contactPhone">Telefone de Contato</Label>
                                        <Input
                                            id="contactPhone"
                                            placeholder="(11) 99999-9999"
                                            {...register('contactPhone')}
                                            className={errors.contactPhone ? "border-red-500" : ""}
                                        />
                                        {errors.contactPhone && <p className="text-red-500 text-xs">{errors.contactPhone.message}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* --- TIPO (CHECKBOX) --- */}
                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="home"
                                    checked={form.watch('home')}
                                    onCheckedChange={(checked) => setValue('home', checked as boolean)}
                                />
                                <label
                                    htmlFor="home"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Este é um endereço residencial
                                </label>
                            </div>

                            <Button variant='primary' type="submit" className="w-full mt-6 py-6 text-lg" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                                    </>
                                ) : (
                                    'Salvar Endereço'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}