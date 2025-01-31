"use client"

import Wrapper from '@/app/components/Wrapper'
import React from 'react'

const page = ({ params} : { params: { roomId: string } }) => {
  return (
   <Wrapper>
    <div>Reservation de la salle {params.roomId}</div>
   </Wrapper>
  )
}

export default page