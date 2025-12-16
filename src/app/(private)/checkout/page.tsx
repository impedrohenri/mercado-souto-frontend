'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { Loader2, MapPin, Plus } from 'lucide-react'

import { axiosInterceptor } from '@/services/axios'
import { useClienteStore } from '@/store/cliente'
import Button from '@/components/Button/Button' // Ajuste o import conforme seu projeto
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Header from '@/components/header/Header'

// Tipagens baseadas na sua API
interface Address {
    id: number
    street: string
    number: string
    complement: string
    cep: string
    city?: string // A API não retornou city no schema, mas é comum ter
    state?: string
}

interface OrderItemSummary {
    id: number // ID do produto
    title: string
    price: number
    quantity: number
    image: string
}

export default function Checkout() {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    // Stores e Estados
    const { client, cart } = useClienteStore()
    const [addresses, setAddresses] = useState<Address[]>([])
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
    
    // Estado do Resumo do Pedido
    const [orderItems, setOrderItems] = useState<OrderItemSummary[]>([])
    const [totalPrice, setTotalPrice] = useState(0)
    
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Captura parametros da URL
    const type = searchParams.get('type') // 'direct' ou null
    const productIdParam = searchParams.get('productId')
    const quantityParam = searchParams.get('quantity')

    // 1. Carregar Endereços e Dados do Pedido
    useEffect(() => {
        if (!client?.id) {
            // Se não tiver client logado, manda pro login
            // router.push('/login') 
            // return
        }

        const loadData = async () => {
            setIsLoadingData(true)
            try {
                // A. Buscar Endereços do Client
                const addressRes = await axiosInterceptor.get(`/address/by-client/${client?.id}`)
                setAddresses(addressRes.data)
                // Seleciona o primeiro endereço automaticamente se existir
                if (addressRes.data.length > 0) {
                    setSelectedAddressId(addressRes.data[0].id)
                }

                // B. Determinar o que está sendo comprado
                if (type === 'direct' && productIdParam) {
                    // --- MODO COMPRA DIRETA ---
                    const productRes = await axiosInterceptor.get(`/product/${productIdParam}`)
                    const product = productRes.data
                    const qtd = parseInt(quantityParam || '1')

                    setOrderItems([{
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image: product.imageURL ? product.imageURL[0] : '',
                        quantity: qtd
                    }])
                    setTotalPrice(product.price * qtd)

                } else if (cart?.id) {
                    // --- MODO CARRINHO ---
                    // Recarrega o carrinho para garantir dados frescos
                    const cartRes = await axiosInterceptor.get(`/cart/${cart.id}`)
                    const cartData = cartRes.data
                    
                    const itemsFormatted = cartData.items.map((item: any) => ({
                        id: item.product.id,
                        title: item.product.title,
                        price: item.product.price, // ou item.unitPrice
                        image: item.product.imageURL ? item.product.imageURL[0] : '',
                        quantity: item.quantity
                    }))

                    setOrderItems(itemsFormatted)
                    setTotalPrice(cartData.totalPrice)
                }
            } catch (error) {
                console.error("Erro ao carregar checkout:", error)
                toast.error("Erro ao carregar informações do pedido.")
            } finally {
                setIsLoadingData(false)
            }
        }

        if (client?.id) {
            loadData()
        }
    }, [client, cart, type, productIdParam, quantityParam])

    // 2. Finalizar Compra
    const handleFinishOrder = async () => {
        if (!selectedAddressId) {
            toast.warning("Por favor, selecione um endereço de entrega.")
            return
        }

        setIsSubmitting(true)

        try {
            let response;

            if (type === 'direct' && productIdParam) {
                // Endpoint: POST /api/order/product/{productId}/address/{clientAddressId}
                // Body: { quantity: number }
                response = await axiosInterceptor.post(
                    `/order/product/${productIdParam}/address/${selectedAddressId}`,
                    { quantity: parseInt(quantityParam || '1') }
                )
            } else {
                // Endpoint: POST /api/order/cart/{cartId}/address/{clientAddressId}
                // Body: Vazio (usa o estado do carrinho)
                if(!cart?.id) return;
                response = await axiosInterceptor.post(
                    `/order/cart/${cart.id}/address/${selectedAddressId}`
                )
            }

            toast.success("Pedido realizado com sucesso!")


            router.push('/minhas-compras')

        } catch (error) {
            console.error("Erro ao finalizar:", error)
            toast.error("Não foi possível finalizar o pedido. Tente novamente.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoadingData) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8 text-(--primary-blue)">Finalizar Compra</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- COLUNA DA ESQUERDA: ENDEREÇO --- */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Endereço de Entrega</CardTitle>
                            <Link href="/endereco/add">
                                <Button variant="secondary" className="text-sm text-primary flex gap-2 items-center">
                                    <Plus size={16} /> Novo Endereço
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {addresses.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Nenhum endereço cadastrado.</p>
                                    <Link href="/endereco/add" className="text-primary underline mt-2 inline-block">
                                        Cadastrar agora
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            onClick={() => setSelectedAddressId(addr.id)}
                                            className={`
                                                cursor-pointer border-2 rounded-lg p-4 transition-all relative
                                                ${selectedAddressId === addr.id 
                                                    ? 'border-(--primary-blue) bg-blue-50/50' 
                                                    : 'border-gray-200 hover:border-gray-300'}
                                            `}
                                        >
                                            <div className="flex items-start gap-3">
                                                <MapPin className={`mt-1 ${selectedAddressId === addr.id ? 'text-(--primary-blue)' : 'text-gray-400'}`} size={20} />
                                                <div>
                                                    <p className="font-semibold text-gray-800">
                                                        {addr.street}, {addr.number}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {addr.complement && `${addr.complement} - `} {addr.cep}
                                                    </p>
                                                    {selectedAddressId === addr.id && (
                                                        <span className="absolute top-2 right-2 flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-(--primary-blue)"></span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Itens do Pedido</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {orderItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 py-2">
                                        <div className="h-20 w-20 relative bg-gray-100 rounded-md overflow-hidden shrink-0">
                                            {item.image ? (
                                                <Image src={item.image} alt={item.title} fill className="object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400 text-xs">Sem foto</div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium line-clamp-2">{item.title}</h3>
                                            <div className="flex justify-between items-end mt-2">
                                                <p className="text-gray-500 text-sm">Qtd: {item.quantity}</p>
                                                <p className="font-semibold text-lg">
                                                    R$ {(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* --- COLUNA DA DIREITA: RESUMO --- */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle>Resumo da Compra</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span>R$ {totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Frete</span>
                                <span className="text-(--primary-green) font-medium">Grátis</span>
                            </div>
                            
                            <Separator />
                            
                            <div className="flex justify-between text-xl font-bold text-(--primary-blue)">
                                <span>Total</span>
                                <span>R$ {totalPrice.toFixed(2)}</span>
                            </div>

                            <Button 
                                onClick={handleFinishOrder} 
                                disabled={isSubmitting || addresses.length === 0}
                                className="w-full mt-6 py-6 text-lg"
                                variant="primary"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" /> Processando...
                                    </span>
                                ) : (
                                    "Confirmar Pedido"
                                )}
                            </Button>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                Ao confirmar, você concorda com nossos Termos de Serviço e Política de Privacidade.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
        </>
    )
}