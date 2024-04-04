import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Metf } from '../target/types/metf';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getMint,
  getOrCreateAssociatedTokenAccount,
  getTransferFeeConfig,
  getTransferHook,
  transferCheckedWithFeeAndTransferHook,
} from '@solana/spl-token';

import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TransferHook } from '../target/types/transfer_hook';
describe('metf', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Metf as Program<Metf>;
  const transferHookProgram = anchor.workspace
    .TransferHook as Program<TransferHook>;

  console.log('Program ID', program.programId.toBase58());
  const connection = anchor.getProvider().connection;

  const confirmTx = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...block,
    });
    return signature;
  };

  const log = async (signature: string): Promise<string> => {
    console.log(
      `Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom`
    );
    return signature;
  };

  async function readTransferFeeConfig(mint: anchor.web3.PublicKey) {
    const mintInfo = await getMint(
      connection,
      mint,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );

    const transferFeeConfig = await getTransferFeeConfig(mintInfo);
    console.log(
      '\nTransfer Fee Config:',
      JSON.stringify(
        transferFeeConfig,
        (_, v) => (typeof v === 'bigint' ? v.toString() : v),
        2
      )
    );
    return transferFeeConfig;
  }

  async function calculateTransferFee(
    mint: anchor.web3.PublicKey,
    transferAmount: bigint
  ) {
    const feeConfig = await readTransferFeeConfig(mint);
    if (!feeConfig) {
      throw new Error('Transfer fee config not found');
    }
    const feeBasisPoints = feeConfig.newerTransferFee.transferFeeBasisPoints;
    const maxFee = feeConfig.newerTransferFee.maximumFee;
    const calcFee = (transferAmount * BigInt(feeBasisPoints)) / BigInt(10000);
    const expectedFee = calcFee > maxFee ? maxFee : calcFee;
    return expectedFee;
  }

  const [admin, user, buyer] = [
    anchor.web3.Keypair.generate(),
    anchor.web3.Keypair.generate(),
    anchor.web3.Keypair.generate(),
  ];

  console.log('Admin:', admin.publicKey.toBase58());
  console.log('User:', user.publicKey.toBase58());
  console.log('Buyer:', buyer.publicKey.toBase58());

  const CONFIG_SEED = 'config';
  const PERSON_SEED = 'person';

  let configPda: anchor.web3.PublicKey;
  let configBump: number;

  const fee = new anchor.BN(0.02 * LAMPORTS_PER_SOL);
  const [feeBank] = PublicKey.findProgramAddressSync(
    [Buffer.from('fee-bank')],
    program.programId
  );
  console.log('Fee Bank:', feeBank.toBase58());

  beforeAll(async () => {
    [configPda, configBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(CONFIG_SEED)],
      program.programId
    );
  });

  it('Airdrop', async () => {
    await Promise.all(
      [admin, user, buyer].map(async (account) => {
        await connection
          .requestAirdrop(account.publicKey, LAMPORTS_PER_SOL * 10)
          .then(confirmTx);
      })
    );
  });

  const [personPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(PERSON_SEED), user.publicKey.toBuffer()],
    program.programId
  );

  console.log('Person PDA:', personPda.toBase58());
  const metadata = {
    name: 'LEO TOKEN',
    symbol: 'LEOT',
    decimals: 9,
    uri: 'https://5vfxc4tr6xoy23qefqbj4qx2adzkzapneebanhcalf7myvn5gzja.arweave.net/7UtxcnH13Y1uBCwCnkL6APKsge0hAgacQFl-zFW9NlI',
    initPrice: new anchor.BN(10 * 10 ** 6),
  };
  const mint = anchor.web3.Keypair.generate();

  const [extraAccountMetaListPDA] =
    anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('extra-account-metas'), mint.publicKey.toBuffer()],
      transferHookProgram.programId
    );

  const vault = getAssociatedTokenAddressSync(
    mint.publicKey,
    personPda,
    true,
    TOKEN_2022_PROGRAM_ID
  );

  const user_ata = getAssociatedTokenAddressSync(
    mint.publicKey,
    user.publicKey,
    false,
    TOKEN_2022_PROGRAM_ID
  );

  const [personBankPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('person-bank'), mint.publicKey.toBuffer()],
    program.programId
  );
  it('Should initialize the program', async () => {
    const tx = await program.methods
      .init(fee)
      .accounts({
        signer: admin.publicKey,
        transferHook: transferHookProgram.programId,
        config: configPda,
        feeBank,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([admin])
      .rpc();
    log(tx);

    const configInfo = await program.account.config.fetch(configPda);
    expect(configInfo.bump).toEqual(configBump);
    expect(configInfo.admin).toEqual(admin.publicKey);
    expect(configInfo.transferHook).toEqual(transferHookProgram.programId);
    expect(configInfo.feeBank).toEqual(feeBank);
    expect(configInfo.fee.toString()).toEqual(fee.toString());
  });

  const bondingCurveId = new anchor.BN(1);
  const [bondingCurve1Pda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('bonding-curve'), bondingCurveId.toBuffer('le', 8)],
    program.programId
  );

  it('Should create a bonding curve model', async () => {
    const tx = await program.methods
      .createBondingModel(bondingCurveId, new anchor.BN(100))
      .accounts({
        config: configPda,
        signer: admin.publicKey,
        bondingCurve: bondingCurve1Pda,
      })
      .signers([admin])
      .rpc();
    log(tx);
  });

  it('Should create a user token mint', async () => {
    const tx = await program.methods
      .initPersonToken({
        ...metadata,
      })
      .accounts({
        signer: user.publicKey,
        person: personPda,
        mint: mint.publicKey,
        vault,
        feeBank,
        config: configPda,
        bondCurve: bondingCurve1Pda,
        token2022Program: TOKEN_2022_PROGRAM_ID,
        personBank: personBankPda,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([mint, user])
      .postInstructions([
        await transferHookProgram.methods
          .initializeExtraAccountMetaList()
          .accounts({
            payer: user.publicKey,
            extraAccountMetaList: extraAccountMetaListPDA,
            mint: mint.publicKey,
            ownerWithoutFee: program.programId,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([user])
          .instruction(),
      ])
      .rpc();
    log(tx);

    const mintInfo = await getMint(
      connection,
      mint.publicKey,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    const transferHook = getTransferHook(mintInfo);
    console.log('Transfer Hook:', JSON.stringify(transferHook, null, 2));
  });

  it.skip('Should transfer token', async () => {
    const buyer_ata = await getOrCreateAssociatedTokenAccount(
      connection,
      user,
      mint.publicKey,
      buyer.publicKey,
      false,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    const transferAmount = BigInt(1000000000);
    const expectedFee = await calculateTransferFee(
      mint.publicKey,
      transferAmount
    );
    await transferCheckedWithFeeAndTransferHook(
      connection,
      user,
      user_ata,
      mint.publicKey,
      buyer_ata.address,
      user.publicKey,
      transferAmount,
      6,
      expectedFee,
      [],
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
  });

  it('Should buy a token', async () => {
    const buyer_ata = getAssociatedTokenAddressSync(
      mint.publicKey,
      buyer.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    // const createAccountIx = createAssociatedTokenAccountIdempotentInstruction(
    //   buyer.publicKey,
    //   buyer_ata,
    //   buyer.publicKey,
    //   mint.publicKey,
    //   TOKEN_2022_PROGRAM_ID,
    //   ASSOCIATED_TOKEN_PROGRAM_ID
    // );

    const tx = await program.methods
      .buyToken(new anchor.BN(10 * 10 ** 9))
      .accounts({
        signer: buyer.publicKey,
        person: personPda,
        mint: mint.publicKey,
        vault,
        userAta: buyer_ata,
        extraAccountMetaList: extraAccountMetaListPDA,
        ownerWithoutFee: program.programId,
        config: configPda,
        bondCurve: bondingCurve1Pda,
        personBank: personBankPda,
        transferHook: transferHookProgram.programId,
        token2022Program: TOKEN_2022_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([buyer])
      // .instruction();
      .rpc();
    log(tx);

    const tx2 = await program.methods
      .buyToken(new anchor.BN(20 * 10 ** 9))
      .accounts({
        signer: buyer.publicKey,
        person: personPda,
        mint: mint.publicKey,
        vault,
        userAta: buyer_ata,
        extraAccountMetaList: extraAccountMetaListPDA,
        ownerWithoutFee: program.programId,
        config: configPda,
        bondCurve: bondingCurve1Pda,
        personBank: personBankPda,
        transferHook: transferHookProgram.programId,
        token2022Program: TOKEN_2022_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([buyer])
      // .instruction();
      .rpc();
    log(tx2);
    // const transaction = new Transaction().add(createAccountIx).add(tx);
    // await sendAndConfirmTransaction(connection, transaction, [buyer], {
    //   skipPreflight: true,
    // }).then(log);
  });
});
