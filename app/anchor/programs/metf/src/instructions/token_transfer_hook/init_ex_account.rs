use anchor_lang::{
    prelude::*,
    system_program::{create_account, CreateAccount},
};
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenInterface},
};
use spl_tlv_account_resolution::state::ExtraAccountMetaList;
use spl_transfer_hook_interface::instruction::ExecuteInstruction;

use crate::constants::EXTRA_ACCOUNT_META_SEED;
#[derive(Accounts)]
pub struct InitializeExtraAccountMetaList<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    /// CHECK: ExtraAccountMetaList Account, must use these seeds
    #[account(
        mut,
        seeds = [b"extra-account-metas", mint.key().as_ref()],
        bump
    )]
    pub extra_account_meta_list: AccountInfo<'info>,
    pub mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeExtraAccountMetaList<'info> {
    pub fn handler(
        &mut self,
        bumps: &InitializeExtraAccountMetaListBumps,
        program_id: &Pubkey,
    ) -> Result<()> {
        let account_metas = vec![];
        // calculate account size
        let account_size = ExtraAccountMetaList::size_of(account_metas.len())? as u64;
        // calculate minimum required lamports
        let lamports = Rent::get()?.minimum_balance(account_size as usize);

        let mint = self.mint.key();
        let signer_seeds: &[&[&[u8]]] = &[&[
            EXTRA_ACCOUNT_META_SEED.as_ref(),
            &mint.as_ref(),
            &[bumps.extra_account_meta_list],
        ]];

        // create ExtraAccountMetaList account
        create_account(
            CpiContext::new(
                self.system_program.to_account_info(),
                CreateAccount {
                    from: self.payer.to_account_info(),
                    to: self.extra_account_meta_list.to_account_info(),
                },
            )
            .with_signer(signer_seeds),
            lamports,
            account_size,
            program_id,
        )?;

        // initialize ExtraAccountMetaList account with extra accounts
        ExtraAccountMetaList::init::<ExecuteInstruction>(
            &mut self.extra_account_meta_list.try_borrow_mut_data()?,
            &account_metas,
        )?;
        Ok(())
    }
}

pub fn init_ex_account<'info>(
    program_id: &Pubkey,
    payer: &Signer<'info>,
    mint: &AccountInfo<'info>,
    extra_account_meta_list: &AccountInfo<'info>,
    extra_account_meta_list_bump: &u8,
    system_program: &Program<'info, System>,
) -> Result<()> {
    msg!("Init Extra Account Meta List");
    let account_metas = vec![];
    // calculate account size
    let account_size = ExtraAccountMetaList::size_of(account_metas.len())? as u64;
    // calculate minimum required lamports
    let lamports = Rent::get()?.minimum_balance(account_size as usize);

    let mint = mint.key();
    let signer_seeds: &[&[&[u8]]] = &[&[
        b"extra-account-metas",
        &mint.as_ref(),
        &[*extra_account_meta_list_bump],
    ]];

    // create ExtraAccountMetaList account
    create_account(
        CpiContext::new(
            system_program.to_account_info(),
            CreateAccount {
                from: payer.to_account_info(),
                to: extra_account_meta_list.to_account_info(),
            },
        )
        .with_signer(signer_seeds),
        lamports,
        account_size,
        program_id,
    )?;

    // initialize ExtraAccountMetaList account with extra accounts
    ExtraAccountMetaList::init::<ExecuteInstruction>(
        &mut extra_account_meta_list.try_borrow_mut_data()?,
        &account_metas,
    )?;
    Ok(())
}
