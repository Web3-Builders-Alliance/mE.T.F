use crate::{
    constants::{CONFIG_SEED, PERSON_BANK_SEED, PERSON_SEED},
    state::{BondingCurve, Config, Person},
};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::rent::ID as RENT_ID;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::{burn, Burn, Token2022},
    token_interface::Mint,
};

#[derive(Accounts)]
pub struct SellToken<'info> {
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
    /// CHECK: this is fine since we make it.
    #[account(address = person.transfer_hook)]
    pub transfer_hook: AccountInfo<'info>,
    #[account(
      mut,
      seeds = [b"extra-account-metas", mint.key().as_ref()],
      bump,
      seeds::program = transfer_hook
  )]
    /// CHECK: ExtraAccountMetaList Account, must use these seeds
    pub extra_account_meta_list: UncheckedAccount<'info>,
    /// CHECK: this is fine
    pub owner_without_fee: AccountInfo<'info>,
    #[account(
      seeds = [CONFIG_SEED.as_ref()],
      bump
    )]
    pub config: Account<'info, Config>,
    #[account(
      address = person.bonding_curve
  )]
    pub bond_curve: Account<'info, BondingCurve>,
    #[account(
      mut,
      seeds = [
          PERSON_BANK_SEED.as_ref(),
          mint.key().as_ref()
      ],
      bump,
  )]
    pub person_bank: SystemAccount<'info>,
    pub token_2022_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    /// CHECK: this is fine since we are hard coding the rent sysvar.
    #[account(address = RENT_ID)]
    pub rent: UncheckedAccount<'info>,
}

impl<'info> SellToken<'info> {
    pub fn sell_token(&mut self, _amount: u64) -> Result<()> {
        // Implement the sell token logic here

        burn(
            CpiContext::new(
                self.token_2022_program.to_account_info(),
                Burn {
                    mint: self.mint.to_account_info(),
                    from: self.user_ata.to_account_info(),
                    authority: self.signer.to_account_info(),
                },
            ),
            _amount,
        )?;
        self.person.current_supply = self.person.current_supply.checked_sub(_amount).unwrap();
        Ok(())
    }
}
