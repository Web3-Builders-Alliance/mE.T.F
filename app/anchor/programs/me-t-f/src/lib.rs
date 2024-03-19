use anchor_lang::prelude::*;

declare_id!("87EjUQYBASSBK69wYeo5mDCEtEMMFK6HxHedFuhQZHCj");

#[program]
pub mod me_t_f {
    use super::*;

    pub fn greet(_ctx: Context<Initialize>) -> Result<()> {
        msg!("GM!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
