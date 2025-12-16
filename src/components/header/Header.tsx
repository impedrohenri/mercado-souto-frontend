'use client';

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react';

import Button from '../Button/Button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { URL_API } from '@/api/index.routes'
import { useAuthStore } from '@/store/auth'
import { useClienteStore } from '@/store/cliente';
import { TClientResponse } from '@/types/Client';


export default function Header() {

  const { token, clientId, clearAuth } = useAuthStore();
  // Precisamos recuperar o 'client' (estado atual) além da função 'setClient'
  const { client, setClient, cart } = useClienteStore();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [clientData, setClientData] = useState<TClientResponse>({} as TClientResponse);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const hasToken = document.cookie.includes('user@token');
    setIsAuthenticated(hasToken);

    if (!clientId) return;

    if (client?.id && (client.id === clientId)) {
        console.log("Usando dados do cache (Zustand):", client);
        setClientData(client); 
        return;
    }

    const loadClient = async () => {
      try {
        const res = await fetch(`${URL_API}/client/${clientId}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
        const data = await res.json();
        setClientData(data);
        setIsAuthenticated(document.cookie.includes('user@token'));
        setClient(data);

        console.log("Dados do cliente:", data);
      } catch (err) {
        console.error("Erro ao buscar cliente:", err);
      }
    };

    const cookieToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('user@token='))
      ?.split('=')[1];

    if (!!cookieToken) {
      loadClient();
      return;
    }

  }, [clientId]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const logout = () => {
    clearAuth();
    localStorage.clear();
    document.cookie = `user@token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    window.location.href = '/login';
  };

  return (
    <div className='flex flex-col bg-(--primary-yellow) w-full px-2.5 pt-2 shadow-sm'>
      <div className='flex flex-col mx-auto w-full max-w-[1180px] gap-y-3'>

        {/* Linha de cima */}
        <div className='flex justify-between flex-wrap gap-y-3'>
          <Link href={`/`}>
            <Image src={"/static/images/logo/ml_logo.svg"} width={400} height={400} alt='logo' className='h-10 w-fit order-1' />
          </Link>

          <form action="" className='relative h-10 w-[90%] md:w-[50%] order-3 md:order-1 mx-auto'>
            <InputGroup className="bg-background h-10 rounded-none shadow-md border-none outline-none pr-2">
              <InputGroupInput placeholder="buscar" />
              <InputGroupAddon align="inline-end" className="w-10 h-full p-0">
                <Button variant='secondary' className='w-full h-full rounded-none!'>
                  <i className="fa fa-search mx-auto"></i>
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </form>

          <div className='relative order-2 w-96 float-end'>
            <Image src={"/static/images/meli_plus_badge.webp"} fill alt='' className='object-contain h-10' />
          </div>
        </div>

        {/* Linha de baixo */}
        <div className='flex h-10'>
          <div className='mx-auto h-full hidden md:flex gap-1 md:gap-3'>

            <Link href={'#'}><div className="h-full px-3 flex items-center hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!">Ofertas</div></Link>
            <Link href={'#'}><div className="h-full px-3 flex items-center hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!">Moda</div></Link>
            <Link href={'#'}><div className="h-full px-3 flex items-center hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!">Eletrônicos</div></Link>
            <Link href={'#'}><div className="h-full px-3 flex items-center hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!">Beleza</div></Link>
            <Link href={'#'}><div className="h-full px-3 flex items-center hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!">Pet</div></Link>

          </div>


          <div>
            <DropdownMenu>
              {isAuthenticated ? (
                <>
                  <DropdownMenuTrigger asChild>
                    <div className='flex text-sm align-middle text-center cursor-pointer h-full px-2 items-center hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!'>
                      <span className='rounded-full bg-gray-100 p-1.5 me-1 text-[12px]'>{String(clientData?.name).trim().split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()}</span>
                      <span className='p-1'>
                        Perfil <i className="fa fa-chevron-down text-[12px] ms-1"></i>
                      </span>
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-64 z-50 bg-white outline-none text-(--text-secondary!) shadow-xl shadow-gray-500/35 rounded-sm border" align="start" >

                    <Link href={"/perfil"} className='flex align-middle p-2 hover:bg-gray-100'>
                      <DropdownMenuItem className='outline-none'>
                        <span className='rounded-full bg-gray-100 text-xl p-1.5 me-1 border'>{String(clientData?.name).trim().split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()}</span>
                        <div>
                          <div className='font-medium ms-1'>{String(clientData?.name).split(" ")[0]}</div>
                          <div className='text-sm ms-1'>Meu Perfil</div>
                        </div>
                      </DropdownMenuItem>
                    </Link>

                    <DropdownMenuSeparator />

                    <Link href={""} className='flex text-sm align-middle p-2 hover:bg-gray-100 text-(--text-primary)!'>
                      <DropdownMenuItem>
                        Compras
                      </DropdownMenuItem>
                    </Link>

                    <DropdownMenuSeparator />

                    <Link href={"/anuncie"} className='flex text-sm align-middle p-2 hover:bg-gray-100 text-(--text-primary)!'>
                      <DropdownMenuItem>
                        Vender
                      </DropdownMenuItem>
                    </Link>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={logout} className='cursor-pointer'>
                      <div className='flex text-sm align-middle p-2 hover:bg-gray-100 text-(--text-primary)!'>
                        Sair
                      </div>
                    </DropdownMenuItem>

                  </DropdownMenuContent>
                </>) :
                (<div>
                  <Link href={"/login"} className='flex text-sm align-middle p-2 hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!'>
                    Entrar
                  </Link>
                </div>)
              }
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
                <span className='flex h-full px-2 items-center text-sm hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)!'>
                  Favoritos <i className="fa fa-chevron-down text-[12px] ms-1"></i>
                </span>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>

          <div>
            <Link href={'/carrinho'}>
              <span className='flex h-full px-2 items-center text-sm hover:bg-[rgb(0,0,0,0.05)] text-(--text-primary)! rounded-full'>
                <Image src={'/static/images/icons/cart-shopping-light-full.svg'} width={20} height={20} alt='' />
                <span>{cart?.items.length || 0}</span>
              </span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
