use crate::{constants::PERSON_SEED, state::Person};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::rent::ID as RENT_ID;
use anchor_spl::{
    associated_token::{create, AssociatedToken, Create},
    token_2022::{
        spl_token_2022::extension::transfer_fee::instruction::transfer_checked_with_fee, Token2022,
    },
    token_interface::{transfer_checked, Mint, TransferChecked},
};
use solana_program::program::invoke_signed;

#[derive(Accounts)]
pub struct BuyToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [PERSON_SEED.as_ref(), person.user.as_ref()],
        bump
    )]
    pub person: Account<'info, Person>,
    #[account(address = person.token_mint)]
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        mut,
        seeds = [
            person.key().as_ref(),
            token_2022_program.key().as_ref(),
            mint.key().as_ref()
        ],
        seeds::program = associated_token_program.key(),
        bump
    )]
    /// CHECK: it is fine to use vault as the associated token account.
    pub vault: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [
            signer.key().as_ref(),
            token_2022_program.key().as_ref(),
            mint.key().as_ref()
        ],
        seeds::program = associated_token_program.key(),
        bump
    )]
    /// CHECK
    pub user_ata: UncheckedAccount<'info>,
    pub token_2022_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    /// CHECK: this is fine since we are hard coding the rent sysvar.
    #[account(address = RENT_ID)]
    pub rent: UncheckedAccount<'info>,
}

impl<'info> BuyToken<'info> {
    pub fn buy_token(&mut self, amount: u64) -> Result<()> {
        create(CpiContext::new(
            self.associated_token_program.to_account_info(),
            Create {
                payer: self.signer.to_account_info(), // payer
                associated_token: self.user_ata.to_account_info(),
                authority: self.signer.to_account_info(), // owner
                mint: self.mint.to_account_info(),
                system_program: self.system_program.to_account_info(),
                token_program: self.token_2022_program.to_account_info(),
            },
        ))?;

        let seeds = &[
            PERSON_SEED.as_ref(),
            self.person.user.as_ref(),
            &[self.person.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        // invoke_signed(
        //     &transfer_checked_with_fee(
        //         &self.token_2022_program.to_account_info().key(),
        //         &self.vault.to_account_info().key(),
        //         &self.mint.to_account_info().key(),
        //         &self.user_ata.to_account_info().key(),
        //         &self.person.to_account_info().key(),
        //         &[&self.person.to_account_info().key()],
        //         amount,
        //         self.mint.decimals,
        //         5000,
        //     )?,
        //     &[
        //         self.token_2022_program.to_account_info(),
        //         self.vault.to_account_info(),
        //         self.mint.to_account_info(),
        //         self.user_ata.to_account_info(),
        //         self.person.to_account_info(),
        //         self.signer.to_account_info(),
        //         self.system_program.to_account_info(),
        //     ],
        //     signer_seeds,
        // )?;

        transfer_checked(
            CpiContext::new_with_signer(
                self.token_2022_program.to_account_info(),
                TransferChecked {
                    from: self.vault.to_account_info(),
                    to: self.user_ata.to_account_info(),
                    authority: self.person.to_account_info(),
                    mint: self.mint.to_account_info(),
                },
                signer_seeds,
            ),
            amount,
            self.mint.decimals,
        )?;
        Ok(())
    }
}
