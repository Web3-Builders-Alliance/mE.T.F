use anchor_lang::prelude::*;

use crate::constants::{DEFAULT_TOKEN_DECIMALS, DISCRIMINATOR_SIZE, U16_SIZE, U64_SIZE, U8_SIZE};

#[account]
pub struct BondingCurve {
    pub model: u64,
    pub bump: u8,
    pub reserve_ratio: u16, // in percentage 100 ~ 10000
    pub weight: u64,
}

impl Space for BondingCurve {
    const INIT_SPACE: usize = DISCRIMINATOR_SIZE + U64_SIZE + U8_SIZE + U16_SIZE + U64_SIZE;
}

impl BondingCurve {
    // implement calculate amount token token return when deposit a amount sol by bonding curve formula
    pub fn calculate_purchase_return(
        &self,
        current_supply: u64,
        reserves: u64,
        pool_balance: u64,
        amount: u64,
    ) -> Result<u64> {
        let reserve_ratio = self.reserve_ratio as f64;
        let weight = self.weight;
        let sol_price = pool_balance as f64 / current_supply as f64;
        let token = Self::get_tokens_a_for_sol(
            amount,
            current_supply,
            reserves,
            reserve_ratio,
            weight,
            sol_price,
        );
        Ok(token)
    }

    // implement calculate amount sol need to deposit to get a amount token by bonding curve formula
    pub fn calculate_purchase_price(
        &self,
        current_supply: u64,
        pool_balance: u64,
        amount: u64,
    ) -> Result<u64> {
        let new_pool_balance = pool_balance.checked_add(amount).unwrap();
        let new_supply = current_supply.checked_add(amount).unwrap();
        let new_pool_balance = new_pool_balance as f64;
        let new_supply = new_supply as f64;
        let reserve_ratio = self.reserve_ratio as f64;
        let amount = amount as f64;
        let result = new_pool_balance
            * (1.0 - (new_supply / (new_supply + amount)).powf(1.0 / reserve_ratio) - 1.0);
        Ok(result as u64)
    }

    fn get_tokens_a_for_sol(
        amount_sol: u64,
        supply: u64,
        reserves: u64,
        reserve_ratio: f64,
        weight: u64,
        sol_price: f64,
    ) -> u64 {
        let supply_float = supply as f64;

        let reserves_float = reserves as f64;

        let weight_float = weight as f64;

        let amount_sol_float = amount_sol as f64;

        let ratio = reserve_ratio / 10000.0;

        let normalized_supply = supply_float / weight_float;

        let normalized_reserves = reserves_float / weight_float;

        let exponent = normalized_supply / (normalized_reserves * (1.0 - ratio));

        let token_price = ratio.powf(exponent);

        let tokens_for_sol = (amount_sol_float / sol_price)
            / token_price
            / 10f64.powf(DEFAULT_TOKEN_DECIMALS as f64)
            * weight_float;

        let tokens_for_sol_rounded = tokens_for_sol.round() as u64;

        tokens_for_sol_rounded
    }
}
