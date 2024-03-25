use anchor_lang::prelude::*;
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;
pub use instructions::*;

declare_id!("7QkCWdYBgV3VowU8ifAyhVHkrmGXQJLm6NGXtncTnYuq");

#[program]
pub mod metf {
    use super::*;
    pub fn init(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.init(&ctx.bumps)
    }
}
