'use client'

import Button from '@/components/Button/Button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Ratings from '@/utils/ratings';
import { ProductFormSchema } from '@/app/(seller)/anuncie/_components/ProductFormSchema'
import Link from 'next/link';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SpecificationsTables from '@/components/SpecsTable/SpecificationsTable';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { axiosInterceptor } from '@/services/axios';
import { useClienteStore } from '@/store/cliente';
import { toast } from 'sonner';

interface IProps {
    productId: string
    produto: ProductFormSchema
}

export default function ProductDetails({ productId, produto }: IProps) {
    const router = useRouter();
    const [verMais, setVerMais] = useState(false);

    const [quantity, setQuantity] = useState<string>("1");
    // Separei os estados de loading para não travar os dois botões ao mesmo tempo
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);

    const { cart, setCart } = useClienteStore();

    // Fluxo de Compra Direta
    const handleBuyNow = () => {
        // 1. Verificação de Login (usando a existência do carrinho/cliente como proxy)
        if (!cart?.id) {
            toast.error("Você precisa estar logado para realizar uma compra.");
            // Opcional: router.push('/login');
            return;
        }

        setIsBuyingNow(true);

        try {

            const queryParams = new URLSearchParams({
                productId: productId,
                quantity: quantity,
                type: 'direct'
            }).toString();

            router.push(`/checkout?${queryParams}`);

        } catch (error) {
            console.error("Erro ao redirecionar:", error);
            setIsBuyingNow(false);
        }
    };

    const handleAddToCart = async () => {
        if (!cart?.id) {
            toast.error("Você precisa estar logado para adicionar itens ao carrinho.");
            return;
        }

        setIsAddingToCart(true);

        try {
            // Endpoint documentado: POST /api/cart/{cartId}/product/{productId}
            await axiosInterceptor.post(`/cart/${cart.id}/product/${productId}`, { quantity: parseInt(quantity) });
            const cartRes = await axiosInterceptor.get(`/cart/${cart.id}`);
            setCart(cartRes.data);
            toast.success("Produto adicionado ao carrinho com sucesso!");
        } catch (error) {
            toast.error("Erro ao adicionar ao carrinho. \nVerfique se está logado e tente novamente.");
        } finally {
            setIsAddingToCart(false);
        }
    };

    const availableQuantity = Math.min(produto.stock, 10);
    const quantityOptions = Array.from({ length: availableQuantity }, (_, i) => (i + 1).toString());

    const parsedSpecifications = (() => {
        try {
            return JSON.parse(produto.specification || '[]');
        } catch (e) {
            return [];
        }
    })();

    return (
        <Card className='w-[90%]'>
            <CardContent className='flex flex-wrap justify-around pt-10 '>
                {/* ... (parte da imagem e descrição mantida igual) ... */}
                <div className='flex flex-wrap lg:w-7/12'>
                    <div className='w-full md:w-[50%]'>
                        {!!produto.imageURL ? <Image src={produto.imageURL[0] || "/"} alt="" width={1000} height={1000} className='w-full' /> : null}
                    </div>

                    <div className='w-full md:w-[50%] px-4'>
                        <h1 className='font-semibold text-2xl'>{produto.title}</h1>
                        <p className='mt-3'>{produto?.rate} <Ratings rating={produto.rate || 0} /></p>
                        <p className='text-4xl text-primary mt-3'>R$ {produto.price}</p>
                        <p className={`mt-5 text-(--text-secondary) text-sm line-clamp-6 lg:line-clamp-none ${verMais ? 'line-clamp-none' : ''}`}>{produto.description}</p>
                        <div className='mt-2'>
                            <button className='text-(--primary-blue) font-medium' onClick={() => setVerMais(!verMais)}>
                                {verMais ? 'Ver menos' : 'Ver mais'}
                            </button>
                        </div>
                    </div>

                    <div className='flex flex-wrap justify-between w-full'>
                        <SpecificationsTables specifications={parsedSpecifications} className='w-full sm:w-[46%] mx-auto mt-6' />
                    </div>
                </div>

                <div className='w-full lg:w-3/12 min-w-[300px] border rounded-xl p-5 py-8 mt-8 lg:mt-0 '>
                    <span className='bg-(--primary-green) rounded-[5px] text-md font-medium text-white px-3.5 py-0.5 pb-1'>FRETE GRÁTIS</span>

                    <p className='text-lg text-primary mt-5'>
                        <span className='text-(--primary-green) font-medium -xl'>Chegará grátis amanhã</span> <span className='text-xl'>por ser sua primeira compra</span><br />
                        <span className='text-(--text-secondary)'>Comprando dentro das próximas</span> <br />
                        <span className=''>12 h 21 min</span><br />
                        <Link href={"/"}>Mais detalhes e formas de entrega</Link>
                    </p>

                    <p className='text-lg text-primary mt-5'>
                        <span className='text-(--primary-green) font-medium text-xl'>Retire grátis</span> <span className='text-xl'>entre amanhã e quarta-feira em uma agência Mercado Livre</span><br />
                        <span className='text-(--text-secondary)'>Comprando dentro das próximas</span> <br />
                        <span className=''>12 h 21 min</span><br />
                        <Link href={"#"}>Ver no mapa</Link>
                    </p>

                    <div className='text-primary text-xl mt-5'>
                        <span className='font-medium'>Estoque {produto.stock > 0 ? "disponível" : "indisponível"}</span>

                        <Select onValueChange={setQuantity} value={quantity} disabled={produto.stock === 0}>
                            <SelectTrigger className="w-full border-none shadow-none p-0 justify-start">
                                <span className='text-primary text-xl'>Quantidade:</span>
                                <SelectValue placeholder="1" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {quantityOptions.length > 0 ? quantityOptions.map((qtd) => (
                                        <SelectItem value={qtd} key={qtd}>
                                            <span className='text-primary text-xl font-medium border-s-(--primary-blue) border-s-4 rounded-md ps-2'>
                                                {qtd} {parseInt(qtd) === 1 ? 'unidade' : 'unidades'}
                                            </span>
                                        </SelectItem>
                                    )) : (
                                        <SelectItem value="0" disabled>Sem estoque</SelectItem>
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                    </div>

                    {/* BOTÃO COMPRAR AGORA ATUALIZADO */}
                    <Button
                        onClick={handleBuyNow}
                        variant='primary'
                        className='w-full py-4 text-xl font-medium mt-3 flex items-center justify-center gap-2'
                        disabled={produto.stock === 0 || isBuyingNow || isAddingToCart}
                    >
                        {isBuyingNow ? 'Indo para o checkout...' : 'Comprar agora'}
                    </Button>

                    {/* BOTÃO ADICIONAR AO CARRINHO ATUALIZADO */}
                    <Button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart || isBuyingNow || produto.stock === 0}
                        variant='secondary'
                        className='w-full py-4 text-xl text-(--primary-blue) font-medium bg-(--terciary-blue) mt-3 flex items-center justify-center gap-2'
                    >
                        {isAddingToCart ? (
                            <span>Adicionando...</span>
                        ) : (
                            <>
                                <i className='fa fa-cart-plus'></i> Adicionar ao carrinho
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}