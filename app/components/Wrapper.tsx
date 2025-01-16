import React from 'react'
import Navbar from './Navbar'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { usePathname } from 'next/navigation'

type WrapperProps = {
  children: React.ReactNode
}

const Wrapper = ({children}: WrapperProps) => {

  const {user} = useKindeBrowserClient();
  const pathname = usePathname();

  return (
    <div>
      <Navbar />
      <div className='px-5 mt-32 md:px-[10%] mb-10'>{children}</div>
    </div>
  )
}

export default Wrapper