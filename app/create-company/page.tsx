import React from 'react'
import Wrapper from '../components/Wrapper'

const page = () => {
  return (
    <Wrapper>
    <div>
      <h1 className='text-2xl mb-4'>Créer une entreprise</h1>
      <form>
        <div className='flex flex-row'>
          <input type="text" name="companyName" id="companyName" placeholder='Nom de l&apos;entreprise' required className='input input-bordered w-full max-w-xs' />
        </div>
      </form>
    </div>
    </Wrapper>
  )
}

export default page