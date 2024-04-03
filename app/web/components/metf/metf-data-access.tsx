'use client';

import { programId, MetfIDL } from '@metf/anchor';
import { BN, Program } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';
const fee = new BN(0.02 * LAMPORTS_PER_SOL);

const CONFIG_SEED = 'config';
const PERSON_SEED = 'person';

export function useMetfProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const program = new Program(MetfIDL, programId, provider);

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const [configPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(CONFIG_SEED)],
    program.programId
  );

  const [feeBank] = PublicKey.findProgramAddressSync(
    [Buffer.from('fee-bank')],
    program.programId
  );

  const initProgram = useMutation({
    mutationKey: ['metf', 'init', { cluster }],
    mutationFn: () =>
      program.methods
        .init(fee)
        .accounts({
          signer: provider.publicKey,
          transferHook: new PublicKey(
            process.env.NEXT_PUBLIC_TRANSFER_HOOk_ADDRESS!
          ),
          config: configPda,
          feeBank,
          systemProgram: SystemProgram.programId,
        })
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: () => toast.error('Failed to run program'),
  });

  const createBondcurve = useMutation({
    mutationKey: ['metf', 'createBondingModel', { cluster }],
    mutationFn: () => {
      const bondingCurveId = new BN(1);
      const [bondingCurve1Pda] = PublicKey.findProgramAddressSync(
        [Buffer.from('bonding-curve'), bondingCurveId.toBuffer('le', 8)],
        program.programId
      );
      return program.methods
        .createBondingModel(bondingCurveId, new BN(100))
        .accounts({
          config: configPda,
          signer: provider.publicKey,
          bondingCurve: bondingCurve1Pda,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: (e) => {
      console.error(e);
      toast.error('Failed to run program');
    },
  });
  return {
    program,
    programId,
    getProgramAccount,
    initProgram,
    createBondcurve,
  };
}
