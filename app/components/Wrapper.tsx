import React from 'react'
import Navbar from './Navbar'

type WrapperProps = {
  children: React.ReactNode
}

const Wrapper = ({children}: WrapperProps) => {
  return (
    <div>
      <Navbar />
    </div>
  )
}

export default Wrapper