import PublicHeader from '@/components/PublicHeader/PublicHeader'
import RecoverAccountForm from './_components/RecoverAccountForm'

export default function RecoverAccount() {

  return (
    <>
          <PublicHeader />
          <div className='flex justify-center pt-14 flex-wrap'>
    
            <div className='font-semibold mx-auto text-3xl w-full sm:w-[468px] lg:w-[43%] text-(--text-primary) px-8 mb-10'>
              Recuperar conta <br />
              <span className='text-lg text-(--text-secondary) font-normal break-keep '>As instruções para recuperar sua conta serão enviadas para o seu e-mail</span>
            </div> 
            
            <div className='d-flex flex-col bg-white rounded-2xl border border-gray-200 w-full sm:w-[468px] mx-auto mt-2 p-8 gap-4 text-left min-w-96'> 

                <RecoverAccountForm/>
                
            </div>
          </div> 
        </>
  )
}
