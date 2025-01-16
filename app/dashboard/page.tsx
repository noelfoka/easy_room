"use client";

import React from 'react'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs';

const page = () => {

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {user} = useKindeBrowserClient()

  return (
    <div>

      <div>Bienvenue {user?.given_name} {user?.family_name} à mon dashboard</div>
      <LogoutLink className="btn btn-error">Se déconnecter</LogoutLink>
    </div>
  )
}

export default page