'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image';

export default function AuthForm() {  
  
  const supabase = createClientComponentClient()
  
  return (
    <div className="relative h-full">
    <div className="absolute top-[33%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col justify-center min-w-[300px] max-w-[500px]">
        <Image className="self-center" src={'/metf-logo-full-square.png'} width={128} height={128} alt={''} />
        <br/>
        <Auth
        supabaseClient={supabase}
        view="magic_link"
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#E68966',
                brandAccent: '#E06A40',
              },
            },
          },
        }}
        theme="light"
        showLinks={false}
        providers={['twitter']}
        // redirectTo="http://localhost:3000/auth/callback" // Useful for local development
        />
      </div>
    </div>
  </div>
  )
}