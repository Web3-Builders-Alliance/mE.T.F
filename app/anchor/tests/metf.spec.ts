import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Metf } from '../target/types/metf';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';

import { LAMPORTS_PER_SOL } from '@solana/web3.js';
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

  const [admin, user] = [
    anchor.web3.Keypair.generate(),
    anchor.web3.Keypair.generate(),
  ];
  const CONFIG_SEED = 'config';
  const PERSON_SEED = 'person';

  let configPda: anchor.web3.PublicKey;

  beforeAll(async () => {
    [configPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(CONFIG_SEED)],
      program.programId
    );
  });

  it('Airdrop', async () => {
    await Promise.all(
      [admin, user].map(async (account) => {
        await connection
          .requestAirdrop(account.publicKey, LAMPORTS_PER_SOL * 10)
          .then(confirmTx);
      })
    );
  });

  it('Should initialize the program', async () => {
    const tx = await program.methods
      .init()
      .accounts({
        signer: admin.publicKey,
        transferHook: transferHookProgram.programId,
        config: configPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([admin])
      .rpc();
    log(tx);
  });

  const [personPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(PERSON_SEED), user.publicKey.toBuffer()],
    program.programId
  );
  const metadata = {
    name: 'LEO TOKEN',
    symbol: 'LEOT',
    decimals: 9,
    uri: 'https://5vfxc4tr6xoy23qefqbj4qx2adzkzapneebanhcalf7myvn5gzja.arweave.net/7UtxcnH13Y1uBCwCnkL6APKsge0hAgacQFl-zFW9NlI',
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
        token2022Program: TOKEN_2022_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([mint, user])
      .rpc();
    log(tx);

    const initTransferHook = await transferHookProgram.methods
      .initializeExtraAccountMetaList()
      .accounts({
        payer: admin.publicKey,
        extraAccountMetaList: extraAccountMetaListPDA,
        mint: mint.publicKey,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([admin])
      .rpc();
    log(initTransferHook);
  });

  it('Should buy a token', async () => {
    const tx = await program.methods
      .buyToken(new anchor.BN(100 * 10 ** 6))
      .accounts({
        signer: user.publicKey,
        person: personPda,
        mint: mint.publicKey,
        vault,
        userAta: user_ata,
        token2022Program: TOKEN_2022_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();
    log(tx);
  });
});
