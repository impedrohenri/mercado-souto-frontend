import Image from 'next/image'
import Link from 'next/link'

import Button from '../Button/Button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { DropdownMenuSeparator } from '../ui/dropdown-menu';


export default function Header() {

    return (
        <div className='flex flex-col bg-(--primary-yellow) w-full px-2.5 pt-2 shadow-sm'>
            <div className='flex flex-col mx-auto w-full max-w-[1180px] gap-y-3'>

                <div className='flex justify-between flex-wrap gap-y-3'>
                    <Link href={`/`}>
                        <Image src={"/static/images/logo/ml_logo.svg"} width={400} height={400} alt='logo' className='h-10 w-fit order-1' />
                    </Link>

                    <form action="" className='relative h-10 w-[90%] md:w-[50%] order-3 md:order-1 mx-auto'>
                        <InputGroup className="bg-background h-10 rounded-none shadow-md border-none outline-none pr-2">
                            <InputGroupInput placeholder="buscar" />
                            <InputGroupAddon align="inline-end" className="w-10 h-full p-0">
                                <Button variant='secondary' className='w-full h-full rounded-none!'> <i className="fa fa-search mx-auto"></i></Button>
                            </InputGroupAddon>
                        </InputGroup>


                    </form>

                    <div className='relative order-2 w-96 float-end'>
                        <Image src={"/static/images/meli_plus_badge.webp"} fill alt='' className='object-contain h-10' />
                    </div>
                </div>

                <div className='flex h-10'>
                    <div className='flex mx-auto h-full'>

                        <Link href={'#'}><div className="h-full px-3 flex items-center hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!">Ofertas</div></Link>
                        <Link href={'#'}><div className="h-full px-3 flex items-center hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!">Moda</div></Link>
                        <Link href={'#'}><div className="h-full px-3 flex items-center hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!">Eletrônicos</div></Link>
                        <Link href={'#'}><div className="h-full px-3 flex items-center hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!">Beleza</div></Link>
                        <Link href={'#'}><div className="h-full px-3 flex items-center hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!">Pet</div></Link>

                    </div>

                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className='flex text-sm align-middle text-center cursor-pointer h-full px-2 items-center hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!'>
                                    <span className='rounded-full bg-gray-100 p-1.5 me-1 text-[12px]'>A1</span>
                                    <span className='p-1'>Perfil <i className="fa fa-chevron-down text-[12px] ms-1"></i></span>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 z-50 bg-white outline-none text-(--text-secondary!) shadow-xl shadow-gray-500/35 rounded-sm border" align="start" >
                                <DropdownMenuItem className='outline-none'>
                                    <Link href={"/perfil"} className='flex align-middle p-2 hover:bg-gray-100'>
                                        <span className='rounded-full bg-gray-100 text-xl p-1.5 me-1 border'>A1</span>
                                        <div>
                                            <div className='font-medium ms-1'>Perfil</div>
                                            <div className='text-sm ms-1'>Meu Perfil</div>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href={""} className='flex text-sm align-middle p-2 hover:bg-gray-100 text-(--text-primary)!'>
                                        Compras
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href={"/anuncie"} className='flex text-sm align-middle p-2 hover:bg-gray-100 text-(--text-primary)!'>
                                        Vender
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href={""} className='flex text-sm align-middle p-2 hover:bg-gray-100 text-(--text-primary)!'>
                                        Sair
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div>
                        <Link href={'/minhas-compras'}>
                            <span className='flex h-full px-2 items-center text-sm hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!'>Compras</span>
                        </Link>
                    </div>


                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <span className='flex h-full px-2 items-center text-sm hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!'>Favoritos <i className="fa fa-chevron-down text-[12px] ms-1"></i></span>
                            </DropdownMenuTrigger>
                        </DropdownMenu>
                    </div>

                    <div>
                        <Link href={'/carrinho'}>
                            <span className='flex h-full px-2 items-center text-sm hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!'>
                                <Image src={'/static/images/icons/cart-shopping-light-full.svg'} width={20} height={20} alt='' />
                            </span>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}
