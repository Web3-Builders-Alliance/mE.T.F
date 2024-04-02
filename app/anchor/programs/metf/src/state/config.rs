use anchor_lang::prelude::*;

use crate::constants::{DISCRIMINATOR_SIZE, PUBKEY_SIZE, U64_SIZE, U8_SIZE};

#[account]
pub struct Config {
    pub admin: Pubkey,
    pub transfer_hook: Pubkey,
    pub bump: u8,
    pub fee: u64,
    pub fee_wallet: Pubkey,
}

impl Space for Config {
    const INIT_SPACE: usize =
        DISCRIMINATOR_SIZE + PUBKEY_SIZE + PUBKEY_SIZE + U8_SIZE + U64_SIZE + PUBKEY_SIZE;
}

impl Config {
    pub fn init(
        &mut self,
        admin: Pubkey,
        transfer_hook: Pubkey,
        bump: u8,
        fee: u64,
        fee_wallet: Pubkey,
    ) {
        self.admin = admin;
        self.transfer_hook = transfer_hook;
        self.bump = bump;
        self.fee = fee;
        self.fee_wallet = fee_wallet;
    }
}
