use anchor_lang::prelude::*;

use crate::{constants::CONFIG_SEED, state::Config};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
      init,
      payer = signer,
      space = Config::INIT_SPACE,
      seeds = [CONFIG_SEED.as_ref()],
      bump
    )]
    pub config: Account<'info, Config>,
    pub system_program: AccountInfo<'info>,
}

impl<'info> Initialize<'info> {
    pub fn init(&mut self, bumps: &InitializeBumps) -> Result<()> {
        self.config.init(self.signer.key(), bumps.config);
        Ok(())
    }
}
