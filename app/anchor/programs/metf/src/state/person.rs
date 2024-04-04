use anchor_lang::prelude::*;

use crate::{
    constants::{BOOL_SIZE, DISCRIMINATOR_SIZE, PUBKEY_SIZE, U64_SIZE, U8_SIZE},
    error::MyError,
};

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone)]
pub struct InitPersonTokenParams {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub decimals: u8,
    pub init_price: u64,
}

#[account]
pub struct Person {
    pub is_initialized: bool,
    pub user: Pubkey,          // The user that owns the person account
    pub token_mint: Pubkey,    // The token mint that the person account is associated with
    pub transfer_hook: Pubkey, // The transfer hook that the person account is associated with
    pub vault: Pubkey,         // The associated token account that holds the person's tokens
    pub bump: u8,
    pub current_supply: u64,
    pub init_price: u64, // how many token per SOL
    pub bonding_curve: Pubkey,
    pub reserves: u64,
}

impl Space for Person {
    const INIT_SPACE: usize = DISCRIMINATOR_SIZE
        + BOOL_SIZE
        + PUBKEY_SIZE
        + PUBKEY_SIZE
        + PUBKEY_SIZE
        + PUBKEY_SIZE
        + U8_SIZE
        + U64_SIZE
        + U64_SIZE
        + PUBKEY_SIZE
        + U64_SIZE;
}

impl Person {
    pub fn init(
        &mut self,
        user: Pubkey,
        token_mint: Pubkey,
        transfer_hook: Pubkey,
        vault: Pubkey,
        bonding_curve: Pubkey,
        init_price: u64,
        bump: u8,
    ) -> Result<()> {
        require!(!self.is_initialized, MyError::AccountAlreadyInitialized);
        self.is_initialized = true;
        self.user = user;
        self.token_mint = token_mint;
        self.transfer_hook = transfer_hook;
        self.vault = vault;
        self.bump = bump;
        self.bonding_curve = bonding_curve;
        self.current_supply = 0;
        self.init_price = init_price;
        self.reserves = 0;
        Ok(())
    }
}
