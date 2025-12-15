'use client'

import Header from '@/components/header/Header'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth'
import { useClienteStore } from '@/store/cliente'
import { NameAbbreviation } from '@/utils/NameAbbreviation'
import { 
    User, 
    ShoppingBag, 
    Tag, 
    FileText, 
    Settings, 
    CreditCard, 
    MapPin, 
    ChevronDown,
} from 'lucide-react'
import Link from 'next/link'

type DashboardItem = {
    title: string
    description: string
    icon: React.ReactNode
    hasNotification?: boolean
    href: string
}


type SidebarItem = {
    label: string
    icon: React.ReactNode
    active?: boolean
    hasSubmenu?: boolean
    href: string
}

export default function UserProfileDashboard() {

    const {name} = useClienteStore();
    const {userEmail} = useAuthStore();


    const sidebarItems: SidebarItem[] = [
        { label: "Minha conta", icon: <User size={20} />, href: "/perfil" },
        { label: "Compras", icon: <ShoppingBag size={20} />, href: "/compras" },
        { label: "Vendas", icon: <FileText size={20} />, href: "/vendas" },
        { label: "Anuncios", icon: <Tag size={20} />, href: "/anuncios" },
        { label: "Meu perfil", icon: <User size={20} />, href: "/meu-perfil" },
        { label: "Configurações", icon: <Settings size={20} />, href: "/configuracoes" },
    ]


    const gridItems: DashboardItem[] = [
        {
            title: "Informações do seu perfil",
            description: "Dados pessoais e da conta.",
            icon: <User className="w-6 h-6" />,
            hasNotification: true,
            href: "/perfil/alterar"
        },
        {
            title: "Cartões",
            description: "Cartões salvos na sua conta.",
            icon: <CreditCard className="w-6 h-6" />,
            href: "/cartoes"
        },
        {
            title: "Endereços",
            description: "Endereços salvos na sua conta.",
            icon: <MapPin className="w-6 h-6" />,
            href: "/enderecos"
        }
    ]

    return (
        <>
          <Header />
          <div className="flex min-h-screen bg-gray-100/50">
            
            {/* --- SIDEBAR (Menu Lateral) --- */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r h-auto py-4">
                <nav className="space-y-1">
                    {sidebarItems.map((item, index) => (
                        <Link href={item.href} key={index}>
                            <div 
                            key={index} 
                            className={`flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${item.active ? 'border-l-4 border-blue-500 font-medium bg-gray-50' : 'text-(--text-secondary)'}`}
                        >
                            <div className="flex items-center gap-4">
                                <span className={item.active ? 'text-black' : 'text-gray-400'}>{item.icon}</span>
                                <span className="text-sm">{item.label}</span>
                            </div>
                            {item.hasSubmenu && <ChevronDown size={16} className="text-gray-400" />}
                        </div>
                        </Link>
                    ))}
                </nav>
            </aside>

 
            <main className="flex-1 p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                    

                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                            <span className="text-2xl font-normal text-gray-700">{NameAbbreviation(String(name))}</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold">{name}</h1>
                            <p className="text-(--text-secondary) text-sm">{userEmail}</p>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {gridItems.map((item, index) => (
                            <Link href={item.href} key={index} className="group">
                                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-gray-200">
                                    <CardContent className="p-6 relative h-full flex flex-col justify-between">
                                        

                                        {item.hasNotification && (
                                            <div className="absolute top-4 right-4 bg-orange-500 rounded-full w-5 h-5 flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">!</span>
                                            </div>
                                        )}

                                        <div>
                                            <div className="mb-4 text-gray-700 group-hover:text-blue-600 transition-colors">
                                                {item.icon}
                                            </div>
                                            
                                            <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                                            <p className="text-(--text-secondary) text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    
                </div>
            </main>
        </div>
        </>
    )
}