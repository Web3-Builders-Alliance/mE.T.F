use std::ops::Mul;

use crate::{
    constants::{CONFIG_SEED, FEE_BANK_SEED, PERSON_BANK_SEED, PERSON_SEED, TOKEN_LIMIT_AMOUNT},
    state::{BondingCurve, Config, InitPersonTokenParams, Person},
};
use anchor_lang::{
    prelude::*,
    system_program::{create_account, transfer, Transfer},
};
use anchor_lang::{solana_program::sysvar::rent::ID as RENT_ID, system_program::CreateAccount};
use anchor_spl::{
    associated_token::{create, AssociatedToken, Create},
    token_2022::{
        initialize_mint2,
        spl_token_2022::{
            self,
            extension::{
                metadata_pointer::instruction::initialize as initialize_metadata_pointer,
                transfer_fee, transfer_hook::instruction::initialize as intialize_transfer_hook,
                ExtensionType,
            },
            instruction::AuthorityType,
            state::Mint,
        },
        InitializeMint2, Token2022,
    },
    token_interface::{mint_to, set_authority, MintTo, SetAuthority},
};
use solana_program::program::{invoke, invoke_signed};
use spl_token_metadata_interface::{
    instruction::initialize as initialize_metadata_account, state::TokenMetadata,
};

#[derive(Accounts)]
pub struct InitPersonToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub mint: Signer<'info>,
    #[account(init,
        payer = signer,
        space = Person::INIT_SPACE,
        seeds = [PERSON_SEED.as_ref(), signer.key().as_ref()],
        bump
    )]
    pub person: Account<'info, Person>,
    #[account(
        mut,
        seeds = [
            person.key().as_ref(),
            token_2022_program.key().as_ref(),
            mint.key().as_ref()
        ],
        seeds::program = associated_token_program.key(),
        bump
    )]
    /// CHECK: it is fine to use vault as the associated token account.
    pub vault: UncheckedAccount<'info>,
    #[account(
        seeds = [CONFIG_SEED.as_ref()],
        bump
      )]
    pub config: Account<'info, Config>,
    #[account(
        mut,
        seeds = [
            FEE_BANK_SEED.as_ref(),
        ],
        bump,
        address = config.fee_bank
    )]
    pub fee_bank: SystemAccount<'info>,
    #[account(
        mut,
        seeds = [
            PERSON_BANK_SEED.as_ref(),
            mint.key().as_ref()
        ],
        bump,
    )]
    pub person_bank: SystemAccount<'info>,
    pub bond_curve: Account<'info, BondingCurve>,
    pub token_2022_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    /// CHECK: this is fine since we are hard coding the rent sysvar.
    #[account(address = RENT_ID)]
    pub rent: UncheckedAccount<'info>,
}

