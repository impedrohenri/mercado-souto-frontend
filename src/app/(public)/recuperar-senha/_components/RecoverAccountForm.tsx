'use client'

import Button from '@/components/Button/Button'
import Input from '@/components/Input/Input'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Form } from 'react-bootstrap'

export default function RecoverAccountForm() {
  const [validated, setValidated] = useState(false)
  const router = useRouter();
  
  const handleSubmit = () => {
  }
  
  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit} className='flex flex-col gap-4'> 
      <Input type="text" id='recoverCode' placeholder="XXXXXX" label="Código de recuperação" required/>
      <Button variant='primary' className='py-3 mt-3' onClick={() => {handleSubmit}}>Continuar</Button>   
    </Form>
  )
}
