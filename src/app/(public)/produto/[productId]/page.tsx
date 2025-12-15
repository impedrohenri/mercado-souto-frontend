import Header from '@/components/header/Header'
import ProductDetails from './_components/ProductDetails';
import axios from 'axios';
import { URL_API } from '@/api/index.routes';

interface InfoParams {
  params: Promise<{
    productId: string;
  }>;
}

export default async function Produto({ params }: InfoParams) {
  const { productId } = await params;

  // use fetch em vez de axios
  const res = await fetch(`${URL_API}/product/${Number(productId)}`)
  const produto = await res.json()


  return (
    <>
      <Header />

      <main className='flex flex-col md:pt-10 items-center '>
        <ProductDetails productId={productId} produto={produto} />
      </main>
    </>
  )
}
