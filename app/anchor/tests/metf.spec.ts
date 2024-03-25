import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Metf } from '../target/types/metf';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';

import { LAMPORTS_PER_SOL } from '@solana/web3.js';
const METADATA_SEED = 'metadata';
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);
describe('metf', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Metf as Program<Metf>;

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
      `Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`
    );
    return signature;
  };

  const [admin, user] = [
    anchor.web3.Keypair.generate(),
    anchor.web3.Keypair.generate(),
  ];
  const CONFIG_SEED = 'config';
  const PERSON_SEED = 'person';
  const PERSON_TOKEN_SEED = 'person_token';

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
        config: configPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([admin])
      .rpc();
    log(tx);
  });

  it('Should create a user token mint', async () => {
    console.log('Creating a user token mint');
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
    const [mint] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(PERSON_TOKEN_SEED), user.publicKey.toBuffer()],
      program.programId
    );

    const [metadataPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(METADATA_SEED),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const vault = getAssociatedTokenAddressSync(mint, personPda, true);

    const tx = await program.methods
      .initPersonToken({
        ...metadata,
      })
      .accounts({
        signer: user.publicKey,
        person: personPda,
        metadata: metadataPda,
        mint: mint,
        vault,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([user])
      .rpc();
    log(tx);
  });
});
