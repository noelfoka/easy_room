"use client";

import React, { useEffect, useState } from 'react'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { usePathname } from 'next/navigation'
import { CalendarCheck } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {

  const {user} = useKindeBrowserClient();
  const pathname = usePathname();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if(user) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [user]);

  return (
    <div className='fixed top-0 w-full bg-white backdrop-blur-sm'>
      <nav className='md:px-[10%] p-5 border-b border-base-200 w-full bg-white'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='flex items-center font-bold text-2xl'>
              <div className='bg-secondary p-1 mr-1 rounded-md text-white'>
                <CalendarCheck />
              </div>
                <span>Es<span className='text-secondary'>Rom</span></span>
            </h1>

            {loading ? (
              <div className='flex justify-end mt-2'>
                <span className="loading loading-spinner loading-xs"></span>
              </div>
            ) : (
              <div>
                <div className="badge badge-ghost">{user?.email}</div>
              </div>
            )}
          </div>

          {/* Desktop */} 
          <div className='hidden md:flex items-center space-x-6'>
            <Link href="/dashboard">Réserver</Link>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar