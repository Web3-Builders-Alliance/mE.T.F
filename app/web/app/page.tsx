'use client';
import TokenList from '@/components/TokenList';
import AuthForm from '@/components/login/auth-form';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default async function Page() {

  const supabase = createClientComponentClient()
  const [keyword, setKeyword] = useState('');

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let { data: person_token, error } = await supabase
  .from('person_token')
  .select('mint,author,name,symbol,image,description')

  if (!user) return (
        <AuthForm />
  );

  return (

    <main className="isolate container min-h-full h-full">
      
      <div>
      {person_token?.map((token, index) => (
        <p key={index}>Name: {token.name} Symbol: {token.symbol} Mint: {token.mint}</p>
      ))}
    </div>

      <div className="flex flex-col justify-center items-center space-y-5">
        <Image src={'/metf-logo-full-square.png'} width={128} height={128} alt={''} />
        <h2 className="text-4xl">
          Start your personal token in seconds for $1
        </h2>
        <Link className="link" href={'/create-new-token'}>
          <button className="btn btn-primary btn-md uppercase">
            Create my token
          </button>
        </Link>
      </div>
      <div className="mt-10 flex flex-col space-y-5">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search token"
            onChange={(e) => setKeyword(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        <TokenList keyword={keyword} />
      </div>
    </main>
  );
}
