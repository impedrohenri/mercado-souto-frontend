import Header from '@/components/header/Header'
import { Card } from '@/components/ui/card'
import ProductForm from '../_components/ProductForm'

interface InfoParams {
  params: Promise<{
    productId: string;
  }>;
}

export default async function Produto({ params }: InfoParams) {
  const { productId } = await params;


  return (
    <>
      <Header />
      <main className='flex flex-col md:pt-10 items-center '>
        <span className='text-2xl md:text-3xl font-semibold text-(--text-primary) md:w-[70vw] my-5 ps-4'>
            Editar produto
        </span>
        <Card className='w-[95%] md:w-[70%] rounded-sm'>
          {/* Passa o ID recebido da URL para o formulário */}
          <ProductForm productId={productId} />
        </Card>
      </main>
    </>
  )
}