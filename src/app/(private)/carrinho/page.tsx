'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Minus, Plus, Store, Check } from 'lucide-react' // Ícones sugeridos (instale lucide-react ou use font-awesome)
import { toast } from 'sonner'

import { Button } from '@/components/ui/button' // Ajuste o import conforme seu UI kit
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox' // Se não tiver, use um input type='checkbox' nativo
import { Separator } from '@/components/ui/separator'

import { axiosInterceptor } from '@/services/axios'
import { useClienteStore } from '@/store/cliente'
import Header from '@/components/header/Header'

// --- Tipos baseados na documentação da API ---
interface Seller {
  id: number;
  cnpj: string;
  sales: number;
  balance: number;
  // Assumindo que o Seller pode ter um nome/fantasia vindo de algum lugar, 
  // caso contrário usaremos o ID ou buscaremos dados extras.
  // O JSON de Product retorna o objeto Seller completo.
}

interface Product {
  id: number;
  title: string;
  price: number;
  imageURL: string[];
  stock: number;
  seller: Seller;
}

interface CartItem {
  id: number;
  isSelected: boolean;
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Cart {
  id: number;
  items: CartItem[];
  totalPrice: number;
}

export default function Carrinho() {
  const router = useRouter();
  const { cart: cartStore } = useClienteStore();
  const [cartData, setCartData] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega o carrinho ao montar
  useEffect(() => {
    fetchCart();
  }, [cartStore?.id]);

  const fetchCart = async () => {
    if (!cartStore?.id) return;
    try {
      setIsLoading(true);
      const response = await axiosInterceptor.get(`/cart/${cartStore.id}`);
      setCartData(response.data);
    } catch (error) {
      console.error("Erro ao buscar carrinho", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Atualiza quantidade (POST /api/cart/{cartId}/product/{productId})
  // Obs: A API usa POST para adicionar ou ATUALIZAR quantidade
  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (!cartData) return;
    if (newQuantity < 1) return;

    try {
      // Optimistic Update ou Loading por item seria ideal aqui
      const response = await axiosInterceptor.post(`/cart/${cartData.id}/product/${productId}`, {
        quantity: newQuantity
      });
      // A API retorna o carrinho atualizado
      setCartData(response.data);
    } catch (error) {
      toast.error("Erro ao atualizar quantidade.");
    }
  };

  // Remove item (DELETE /api/cart/{cartId}/product/{productId})
  const handleRemoveItem = async (productId: number) => {
    if (!cartData) return;
    try {
      const response = await axiosInterceptor.delete(`/cart/${cartData.id}/product/${productId}`);
      setCartData(response.data);
      toast.success("Item removido.");
    } catch (error) {
      toast.error("Erro ao remover item.");
    }
  };

  // Selecionar Item (PUT /api/cart/{cartId}/product/{productId})
  const handleToggleSelect = async (productId: number) => {
    if (!cartData) return;
    try {
      const response = await axiosInterceptor.put(`/cart/${cartData.id}/product/${productId}`);
      setCartData(response.data);
    } catch (error) {
      toast.error("Erro ao selecionar item.");
    }
  };

  // Agrupar itens por Vendedor (Seller) para ficar igual ao Mercado Livre
  const groupedItems = cartData?.items.reduce((acc, item) => {
    const sellerId = item.product.seller?.id || 0;
    if (!acc[sellerId]) {
      acc[sellerId] = [];
    }
    acc[sellerId].push(item);
    return acc;
  }, {} as Record<number, CartItem[]>) || {};

  if (!cartStore?.id) {
    return <div className="p-10 text-center">Faça login para ver seu carrinho.</div>;
  }

  if (isLoading && !cartData) {
    return <div className="p-10 text-center">Carregando carrinho...</div>;
  }

  const totalItems = cartData?.items.filter(i => i.isSelected).length || 0;
  const totalPrice = cartData?.totalPrice || 0;

  return (
    <>
      <Header />
      <div className="bg-[#f5f5f5] min-h-screen pb-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* COLUNA DA ESQUERDA - LISTA DE PRODUTOS */}
            <div className="w-full lg:w-9/12 space-y-4">

              {/* Se carrinho vazio */}
              {cartData?.items.length === 0 && (
                <Card className="p-10 text-center">
                  <h2 className="text-xl font-semibold">Seu carrinho está vazio</h2>
                  <Link href="/" className="text-blue-500 mt-4 inline-block">Ver produtos</Link>
                </Card>
              )}

              {/* Lista Agrupada por Vendedor */}
              {Object.keys(groupedItems).map((sellerId) => {
                const items = groupedItems[Number(sellerId)];
                // Como o objeto Seller é simples, pegamos o ID. 
                // Em um cenário real, você buscaria o nome do vendedor.

                return (
                  <Card key={sellerId} className="overflow-hidden border-none shadow-sm">
                    {/* Cabeçalho do Vendedor */}
                    <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                      <Store className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-sm text-gray-700">Produtos do vendedor #{sellerId}</span>
                      <span className="text-xs text-blue-500 cursor-pointer ml-auto">Ver mais produtos deste vendedor</span>
                    </div>

                    <CardContent className="p-0">
                      {items.map((item, index) => (
                        <div key={item.id}>
                          <div className="p-6 flex flex-col sm:flex-row gap-4 items-start relative">

                            {/* Checkbox de seleção */}
                            <div className="pt-2">
                              <Checkbox
                                checked={item.isSelected}
                                onCheckedChange={() => handleToggleSelect(item.product.id)}
                              />
                            </div>

                            {/* Imagem do Produto */}
                            <div className="w-20 h-20 relative shrink-0 border rounded bg-gray-50">
                              {item.product.imageURL && item.product.imageURL[0] ? (
                                <Image
                                  src={item.product.imageURL[0]}
                                  alt={item.product.title}
                                  fill
                                  className="object-contain p-1"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sem foto</div>
                              )}
                            </div>

                            {/* Detalhes do Produto */}
                            <div className="grow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 pr-4">
                                    {item.product.title}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-black text-white px-1.5 py-0.5 rounded font-bold italic">FULL</span>
                                    <span className="text-xs text-green-600 font-medium">Frete Grátis</span>
                                  </div>
                                </div>

                                {/* Botão Excluir (Mobile fica ruim aqui, ideal media query, mas seguindo layout desktop) */}
                                <button
                                  onClick={() => handleRemoveItem(item.product.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors absolute top-6 right-4 sm:static"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>

                              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">

                                {/* Controle de Quantidade */}
                                <div className="flex items-center border rounded-md shadow-sm bg-white">
                                  <button
                                    className="px-3 py-1 text-blue-600 disabled:text-gray-300"
                                    disabled={item.quantity <= 1}
                                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <div className="px-2 w-10 text-center text-sm font-medium">{item.quantity}</div>
                                  <button
                                    className="px-3 py-1 text-blue-600 disabled:text-gray-300"
                                    disabled={item.quantity >= item.product.stock}
                                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* Preço */}
                                <div className="text-right">
                                  {/* Simulação de preço antigo se houvesse promoção */}
                                  {/* <p className="text-xs text-gray-400 line-through">R$ {(item.unitPrice * 1.2).toFixed(2)}</p> */}
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-xs text-gray-500">{item.quantity}x R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                  </div>
                                  <p className="text-xl font-light text-gray-900">
                                    R$ {item.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Separador entre itens, exceto o último */}
                          {index < items.length - 1 && <Separator />}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* COLUNA DA DIREITA - RESUMO */}
            <div className="w-full lg:w-3/12">
              <Card className="sticky top-4 shadow-sm border-none">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold border-b pb-4 mb-4">Resumo da compra</h2>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Produtos ({totalItems})</span>
                      <span>R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frete</span>
                      {/* A API não retornou frete no objeto Cart, assumindo Grátis conforme imagem */}
                      <span className="text-green-600">Grátis</span>
                    </div>

                    {/* Cupom (Visual Only) */}
                    <div className="py-2 text-blue-500 cursor-pointer text-xs font-medium">
                      Inserir código do cupom
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-base font-semibold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-gray-900">R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <Button
                      className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => router.push('/checkout')} // Ajuste a rota
                    >
                      Continuar a compra
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}