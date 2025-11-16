'use client' 

import Input from '@/components/Input/Input'
import { useState } from 'react'
import { Form } from 'react-bootstrap'
import Button from '@/components/Button/Button'
import { useRouter } from 'next/navigation'
import PublicHeader from '../../../components/PublicHeader/PublicHeader'

export default function Login() {
  const [validated, setValidated] = useState(false)
  const router = useRouter();
    
  const handleSubmit = () => { }

  return (
    <>
      <PublicHeader />
      <div className='flex text-center pt-14 px-40'>

        <div className='font-semibold mx-auto text-3xl text-left w-[45%]'>
          Digite seu e-mail ou telefone para iniciar sessão
        </div> 
        
        <div className='d-flex flex-col bg-white rounded-3xl border border-gray-200 w-[45%] max-w-94 mx-auto mt-2 p-8 gap-4 text-left min-w-96'> 

          <Form noValidate validated={validated} onSubmit={handleSubmit} className='flex flex-col gap-4'> 
            <Input type="text" id='email' placeholder="E-mail" label="E-mail ou telefone" required/>
            <Input type="text" id='password' placeholder="Senha" label="Senha"/>

            <Button variant='primary' className="py-3 mt-5 font-bold">Continuar</Button>
            <Button variant='secondary' className="py-3 font-medium" onClick={() => {router.push('/cadastro')}}>Criar conta</Button>
          </Form> 
          
        </div> 
      </div> 
    </>
  )
}
