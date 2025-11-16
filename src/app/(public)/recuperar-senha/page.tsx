import PublicHeader from '@/components/PublicHeader/PublicHeader'
import RecoverAccountForm from './_components/RecoverAccountForm'

export default function RecoverAccount() {

  return (
    <>
          <PublicHeader />
          <div className='flex text-center pt-14 px-40 flex-wrap'>
    
            <div className='font-semibold mx-auto text-3xl text-left w-[45%] min-w-96 mb-10'>
              Informe o código enviado ao seu e-mail
            </div> 
            
            <div className='d-flex flex-col bg-white rounded-3xl border border-gray-200 w-[45%] max-w-94 mx-auto mt-2 p-8 gap-4 text-left min-w-96'> 

                <RecoverAccountForm/>
                
            </div>
          </div> 
        </>
  )
}
