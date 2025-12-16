'use client'

import { SetStateAction, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, MapPin, Truck, MessageSquare, Repeat } from 'lucide-react'
import { toast } from 'sonner'

import { axiosInterceptor } from '@/services/axios'
import { useClienteStore } from '@/store/cliente'
import { Button } from '@/components/ui/button'
import Input from '@/components/Input/Input'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Header from '@/components/header/Header'

// Tipagens baseadas na API
interface Product {
  id: number
  title: string
  imageURL: string[]
  seller?: {
    id: number
    // A API de seller não retornou o nome explicitamente no schema, 
    // mas vamos assumir que o front trata ou que virá expandido futuramente
    name?: string
  }
}

interface OrderItem {
  id: number
  product: Product
  quantity: number
  unitPrice: number
}

interface Order {
  id: number
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELED'
  createdAt: string
  totalPrice: number
  orderItems: OrderItem[]
}

// Map de Cores e Textos para os Status
const statusMap = {
  PENDING: { label: 'Pagamento Pendente', color: 'text-yellow-600', sub: 'Aguardando confirmação' },
  PAID: { label: 'Preparando envio', color: 'text-blue-600', sub: 'Pagamento aprovado' },
  SHIPPED: { label: 'A caminho', color: 'text-blue-600', sub: 'Chega em breve' },
  DELIVERED: { label: 'Entregue', color: 'text-(--primary-green)', sub: 'Chegou no seu endereço' }, // Usando variável CSS ou hardcode verde
  CANCELED: { label: 'Cancelado', color: 'text-red-600', sub: 'Compra cancelada' },
}

export default function Orders() {
  const { client } = useClienteStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (client?.id) {
      fetchOrders()
    }
  }, [client])

  const fetchOrders = async () => {
    try {
      // GET /api/client/{clientId}/orders
      const response = await axiosInterceptor.get(`/client/${client?.id}/orders`)
      // Ordena do mais recente para o mais antigo
      const sorted = response.data.sort((a: Order, b: Order) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setOrders(sorted)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar pedidos.")
    } finally {
      setIsLoading(false)
    }
  }

  // Filtragem local pelo nome do produto
  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true
    return order.orderItems.some(item =>
      item.product.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Agrupamento por Data (Lógica visual da imagem "14 de dezembro")
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const dateKey = new Date(order.createdAt).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long'
    })
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(order)
    return acc
  }, {} as Record<string, Order[]>)

  if (isLoading) return <div className="flex justify-center p-10">Carregando compras...</div>

  return (
    <>
      <Header />
      <div className="bg-[#f5f5f5] min-h-screen pb-10">
        {/* Header / Barra de Busca */}
        <div className="bg-white shadow-sm py-4">
          <div className="container max-w-5xl mx-auto px-4">
            <h1 className="text-2xl font-normal text-gray-800 mb-6">Compras</h1>

            <div className="flex gap-4 items-center">
              <div className="relative w-full max-w-2xl">
                <Input

                  placeholder="Busque por compra, marca e mais..."
                  className="pl-10 h-12 rounded-lg shadow-sm border-gray-200"
                  value={searchTerm}
                  onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchTerm(e.target.value)} id={'search-input'} />
                <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
              </div>
              {/* Botões de filtro (Mock visual) */}
              <Button variant="outline" className="rounded-full hidden md:flex">Todas</Button>
              <Button variant="ghost" className="rounded-full hidden md:flex text-gray-500">A receber</Button>
            </div>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="container max-w-5xl mx-auto px-4 mt-6 space-y-8">
          {Object.keys(groupedOrders).length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              Nenhuma compra encontrada.
            </div>
          ) : (
            Object.entries(groupedOrders).map(([date, ordersInDate]) => (
              <div key={date}>
                {/* Cabeçalho da Data */}
                <h2 className="text-lg font-medium text-gray-800 mb-4 ml-1 capitalize">{date}</h2>

                <div className="space-y-4">
                  {ordersInDate.map((order) => {
                    const statusInfo = statusMap[order.status] || statusMap.PENDING

                    return (
                      <Card key={order.id} className="border-none shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                          {order.orderItems.map((item, index) => (
                            <div key={item.id} className={`${index > 0 ? 'border-t border-gray-100' : ''} p-6`}>
                              <div className="flex flex-col md:flex-row gap-6">

                                {/* Imagem do Produto */}
                                <div className="w-24 h-24 relative shrink-0 border border-gray-100 rounded-md bg-white">
                                  <Image
                                    src={item.product.imageURL?.[0] || '/placeholder.png'}
                                    alt={item.product.title}
                                    fill
                                    className="object-contain p-2"
                                  />
                                </div>

                                {/* Info Principal */}
                                <div className="flex-1 min-w-0">
                                  <div className={`font-medium mb-1 ${statusInfo.color === 'text-(--primary-green)' ? 'text-green-600' : statusInfo.color}`}>
                                    {statusInfo.label}
                                    {order.status === 'SHIPPED' && <Truck size={16} className="inline ml-2" />}
                                  </div>
                                  <p className="text-gray-500 text-sm mb-2">{statusInfo.sub}</p>

                                  <Link href={`/product/${item.product.id}`} className="hover:underline">
                                    <h3 className="font-medium text-gray-800 line-clamp-2 text-base">
                                      {item.product.title}
                                    </h3>
                                  </Link>
                                  <p className="text-gray-400 text-sm mt-1">
                                    {item.quantity} {item.quantity === 1 ? 'unidade' : 'unidades'}
                                  </p>
                                </div>

                                {/* Coluna do Vendedor / Ações */}
                                <div className="md:w-56 flex flex-col gap-2 md:items-end md:text-right">
                                  <div className="text-xs text-gray-500 mb-2">
                                    <span className="block font-medium text-gray-700">
                                      {item.product.seller?.name || "Vendedor Parceiro"}
                                    </span>
                                    <button className="text-blue-500 hover:text-blue-700 flex items-center gap-1 md:justify-end w-full">
                                      Enviar mensagem
                                    </button>
                                  </div>

                                  <Button className="w-full bg-(--primary-blue) hover:bg-blue-700 text-white font-medium h-9 text-sm">
                                    Ver compra
                                  </Button>
                                  <Button variant="secondary" className="w-full bg-blue-50 text-(--primary-blue) hover:bg-blue-100 border-none font-medium h-9 text-sm">
                                    Comprar novamente
                                  </Button>
                                </div>

                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}