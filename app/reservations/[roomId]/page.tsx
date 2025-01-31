/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import Notification from '@/app/components/Notification'
import Wrapper from '@/app/components/Wrapper'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import React, { useState } from 'react'

const page = ({ params} : { params: { roomId: string } }) => {

  // recupérer l'utilisateur connecté
  const { user } = useKindeBrowserClient();

  // Les variables d'etat
  const [notification, setNotification] = useState<string>("");

  const closeNotification = () => {
    setNotification(null);
  };

  return (
   <Wrapper>
    {notification && (
      <Notification message={notification} onClose={closeNotification}></Notification>
    )}
   </Wrapper>
  )
}

export default page