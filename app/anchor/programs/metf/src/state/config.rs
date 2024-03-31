use anchor_lang::prelude::*;

use crate::constants::{DISCRIMINATOR_SIZE, PUBKEY_SIZE, U8_SIZE};

#[account]
pub struct Config {
    pub admin: Pubkey,
    pub transfer_hook: Pubkey,
    pub bump: u8,
}

impl Space for Config {
    const INIT_SPACE: usize = DISCRIMINATOR_SIZE + PUBKEY_SIZE + PUBKEY_SIZE + U8_SIZE;
}

impl Config {
    pub fn init(&mut self, admin: Pubkey, transfer_hook: Pubkey, bump: u8) {
        self.admin = admin;
        self.transfer_hook = transfer_hook;
        self.bump = bump;
    }
}
