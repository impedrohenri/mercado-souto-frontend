import Link from 'next/link';
import PublicHeader from '../../../components/PublicHeader/PublicHeader';
import SignUpForm from './_components/SignUpForm';

export default function CadastroCliente() {

  return (
    <div className='d-flex content-center items-center bg-linear-to-b from-(--primary-yellow) from-50% to-white to-50% min-h-screen text-center w-full'>
      <PublicHeader />

      <div className='font-medium mx-auto text-2xl w-full sm:w-[370px] text-(--text-primary) my-4'>Crie sua conta e compre com frete grátis</div>

      <div className='d-flex flex-col bg-white rounded-2xl border border-gray-200 w-full sm:w-[468px] mx-auto mt-2 p-8 gap-4 text-left mb-8'>

        <SignUpForm />

      </div>

        <span className='pb-8 text-sm'>
          Você precisa de uma conta para sua empresa?<br />
        <Link href="#">Crie uma conta corporativa</Link>
        </span>
    </div>
  )
}