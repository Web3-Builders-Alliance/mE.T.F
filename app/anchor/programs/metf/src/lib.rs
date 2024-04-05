use anchor_lang::prelude::*;
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

pub use instructions::*;

pub use state::InitPersonTokenParams;

declare_id!("5jB9vrwJC28KUgZfBoQPhpnKq7deSMzCNeDvoPrAzNv6");

#[program]
pub mod metf {

    use spl_transfer_hook_interface::instruction::TransferHookInstruction;

    use super::*;
    pub fn init(ctx: Context<Initialize>, fee: u64) -> Result<()> {
        ctx.accounts.init(fee, &ctx.bumps)
    }

    pub fn create_bonding_model(
        ctx: Context<CreateBondingModel>,
        model: u64,
        reserve_ratio: u16,
        weight: u64,
    ) -> Result<()> {
        ctx.accounts
            .handler(model, reserve_ratio, weight, &ctx.bumps)
    }

    pub fn init_person_token(
        ctx: Context<InitPersonToken>,
        params: InitPersonTokenParams,
    ) -> Result<()> {
        ctx.accounts.initialize(params.init_price, &ctx.bumps)?;
        ctx.accounts.init_token_mint(params.clone(), &ctx.bumps)
    }

    pub fn buy_token(ctx: Context<BuyToken>, amount: u64) -> Result<()> {
        ctx.accounts.buy_token(amount)
    }

    pub fn sell_token(ctx: Context<SellToken>, amount: u64) -> Result<()> {
        ctx.accounts.sell_token(amount)
    }

    pub fn transfer_hook(ctx: Context<TransferHook>, amount: u64) -> Result<()> {
        ctx.accounts.handler(amount)
    }

    pub fn initialize_extra_account_meta_list(
        ctx: Context<InitializeExtraAccountMetaList>,
    ) -> Result<()> {
        ctx.accounts.handler(&ctx.bumps, &ctx.program_id)
    }

    // fallback instruction handler as workaround to anchor instruction discriminator check
    pub fn fallback<'info>(
        program_id: &Pubkey,
        accounts: &'info [AccountInfo<'info>],
        data: &[u8],
    ) -> Result<()> {
        let instruction = TransferHookInstruction::unpack(data)?;

        // match instruction discriminator to transfer hook interface execute instruction
        // token2022 program CPIs this instruction on token transfer
        match instruction {
            TransferHookInstruction::Execute { amount } => {
                let amount_bytes = amount.to_le_bytes();

                // invoke custom transfer hook instruction on our program
                __private::__global::transfer_hook(program_id, accounts, &amount_bytes)
            }
            _ => return Err(ProgramError::InvalidInstructionData.into()),
        }
    }
}
