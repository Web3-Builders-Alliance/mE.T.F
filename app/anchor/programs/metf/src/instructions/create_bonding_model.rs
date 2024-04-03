use anchor_lang::prelude::*;

use crate::{
    constants::{BONDING_CURVE_SEED, CONFIG_SEED},
    error::MyError,
    state::{BondingCurve, Config},
};

#[derive(Accounts)]
#[instruction(model: u64)]
pub struct CreateBondingModel<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        space = BondingCurve::INIT_SPACE,
        seeds = [
            BONDING_CURVE_SEED.as_ref(),
            model.to_le_bytes().as_ref(),
        ],
        bump,
    )]
    pub bonding_curve: Account<'info, BondingCurve>,
    #[account(
        seeds = [CONFIG_SEED.as_ref()],
        bump
      )]
    pub config: Account<'info, Config>,
    pub system_program: Program<'info, System>,
}

impl<'info> CreateBondingModel<'info> {
    pub fn handler(&mut self, model: u64, c: u64, bumps: &CreateBondingModelBumps) -> Result<()> {
        require!(c > 0, MyError::InvalidCValue);
        require!(self.config.admin == *self.signer.key, MyError::Unauthorized);
        self.bonding_curve.model = model;
        self.bonding_curve.c = c;
        self.bonding_curve.bump = bumps.bonding_curve;
        Ok(())
    }
}
