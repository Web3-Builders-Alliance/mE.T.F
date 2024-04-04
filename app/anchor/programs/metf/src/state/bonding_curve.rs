use anchor_lang::prelude::*;

use crate::constants::{DISCRIMINATOR_SIZE, U16_SIZE, U64_SIZE, U8_SIZE};

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
        pool_balance: u64,
        amount: u64,
    ) -> Result<u64> {
        let new_pool_balance = pool_balance.checked_add(amount).unwrap();
        let new_supply = current_supply.checked_add(amount).unwrap();
        let new_pool_balance = new_pool_balance as f64;
        let new_supply = new_supply as f64;
        let reserve_ratio = self.reserve_ratio as f64;
        let amount = amount as f64;
        let result = new_supply
            * (1.0 - (new_pool_balance / (new_pool_balance + amount)).powf(reserve_ratio) - 1.0);
        Ok(result as u64)
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
}
