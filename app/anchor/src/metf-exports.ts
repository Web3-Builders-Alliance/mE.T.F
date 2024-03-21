// Here we export some useful types and functions for interacting with the Anchor program.
import { PublicKey } from '@solana/web3.js';
import type { Metf } from '../target/types/metf';
import { IDL as MetfIDL } from '../target/types/metf';

// Re-export the generated IDL and type
export { Metf, MetfIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const programId = new PublicKey(
  '7QkCWdYBgV3VowU8ifAyhVHkrmGXQJLm6NGXtncTnYuq'
);
