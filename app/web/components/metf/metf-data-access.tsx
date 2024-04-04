'use client';

import { programId, MetfIDL } from '@metf/anchor';
import { BN, Program } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
} from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
const fee = new BN(0.02 * LAMPORTS_PER_SOL);

const CONFIG_SEED = 'config';
const PERSON_SEED = 'person';

export function useMetfProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const program = new Program(MetfIDL, programId, provider);
  const {} = useWallet();

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

  const bondingCurveId = new BN(1);
  const [bondingCurve1Pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('bonding-curve'), bondingCurveId.toBuffer('le', 8)],
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
    onError: (e) => {
      console.error(e);
      toast.error('Failed to run program');
    },
  });

  const createBondcurve = useMutation({
    mutationKey: ['metf', 'createBondingModel', { cluster }],
    mutationFn: () => {
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

  const createPersonToken = useMutation({
    mutationKey: ['metf', 'initPersonToken', { cluster }],
    mutationFn: (params: { name: string; symbol: string; uri: string }) => {
      const { name, symbol, uri } = params;
      const decimals = 6;
      const initPrice = new BN(10 ** decimals);
      const _mint = Keypair.generate();

      const [personPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(PERSON_SEED), provider.publicKey.toBuffer()],
        program.programId
      );

      const vault = getAssociatedTokenAddressSync(
        _mint.publicKey,
        personPda,
        true,
        TOKEN_2022_PROGRAM_ID
      );
      const [personBankPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('person-bank'), _mint.publicKey.toBuffer()],
        program.programId
      );

      return program.methods
        .initPersonToken({
          name,
          symbol,
          uri,
          decimals,
          initPrice,
        })
        .accounts({
          signer: provider.publicKey,
          person: personPda,
          mint: _mint.publicKey,
          vault,
          feeBank,
          config: configPda,
          bondCurve: bondingCurve1Pda,
          token2022Program: TOKEN_2022_PROGRAM_ID,
          personBank: personBankPda,
          systemProgram: SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .signers([_mint])
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

  const buyToken = useMutation({
    mutationKey: ['metf', 'buyToken', { cluster }],
    mutationFn: (params: {
      user: string;
      mint: string;
      amount: bigint | number;
    }) => {
      const { user, mint, amount } = params;
      const _mint = new PublicKey(mint);
      const buyer_ata = getAssociatedTokenAddressSync(
        _mint,
        provider.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      const bondingCurveId = new BN(1);
      const [bondingCurve1Pda] = PublicKey.findProgramAddressSync(
        [Buffer.from('bonding-curve'), bondingCurveId.toBuffer('le', 8)],
        program.programId
      );
      const [personPda] = PublicKey.findProgramAddressSync(
        [Buffer.from(PERSON_SEED), new PublicKey(user).toBuffer()],
        program.programId
      );

      const vault = getAssociatedTokenAddressSync(
        _mint,
        personPda,
        true,
        TOKEN_2022_PROGRAM_ID
      );

      const [extraAccountMetaListPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('extra-account-metas'), _mint.toBuffer()],
        new PublicKey(process.env.NEXT_PUBLIC_TRANSFER_HOOk_ADDRESS!)
      );

      const [personBankPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('person-bank'), _mint.toBuffer()],
        program.programId
      );
      return program.methods
        .buyToken(amount)
        .accounts({
          signer: provider.publicKey,
          person: personPda,
          mint: _mint,
          vault,
          userAta: buyer_ata,
          extraAccountMetaList: extraAccountMetaListPDA,
          ownerWithoutFee: program.programId,
          config: configPda,
          bondCurve: bondingCurve1Pda,
          personBank: personBankPda,
          transferHook: new PublicKey(
            process.env.NEXT_PUBLIC_TRANSFER_HOOk_ADDRESS!
          ),
          token2022Program: TOKEN_2022_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
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
    buyToken,
    createPersonToken,
  };
}
