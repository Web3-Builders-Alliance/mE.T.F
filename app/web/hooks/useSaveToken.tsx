import savePersonToken from '@/actions/savePersonToken';
import { useMetfProgram } from '@/components/metf/metf-data-access';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useSaveToken = () => {
  const { createPersonToken, program } = useMetfProgram();
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  return useMutation({
    mutationKey: ['saveToken'],
    mutationFn: async (data: any) => {
      if (!publicKey) return;
      try {
        // check exist person account in program
        const x = await connection.getParsedProgramAccounts(program.programId, {
          filters: [
            {
              dataSize: 186,
            },
            {
              memcmp: {
                offset: 9,
                bytes: publicKey.toBase58(),
              },
            },
          ],
        });
        if (x.length > 0) {
          toast('You already have a person account', {
            icon: '👋',
          });
          return;
        }

        const _mint = Keypair.generate();

        const tx = await createPersonToken.mutateAsync({
          name: data.name,
          symbol: data.symbol,
          uri: data.photo,
          _mint,
        });

        if (tx) {
          const result = await savePersonToken({
            author: publicKey.toBase58(),
            name: data.name,
            symbol: data.symbol,
            description: data.description,
            image: data.photo,
            model: data.model,
            mint: _mint.publicKey.toBase58(),
          });
          return result;
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });
};

export default useSaveToken;
