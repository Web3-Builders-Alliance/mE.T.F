// Here we export some useful types and functions for interacting with the Anchor program.
import { PublicKey } from '@solana/web3.js';
import type { MeTF } from '../target/types/me_t_f';
import { IDL as MeTFIDL } from '../target/types/me_t_f';

// Re-export the generated IDL and type
export { MeTF, MeTFIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const programId = new PublicKey(
  '87EjUQYBASSBK69wYeo5mDCEtEMMFK6HxHedFuhQZHCj'
);
