use anchor_lang::prelude::*;

declare_id!("7QkCWdYBgV3VowU8ifAyhVHkrmGXQJLm6NGXtncTnYuq");

#[program]
pub mod metf {
    use super::*;

    pub fn greet(_ctx: Context<Initialize>) -> Result<()> {
        msg!("GM!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
