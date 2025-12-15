'use client'

import React, { useEffect, useState } from 'react'
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { axiosInterceptor } from '@/services/axios'
import { useClienteStore } from '@/store/cliente'
import Header from '@/components/header/Header'

// Interface baseada estritamente no retorno de /api/seller/{id}
interface SellerData {
  id: number;
  cnpj: string;
  sales: number;
  balance: number;
}

export default function Vendas() {
  const { client } = useClienteStore();

  const [sellerData, setSellerData] = useState<SellerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Recupera o ID do vendedor do contexto do cliente
  const sellerId = client?.seller?.id || 1;

  useEffect(() => {
    fetchSellerData();
  }, [sellerId]);

  const fetchSellerData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInterceptor.get(`/seller/${sellerId}`);
      setSellerData(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do vendedor", error);
      toast.error("Não foi possível carregar os dados de vendas.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-light text-gray-800">Painel de Vendas</h1>
            <p className="text-gray-500 text-sm mt-1">Visão geral do desempenho da sua loja.</p>
          </div>

          {/* Cards de Métricas - Dados 100% da API */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1: Saldo (Balance) */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Saldo Total
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
                ) : (
                  <>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(sellerData?.balance || 0)}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Valor acumulado em conta
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Card 2: Quantidade de Vendas (Sales) */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Vendas Realizadas
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                ) : (
                  <>
                    <div className="text-2xl font-bold text-gray-900">
                      {sellerData?.sales || 0}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Total de pedidos processados
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Card 3: Ticket Médio (Calculado no Front com dados da API) */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Ticket Médio
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
                ) : (
                  <>
                    <div className="text-2xl font-bold text-gray-900">
                      {sellerData && sellerData.sales > 0
                        ? formatCurrency(sellerData.balance / sellerData.sales)
                        : "R$ 0,00"}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Média por venda
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Aviso Informativo sobre o histórico */}
          {!isLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Sobre o histórico detalhado</h3>
                <p className="text-sm text-blue-700 mt-1">
                  No momento, o sistema exibe apenas os dados consolidados de saldo e total de vendas.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}