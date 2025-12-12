import Image from 'next/image';
import { TProductResponse } from '@/types/Product';
import { useState, useEffect } from 'react';
import formatCurrency from "@/utils/formatCurrency";
import Link from 'next/link';


interface ProductCardProps {
    product: TProductResponse;

}

export default function ProductCard({ product }: ProductCardProps) {
    const [installmentPrice, setInstallmentPrice] = useState<string>('');
    const installmentCount = 2;

    useEffect(() => {
        const installmentValue = product.price / installmentCount;

        const formattedInstallment = formatCurrency(installmentValue);

        setInstallmentPrice(formattedInstallment.replace('R$', '').trim());
    }, [product.price]);


    const imageUrl = product.imageURL && product.imageURL.length > 0 ? product.imageURL[0] : '/placeholder.webp';
    const priceParts = product.price.toFixed(2).split('.');

    return (
        <div className=" bg-white overflow-hidden max-h-[480px] m-0">
            <Link href={`/produto/${product.id}`}>

                {/* 1. Imagem do Produto */}
                <div className="relative w-full h-48 mb-4">
                    <Image
                        src={imageUrl}
                        alt={product.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority 
                    />
                </div>

                {/* 2. Título */}
                <h2 className="text-sm font-normal text-gray-800 mb-2 leading-tight line-clamp-2 wrap-break-word">
                    {product.title}
                </h2>

                {/* 3. Preço Principal */}
                <div className="flex items-start mb-1 text-gray-800 font-medium">
                    <span className="text-2xl">
                        R$ {priceParts[0]}
                    </span>
                    
                    <span className="text-lg mt-0.5">
                        {priceParts[1]}
                    </span>
                </div>

                {/* 4. Parcelamento */}
                <p className="text-sm text-green-600 mb-3">
                    {installmentCount}x R$ {installmentPrice} sem juros
                </p>

                {/* 5. Tags/Benefícios */}
                <div className="space-y-px mb-2">

                    <div className="inline-block px-2 py-0.5 text-sm font-semibold text-(--primary-blue) bg-(--terciary-blue) rounded">
                        R$ 40 OFF Saldo no
                    </div>

                    {/* Tag Mercado Pago */}
                    <div className="inline-block px-2 py-0.5 text-sm font-semibold text-(--primary-blue) bg-(--terciary-blue) rounded">
                        Mercado Pago
                    </div>
                </div>

                {/* 6. Informação de Entrega */}
                <div className="mt-2">
                    <span className="inline-block px-2 py-0.5 text-sm font-bold text-(--primary-green) bg-green-100 rounded">
                        Chegará grátis amanhã
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                        por ser sua primeira compra
                    </p>
                </div>
            </Link>
        </div>
    );
}