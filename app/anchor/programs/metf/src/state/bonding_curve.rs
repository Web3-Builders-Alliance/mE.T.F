use anchor_lang::prelude::*;

use crate::{
    constants::{DISCRIMINATOR_SIZE, U64_SIZE, U8_SIZE},
    error::MyError,
};

#[account]
pub struct BondingCurve {
    pub model: u64,
    pub bump: u8,
    pub c: u64,
}

impl Space for BondingCurve {
    const INIT_SPACE: usize = DISCRIMINATOR_SIZE + U64_SIZE + U8_SIZE + U64_SIZE;
}

impl BondingCurve {
    pub fn calculate_purchase_return(
        &self,
        supply: u64,
        amount: u64,
        reserves: u64,
        reserve_ratio: f64,
    ) -> Result<u64> {
        let weight = 10f64.powf(6.0);
        let supply_float = supply as f64;
        msg!("supply_float: {}", supply_float);
        let reserves_float = reserves as f64;
        msg!("reserves_float: {}", reserves_float);
        // let amount_float = amount as f64;
        let normalized_supply = supply_float / weight;
        msg!("normalized_supply: {}", normalized_supply);
        let normalized_reserves = reserves_float / weight;
        msg!("normalized_reserves: {}", normalized_reserves);
        let exponent = normalized_supply / (normalized_reserves * (1.0 - reserve_ratio));
        msg!("exponent: {}", exponent);
        // let token_price = reserve_ratio.powf(exponent);
        // let tokens_for_sol = (amount_float / 10f64.powf(9.0)) / token_price;
        // let tokens_for_sol_rounded = tokens_for_sol.round() as u64;
        let token_price = reserve_ratio.powf(exponent);
        msg!("token_price: {}", token_price);

        let sol_for_tokens = amount * token_price as u64 * 10u64.pow(9);
        msg!("sol_for_tokens: {}", sol_for_tokens);

        Ok(sol_for_tokens)
    }
}
