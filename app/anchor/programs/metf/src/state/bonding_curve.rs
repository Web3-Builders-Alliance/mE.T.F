use std::ops::Mul;

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
    pub fn calculate_price(&self, supply: u64) -> u64 {
        supply
    }
}
