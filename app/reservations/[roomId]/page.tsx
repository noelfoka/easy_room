"use client"

import Wrapper from '@/app/components/Wrapper'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import React from 'react'

const page = ({ params} : { params: { roomId: string } }) => {

  // recupérer l'utilisateur connecté
  const { user } = useKindeBrowserClient();

  return (
   <Wrapper>
    <div>Reservation de la salle {params.roomId}</div>
   </Wrapper>
  )
}

export default page