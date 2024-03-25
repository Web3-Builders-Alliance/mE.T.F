import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Metf } from '../target/types/metf';

import { LAMPORTS_PER_SOL } from '@solana/web3.js';

describe('metf', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Metf as Program<Metf>;
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

  const [admin] = [anchor.web3.Keypair.generate()];
  const CONFIG_SEED = 'config';

  let configPda: anchor.web3.PublicKey;
  beforeAll(async () => {
    [configPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from(CONFIG_SEED)],
      program.programId
    );
  });

  it('Airdrop', async () => {
    await Promise.all([
      await connection
        .requestAirdrop(admin.publicKey, LAMPORTS_PER_SOL * 10)
        .then(confirmTx),
    ]);
  });

  it('Should initialize the program', async () => {
    // console.log(connection);
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
});