impl<'info> InitPersonToken<'info> {
    pub fn init_token_mint(
        &mut self,
        params: InitPersonTokenParams,
        bumps: &InitPersonTokenBumps,
    ) -> Result<()> {
        let size = ExtensionType::try_calculate_account_len::<Mint>(&[
            ExtensionType::MetadataPointer,
            ExtensionType::TransferHook,
            ExtensionType::TransferFeeConfig,
        ])
        .unwrap();

        let metadata = TokenMetadata {
            update_authority: spl_pod::optional_keys::OptionalNonZeroPubkey::try_from(Some(
                self.signer.key(),
            ))
            .unwrap(),
            mint: self.mint.key(),
            name: params.name,
            symbol: params.symbol,
            uri: params.uri,
            additional_metadata: vec![],
        };

        let extension_extra_space = metadata.tlv_size_of().unwrap();
        let rent = &Rent::from_account_info(&self.rent.to_account_info())?;
        let lamports = rent.minimum_balance(size + extension_extra_space);

        create_account(
            CpiContext::new(
                self.token_2022_program.to_account_info(),
                CreateAccount {
                    from: self.signer.to_account_info(),
                    to: self.mint.to_account_info(),
                },
            ),
            lamports,
            (size).try_into().unwrap(),
            &spl_token_2022::id(),
        )?;

        invoke(
            &intialize_transfer_hook(
                &self.token_2022_program.key(),
                &self.mint.key(),
                Some(self.person.key()),
                Some(self.config.transfer_hook),
            )?,
            &vec![self.mint.to_account_info()],
        )?;

        invoke(
            &initialize_metadata_pointer(
                &self.token_2022_program.key(),
                &self.mint.key(),
                Some(self.person.key()),
                Some(self.mint.key()),
            )?,
            &vec![self.mint.to_account_info()],
        )?;

        invoke(
            &transfer_fee::instruction::initialize_transfer_fee_config(
                &self.token_2022_program.to_account_info().key(),
                &self.mint.to_account_info().key(),
                Some(&self.person.to_account_info().key()),
                Some(&self.person.to_account_info().key()),
                50u16,
                5000u64,
            )?,
            &vec![self.mint.to_account_info()],
        )?;

        // initialize mint
        initialize_mint2(
            CpiContext::new(
                self.token_2022_program.to_account_info(),
                InitializeMint2 {
                    mint: self.mint.to_account_info(),
                },
            ),
            6,
            &self.signer.to_account_info().key(),
            None,
        )?;

        // init metadata account
        let seeds = &[
            PERSON_SEED.as_ref(),
            self.signer.to_account_info().key.as_ref(),
            &[bumps.person],
        ];
        let signer_seeds = &[&seeds[..]];

        invoke_signed(
            &initialize_metadata_account(
                &self.token_2022_program.key(),
                &self.mint.key(),
                &self.person.key(),
                &self.mint.key(),
                &self.signer.key(),
                metadata.name,
                metadata.symbol,
                metadata.uri,
            ),
            &vec![
                self.mint.to_account_info(),
                self.person.to_account_info(),
                self.signer.to_account_info(),
            ],
            signer_seeds,
        )?;

        self.mint_to_vault()?;

        self.remove_mint_authority()?;

        self.collec_fee()?;

        // self.init_token_price()?;

        Ok(())
    }

    fn _init_token_price(&mut self) -> Result<()> {
        self.person.current_supply = self.person.current_supply.checked_add(1u64).unwrap();
        transfer(
            CpiContext::new(
                self.system_program.to_account_info(),
                Transfer {
                    from: self.signer.to_account_info(),
                    to: self.person_bank.to_account_info(),
                },
            ),
            self.person.init_price,
        )?;
        Ok(())
    }

    fn mint_to_vault(&mut self) -> Result<()> {
        // create associated token account
        create(CpiContext::new(
            self.associated_token_program.to_account_info(),
            Create {
                payer: self.signer.to_account_info(), // payer
                associated_token: self.vault.to_account_info(),
                authority: self.person.to_account_info(), // owner
                mint: self.mint.to_account_info(),
                system_program: self.system_program.to_account_info(),
                token_program: self.token_2022_program.to_account_info(),
            },
        ))?;

        // mint token to vault
        mint_to(
            CpiContext::new(
                self.token_2022_program.to_account_info(),
                MintTo {
                    mint: self.mint.to_account_info(),
                    to: self.vault.to_account_info(),
                    authority: self.signer.to_account_info(),
                },
            ),
            TOKEN_LIMIT_AMOUNT.mul(10u64.pow(9)),
        )?;

        Ok(())
    }

    fn remove_mint_authority(&mut self) -> Result<()> {
        set_authority(
            CpiContext::new(
                self.token_2022_program.to_account_info(),
                SetAuthority {
                    current_authority: self.signer.to_account_info().clone(),
                    account_or_mint: self.mint.to_account_info().clone(),
                },
            ),
            AuthorityType::MintTokens,
            None, // Set mint authority to be None
        )
    }

    pub fn collec_fee(&mut self) -> Result<()> {
        transfer(
            CpiContext::new(
                self.system_program.to_account_info(),
                Transfer {
                    from: self.signer.to_account_info(),
                    to: self.fee_bank.to_account_info(),
                },
            ),
            self.config.fee,
        )?;

        Ok(())
    }

    pub fn initialize(&mut self, init_price: u64, bumps: &InitPersonTokenBumps) -> Result<()> {
        self.person.init(
            *self.signer.to_account_info().key,
            *self.mint.to_account_info().key,
            self.config.transfer_hook,
            *self.vault.to_account_info().key,
            *self.bond_curve.to_account_info().key,
            init_price,
            bumps.person,
        )?;
        Ok(())
    }
}
