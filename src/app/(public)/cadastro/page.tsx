'use client' 
import Input from '@/components/Input/Input' 
import Link from 'next/link'
import { useState } from 'react' 
import { Form, FormCheck } from 'react-bootstrap' 
import PublicHeader from '../../../components/PublicHeader/PublicHeader'
import Button from '@/components/Button/Button'
import { useRouter } from 'next/navigation'

export default function CadastroCliente() { 
  const [validated, setValidated] = useState(false);
  const router = useRouter();
  
  
  const handleSubmit = () => {

    router.push("/cadastro")
  } 

  return ( 
    <div className='d-flex content-center items-center bg-linear-to-b from-(--primary-yellow) from-50% to-white to-50% min-h-screen text-center'> 
      <PublicHeader/>

      <div className='font-medium mx-auto text-3xl w-[30%] text-(--text-primary) min-w-96 my-4'>Crie sua conta e compre com frete grátis</div> 
      
      <div className='d-flex flex-col bg-white rounded-3xl border border-gray-200 w-[30%] mx-auto mt-2 p-8 gap-4 text-left mb-8 min-w-96'> 

        <Form noValidate validated={validated} onSubmit={handleSubmit} className='flex flex-col gap-y-3'> 
          <Input type="text" id='email' placeholder="exemplo@email.com" label="E-mail" required/> 
          <Input type="text" id='phoneNumber' placeholder="+55" label="Telefone"/> 
          <Input type="text" id='name' placeholder="" label="Nome"/> 
          <Input type="text" id='password' placeholder="Senha" label="Senha"/> <Input type="text" id='repeatPassword' placeholder="Repetir senha" label="Confirmar senha"/>

          <Form.Check 
            label=" Aceito que entrem em contato comigo por SMS e WhatsApp."
            id='acceptContact'
            className='text-sm'
          />

          <span className='text-sm'>Ao "Continuar", aceito os <Link href="/termos-e-condicoes">Termos e condições</Link> e autorizo o uso dos meus dados de acordo com a <Link href="/declaracao-de-privacidade">Declaração de privacidade.</Link></span>

          <Button variant='primary' className='py-3 mt-2' onClick={() => {handleSubmit}}>Continuar</Button>
        </Form> 

      </div> 
    </div> 
  ) 
}