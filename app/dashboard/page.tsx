"use client";

import React from 'react'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'

const page = () => {

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {user} = useKindeBrowserClient()

  return (
    <div>Bienvenue {user?.given_name} {user?.family_name} à mon dashboard</div>
  )
}

export default page