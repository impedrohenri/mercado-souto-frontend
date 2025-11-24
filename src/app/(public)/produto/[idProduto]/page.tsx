import Header from '@/components/header/Header'
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import img from "../../../../../public/static/pendrive.jpg"
import Link from 'next/link';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Button from '@/components/Button/Button';
import Ratings from '@/utils/ratings';


interface InfoParams {
  params: Promise<{
    idProduto: string;
  }>;
}

export default async function Produto({ params }: InfoParams) {
  const { idProduto } = await params;

  const produto = {
    idProduto,
    title: "Pen Drive 64GB USB 3.2 Gen 1 SanDisk Ultra Fit SDCZ430-64G Velocidade de Leitura Até 130 MB/s Cor Preto",
    description: "Leve, discreto e com performance de alta velocidade — o Pendrive SanDisk Ultra Fit 32 GB é a solução ideal para quem precisa de armazenamento extra de forma prática e eficiente. Com conexão USB 3.1 Gen 1 (compatível com USB 3.0 e 2.0), esse pendrive oferece desempenho intenso sem ocupar espaço.",
    price: 57.23,
    stock: 50,
    categoryId: 2,
    imageUrl: "",
    rate: 4.8,

  }

  return (
    <>
      <Header />

      <main className='flex flex-col md:pt-10 items-center '>
        <Card className='w-[90%]'>
          <CardContent className='flex flex-wrap justify-around pt-10 '>
            <div className='w-full md:w-4/12'>
              <Image src={img} alt="" width={1000} height={1000} className='w-full' />
            </div>

            <div className='w-full md:w-4/12'>
              <h1 className='font-semibold text-2xl'>{produto.title}</h1>
              
              <p className='mt-3'>{produto.rate} <Ratings rating={produto.rate}/></p>

              <p className='text-4xl text-primary mt-3'>R$ {produto.price}</p>

              <p className='mt-5 text-(--text-secondary) text-lg'>{produto.description}</p>
            </div>

            <div className='w-full md:w-3/12 min-w-[300px] border rounded-xl p-5 py-8'>
              <span className='bg-(--primary-green) rounded-[5px] text-md font-medium text-white px-3.5 py-0.5 pb-1'>FRETE GRÁTIS</span>

              <p className='text-lg text-primary mt-5'>
                <span className='text-(--primary-green) font-medium  
                text-xl'>Chegará grátis amanhã</span> <span className=' 
                text-xl'>por ser sua primeira compra</span><br />
                <span className='text-(--text-secondary)'>Comprando dentro das próximas</span> <br />
                <span className=''>12 h 21 min</span><br />
                <Link href={"#"}>Mais detalhes e formas de entrega</Link>
              </p>

              <p className='text-lg text-primary mt-5'>
                <span className='text-(--primary-green) font-medium  
                text-xl'>Retire grátis</span> <span className=' 
                text-xl'>entre amanhã e quarta-feira em uma agência Mercado Livre</span><br />
                <span className='text-(--text-secondary)'>Comprando dentro das próximas</span> <br />
                <span className=''>12 h 21 min</span><br />
                <Link href={"#"}>Ver no mapa</Link>
              </p>

              <p className='text-primary text-xl mt-5'>
                <span className='font-medium'>Estoque {produto.stock > 0 ? "disponível" : "indiponível"}</span>

                
                
                  <Select>
                    <SelectTrigger className="w-full border-none shadow-none p-0 justify-start">
                        <span className='text-primary text-xl'>Quantidade:</span>

                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",].map((quantidade) => {
                          return <SelectItem value={quantidade} key={quantidade}><span className='text-primary text-xl font-medium border-s-(--primary-blue) border-s-4 rounded-md ps-2'>{quantidade} unidades</span></SelectItem>
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                
              </p>

              <Button variant='primary' className='w-full py-4 text-xl font-medium  mt-3'>
                Comprar agora
              </Button>

              <Button variant='secondary' className='w-full py-4 text-xl text-(--primary-blue) font-medium bg-(--terciary-blue) mt-3'>
                <i className='fa fa-cart-plus'></i> Adicionar ao carrinho
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
