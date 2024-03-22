use anchor_lang::prelude::*;
#[derive(Accounts)]
pub struct Initialize {}

impl Initialize {
    pub fn handler(&self) -> Result<()> {
        msg!("GM!");
        Ok(())
    }
}
