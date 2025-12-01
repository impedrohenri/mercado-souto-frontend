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

  const res = await axios.get(`${URL_API}/product/${Number(productId)}`)
  
  const produto = res.data

  return (
    <>
      <Header />

      <main className='flex flex-col md:pt-10 items-center '>
        <ProductDetails productId={productId} produto={produto}/>
      </main>
    </>
  )
}
