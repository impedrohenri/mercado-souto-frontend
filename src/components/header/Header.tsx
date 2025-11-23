import Image from 'next/image'
import Link from 'next/link'

import Button from '../Button/Button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'


export default function Header() {

    return (
        <div className='flex flex-col bg-(--primary-yellow) w-screen px-2.5 pt-2 pb-3 shadow-sm'>
            <div className='flex flex-col mx-auto w-full max-w-[1180px] gap-y-3'>

                <div className='flex justify-between flex-wrap '>
                    <Link href={`/`}>
                        <Image src={"/static/images/logo/ml_logo.svg"} width={400} height={400} alt='logo' className='h-10 w-fit order-1' />
                    </Link>

                    <form action="" className='relative h-10 w-[90%] md:w-[50%] order-3 md:order-1 mx-auto'>
                        <InputGroup className="bg-background h-10 rounded-none shadow-md border-none outline-none pr-2">
                            <InputGroupInput placeholder="buscar"/>
                            <InputGroupAddon align="inline-end" className="w-10 h-full p-0">
                                <Button variant='secondary' className='w-full h-full rounded-none!'> <i className="fa fa-search mx-auto"></i></Button>
                            </InputGroupAddon>
                        </InputGroup>

                        
                    </form>

                    <Image src={"/static/images/logo/ml_logo.svg"} width={40} height={100} alt='' className='order-2' />
                </div>

                <div className='flex h-7'>
                    <div className='flex mx-auto h-full'>
                        <Link href={'#'}><div className='h-full px-3 hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!'>Ofertas</div></Link>
                        <Link href={'#'}><div className='h-full px-3 hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!'>Moda</div></Link>
                        <Link href={'#'}><div className='h-full px-3 hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!'>Eletrônicos</div></Link>
                        <Link href={'#'}><div className='h-full px-3 hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!'>Beleza</div></Link>
                        <Link href={'#'}><div className='h-full px-3 hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!'>Pet</div></Link>
                        
                    </div>
                </div>

            </div>
        </div>
    )
}
