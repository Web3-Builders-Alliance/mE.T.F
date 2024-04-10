'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'


export default function AuthForm() {  
  
  const supabase = createClientComponentClient()
  
  return (
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
  )
}