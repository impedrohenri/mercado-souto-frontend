import Header from '@/components/header/Header'
import { Card } from '@/components/ui/card'
import ProductForm from './_components/ProductForm'

export default function CadastrarProduto() {


  return (
    <>
      <Header />
      <main className='flex flex-col md:pt-10 items-center '>
        <span className='text-2xl md:text-3xl font-semibold text-(--text-primary) md:w-[70vw] my-5 ps-4'>Preencha os dados do produto</span>
        <Card className='w-[95%] md:w-[70%] rounded-sm'>
          <ProductForm />
        </Card>
      </main>
    </>
  )
}
