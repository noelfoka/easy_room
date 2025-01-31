/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import Wrapper from '@/app/components/Wrapper'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import React, { useState } from 'react'

const page = ({ params} : { params: { roomId: string } }) => {

  // recupérer l'utilisateur connecté
  const { user } = useKindeBrowserClient();

  // Les variables d'etat
  const [notification, setNotification] = useState<string | null>(null);

  const closeNotification = () => {
    setNotification(null);
  };

  return (
   <Wrapper>
    <div>Reservation de la salle {params.roomId}</div>
   </Wrapper>
  )
}

export default page