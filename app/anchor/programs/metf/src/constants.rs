use anchor_lang::prelude::*;

pub const DISCRIMINATOR_SIZE: usize = std::mem::size_of::<u64>();
pub const PUBKEY_SIZE: usize = std::mem::size_of::<Pubkey>();
pub const U8_SIZE: usize = std::mem::size_of::<u8>();
pub const U16_SIZE: usize = std::mem::size_of::<u16>();
pub const U64_SIZE: usize = std::mem::size_of::<u64>();
pub const BOOL_SIZE: usize = std::mem::size_of::<bool>();
pub const OPTION_SIZE: usize = 1;

#[constant]
pub const CONFIG_SEED: &'static [u8] = b"config";
