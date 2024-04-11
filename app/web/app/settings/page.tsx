'use client';

import AuthForm from '@/components/login/auth-form';
import { useMetfProgram } from '@/components/metf/metf-data-access';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const SettingsPage = async () => {
  const supabase = createClientComponentClient()
  const { initProgram, createBondcurve } = useMetfProgram();
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) return (
    <AuthForm />
  );
  
  return (
    <div>
      <h1>Settings</h1>
      <div className="flex gap-2">
        <button
          className="btn btn-primary"
          onClick={() => initProgram.mutate()}
        >
          Init program
        </button>
        <button
          className="btn btn-primary"
          onClick={() => createBondcurve.mutate()}
        >
          Create the first bonding curve model
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
