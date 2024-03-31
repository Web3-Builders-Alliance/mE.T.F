use anchor_lang::prelude::*;

use crate::{constants::CONFIG_SEED, state::Config};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    /// CHECK: this is fine since we make it.
    pub transfer_hook: UncheckedAccount<'info>,
    #[account(
      init,
      payer = signer,
      space = Config::INIT_SPACE,
      seeds = [CONFIG_SEED.as_ref()],
      bump
    )]
    pub config: Account<'info, Config>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn init(&mut self, bumps: &InitializeBumps) -> Result<()> {
        self.config.init(
            self.signer.to_account_info().key(),
            self.transfer_hook.to_account_info().key(),
            bumps.config,
        );
        Ok(())
    }
}
