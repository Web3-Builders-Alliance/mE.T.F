'use client';

import { useMetfProgram } from '@/components/metf/metf-data-access';
import usePersonTokenAccount from '@/hooks/usePersonTokenAccount';

type Props = {
  params: {
    pubkey: string;
  };
};

const MintPage: React.FC<Props> = ({ params: { pubkey } }) => {
  const { data } = usePersonTokenAccount(pubkey);
  console.log(data);
  return (
    <div>
      <h1>Mint: {pubkey}</h1>
    </div>
  );
};
export default MintPage;
