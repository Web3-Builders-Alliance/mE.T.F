import { useMetfProgram } from '@/components/metf/metf-data-access';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { createClient } from 'utils/supabase/client';

const usePersonTokenAccount = (pubkey: string | PublicKey) => {
  const { program } = useMetfProgram();
  return useQuery({
    queryKey: ['get-person-account', { pubkey }],
    queryFn: async ({ queryKey }) => {
      const [, { pubkey }] = queryKey as [string, { pubkey: string }];
      const onchain = await program.account.person.fetch(new PublicKey(pubkey));
      const supabase = createClient();
      const { data } = await supabase
        .from('person_token')
        .select('*')
        .eq('mint', onchain.tokenMint.toBase58())
        .single();

      return { ...data, currentSupply: onchain.currentSupply.toString() };
    },
    enabled: !!pubkey,
  });
};

export default usePersonTokenAccount;
