import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import React from 'react'

const page = ({params}: {params: {companyId: string}}) => {

  const { user } = useKindeBrowserClient();

  return (
    <div>
      {params.companyId}
    </div>
  )
}

export default page