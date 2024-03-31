use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount};

// Order of accounts matters for this struct.
// The first 4 accounts are the accounts required for token transfer (source, mint, destination, owner)
// Remaining accounts are the extra accounts required from the ExtraAccountMetaList account
// These accounts are provided via CPI to this program from the token2022 program
#[derive(Accounts)]
pub struct TransferHook<'info> {
    #[account(
        token::mint = mint,
        token::authority = owner,
    )]
    pub source_token: InterfaceAccount<'info, TokenAccount>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        token::mint = mint,
    )]
    pub destination_token: InterfaceAccount<'info, TokenAccount>,
    /// CHECK: source token account owner, can be SystemAccount or PDA owned by another program
    pub owner: UncheckedAccount<'info>,
    /// CHECK: ExtraAccountMetaList Account,
    #[account(
        seeds = [b"extra-account-metas", mint.key().as_ref()],
        bump
    )]
    pub extra_account_meta_list: UncheckedAccount<'info>,
}

impl<'info> TransferHook<'info> {
    pub fn handler(&self, amount: u64) -> Result<()> {
        msg!("Source Token Account: {:?}", self.source_token.key());
        msg!(
            "Destination Token Account: {:?}",
            self.destination_token.key()
        );
        msg!("Amount: {}", amount);
        Ok(())
    }
}
