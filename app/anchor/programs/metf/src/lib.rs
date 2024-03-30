use anchor_lang::prelude::*;
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;
pub use instructions::*;

pub use state::InitPersonTokenParams;

declare_id!("4sRHEgBbnAg7snoVaDimSTV3JV6QXUm8JgbAfDXTZqnU");

#[program]
pub mod metf {

    use super::*;
    pub fn init(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.init(&ctx.bumps)
    }

    pub fn init_person_token(
        ctx: Context<InitPersonToken>,
        params: InitPersonTokenParams,
    ) -> Result<()> {
        ctx.accounts.initialize(&ctx.bumps)?;
        ctx.accounts.init_token_mint(params.clone(), &ctx.bumps)
    }

    pub fn buy_token(ctx: Context<BuyToken>, amount: u64) -> Result<()> {
        ctx.accounts.buy_token(amount)
    }
}
