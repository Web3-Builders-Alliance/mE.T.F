use anchor_lang::prelude::*;

#[error_code]
pub enum MyError {
    #[msg("Something went wrong!")]
    SomethingWentWrong,
    #[msg("Person account is already initialized")]
    AccountAlreadyInitialized,
}
