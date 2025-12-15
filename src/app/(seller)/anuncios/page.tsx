'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, MoreVertical, Edit, Trash2, Plus, PackageOpen } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from '@/components/ui/separator'

import { axiosInterceptor } from '@/services/axios'
// Supondo que você tenha um hook ou store para pegar o ID do vendedor logado
// Se o usuário logado for um cliente que virou vendedor, o ID pode estar no token ou user store
import { useClienteStore } from '@/store/cliente'
import Input from '@/components/Input/Input'
import Header from '@/components/header/Header'

// Tipagem baseada na API
interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  imageURL: string[];
  // O endpoint by-seller retorna a lista de produtos
}

export default function Anuncios() {
  const router = useRouter();
  const { seller } = useClienteStore(); // Ajuste conforme seu gerenciamento de estado

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');


  const [sellerId, setSellerId] = useState<number | null>(null);



  useEffect(() => {
    if (seller?.id) {
      setSellerId(seller.id);
    }
  }, [seller]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInterceptor.get(`/product/by-seller/${sellerId}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar anúncios", error);
      toast.error("Não foi possível carregar seus anúncios.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sellerId) {
      fetchProducts();
    }
  }, [sellerId]);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este anúncio?")) return;

    try {
      await axiosInterceptor.delete(`/product/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Anúncio excluído com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir", error);
      toast.error("Erro ao excluir o anúncio.");
    }
  };

  const handleEdit = (id: number) => {
    // Redireciona para a página de edição (reaproveitando o formulário de 'anuncie')
    router.push(`/anuncie/${id}`);
  };

  // Filtragem local (a API tem busca global, mas para "meus produtos" é melhor filtrar no front se a lista não for gigante)
  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Cabeçalho */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-light text-gray-800">Anúncios</h1>
            <Button
              onClick={() => router.push('/anuncie')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
            >
              <Plus className="w-4 h-4 mr-2" /> Anunciar
            </Button>
          </div>

          {/* Barra de Filtros e Resumo (Estilo Dashboard) */}
          <Card className="p-4 border-none shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <Input
                type="text"
                id="search"
                placeholder="Buscar em seus anúncios..."
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900">{products.length}</span> ativos
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900">
                  {products.filter(p => p.stock === 0).length}
                </span> sem estoque
              </div>
            </div>
          </Card>

          {/* Lista de Produtos */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden min-h-[400px]">
            {/* Header da Tabela (Visual) */}
            <div className="hidden md:flex bg-gray-50 border-b px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="w-1/2">Produto</div>
              <div className="w-1/6">Preço</div>
              <div className="w-1/6">Estoque</div>
              <div className="w-1/6 text-right">Ações</div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-40 text-gray-500">
                Carregando seus anúncios...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <PackageOpen className="w-12 h-12 mb-2 opacity-20" />
                <p>Nenhum anúncio encontrado. {JSON.stringify(seller)}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors group">
                    <div className="flex flex-col md:flex-row items-center gap-4">

                      {/* Coluna Produto: Imagem + Titulo + Status */}
                      <div className="w-full md:w-1/2 flex items-start gap-4">
                        <div className="w-16 h-16 relative shrink-0 border rounded bg-white">
                          {product.imageURL && product.imageURL[0] ? (
                            <Image
                              src={product.imageURL[0]}
                              alt={product.title}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">Sem foto</div>
                          )}
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {product.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">#{product.id}</p>

                          {/* Status Visual baseado no Estoque */}
                          <div className="mt-2 flex items-center gap-2">
                            {product.stock > 0 ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Ativo
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Pausado (Sem estoque)
                              </span>
                            )}
                            {/* Simulação visual de status de exposição */}
                            <span className="text-xs text-orange-500 hidden group-hover:inline-block cursor-pointer">
                              Melhorar exposição
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Coluna Preço */}
                      <div className="w-full md:w-1/6 flex md:block justify-between">
                        <span className="md:hidden text-sm text-gray-500">Preço:</span>
                        <span className="text-sm text-gray-900 font-medium">
                          R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Coluna Estoque */}
                      <div className="w-full md:w-1/6 flex md:block justify-between">
                        <span className="md:hidden text-sm text-gray-500">Estoque:</span>
                        <span className="text-sm text-gray-700">
                          {product.stock} <span className="text-xs text-gray-400">unid.</span>
                        </span>
                      </div>

                      {/* Coluna Ações */}
                      <div className="w-full md:w-1/6 flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                              <Edit className="mr-2 h-4 w-4" /> Modificar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}