use anchor_lang::prelude::*;

use crate::constants::{DISCRIMINATOR_SIZE, PUBKEY_SIZE, U8_SIZE};

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone)]
pub struct InitPersonTokenParams {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub decimals: u8,
}

#[account]
pub struct Person {
    pub user: Pubkey,       // The user that owns the person account
    pub token_mint: Pubkey, // The token mint that the person account is associated with
    pub vault: Pubkey,      // The associated token account that holds the person's tokens
    pub bump: u8,
}

impl Space for Person {
    const INIT_SPACE: usize =
        DISCRIMINATOR_SIZE + PUBKEY_SIZE + PUBKEY_SIZE + PUBKEY_SIZE + U8_SIZE;
}

impl Person {
    pub fn init(&mut self, user: Pubkey, token_mint: Pubkey, vault: Pubkey, bump: u8) {
        self.user = user;
        self.token_mint = token_mint;
        self.vault = vault;
        self.bump = bump;
    }
}
