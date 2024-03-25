use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::Token,
    token_interface::{mint_to, Mint, MintTo, TokenAccount},
};
use mpl_token_metadata::{
    instructions::{
        CreateMetadataAccountV3Cpi, CreateMetadataAccountV3CpiAccounts,
        CreateMetadataAccountV3InstructionArgs,
    },
    types::{Creator, DataV2},
    ID as MPL_TOKEN_METADATA_ID,
};

use crate::{
    constants::{PERSON_SEED, PERSON_TOKEN_SEED, TOKEN_LIMIT_AMOUNT},
    state::{InitPersonTokenParams, Person},
};

#[derive(Accounts)]
#[instruction(
  params: InitPersonTokenParams
)]
pub struct InitPersonToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
      init,
      payer = signer,
      space = Person::INIT_SPACE,
      seeds = [PERSON_SEED.as_ref(), signer.key().as_ref()],
      bump
    )]
    pub person: Account<'info, Person>,
    #[account(
      init,
      payer = signer,
      seeds = [PERSON_TOKEN_SEED.as_ref(), signer.key().as_ref()],
      bump,
      mint::decimals = params.decimals,
      mint::authority = person,
  )]
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
      init,
      payer = signer,
      associated_token::mint = mint,
      associated_token::authority = person,
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,
    /// CHECK: from Metaplex
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    // #[account(address = TOKEN_2022_ID)]
    pub token_program: Program<'info, Token>,
    /// CHECK: from Metaplex
    #[account(address = MPL_TOKEN_METADATA_ID)]
    pub token_metadata_program: UncheckedAccount<'info>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> InitPersonToken<'info> {
    pub fn init_token_mint(
        &mut self,
        params: InitPersonTokenParams,
        bumps: &InitPersonTokenBumps,
    ) -> Result<()> {
        let person_seeds = &[
            PERSON_SEED.as_ref(),
            self.signer.to_account_info().key.as_ref(),
            &[bumps.person],
        ];
        let creator = vec![Creator {
            address: *self.signer.to_account_info().key,
            verified: false,
            share: 100,
        }];
        let args_data = DataV2 {
            name: params.name,
            symbol: params.symbol,
            uri: params.uri,
            seller_fee_basis_points: 500,
            creators: Some(creator),
            collection: None,
            uses: None,
        };
        let args: CreateMetadataAccountV3InstructionArgs = CreateMetadataAccountV3InstructionArgs {
            is_mutable: false,
            data: args_data,
            collection_details: None,
        };
        let token_metadata_program = self.token_metadata_program.to_account_info();
        let metadata = self.metadata.to_account_info();
        let mint = self.mint.to_account_info();
        let person = self.person.to_account_info();
        let signer = self.signer.to_account_info();
        let system_program = self.system_program.to_account_info();
        let rent = self.rent.to_account_info();
        // let cpi_create_mint = CreateV1Cpi::new(
        //     &token_program,
        //     CreateV1CpiAccounts {
        //         metadata: &metadata,
        //         master_edition: None,
        //         mint: (&mint, true),
        //         authority: &person,
        //         payer: &signer,
        //         update_authority: (&person, false),
        //         system_program: &system_program,
        //         sysvar_instructions: &rent,
        //         spl_token_program: Some(&token_program),
        //     },
        //     CreateV1InstructionArgs {
        //         name: params.name,
        //         symbol: params.symbol,
        //         uri: params.uri,
        //         decimals: Some(params.decimals),
        //         seller_fee_basis_points: 500,
        //         creators: Some(creator),
        //         primary_sale_happened: false,
        //         is_mutable: false,
        //         token_standard: TokenStandard::NonFungible,
        //         collection: None,
        //         uses: None,
        //         collection_details: None,
        //         rule_set: None,
        //         print_supply: Some(PrintSupply::Limited(1000000)),
        //     },
        // );

        // cpi_create_mint.invoke()?;

        let cpi_create_metadata_account: CreateMetadataAccountV3Cpi =
            CreateMetadataAccountV3Cpi::new(
                &token_metadata_program,
                CreateMetadataAccountV3CpiAccounts {
                    metadata: &metadata,
                    mint: &mint,
                    mint_authority: &person,
                    payer: &signer,
                    update_authority: (&person, true),
                    system_program: &system_program,
                    rent: Some(&rent),
                },
                args,
            );

        cpi_create_metadata_account.invoke_signed(&[person_seeds])?;

        Ok(())
    }

    pub fn mint_token_to_vault(&mut self) -> Result<()> {
        let mint = self.mint.to_account_info();
        let vault = self.vault.to_account_info();
        let person = self.person.to_account_info();
        let person_seeds = &[
            PERSON_SEED.as_ref(),
            self.signer.to_account_info().key.as_ref(),
            &[self.person.bump],
        ];

        let cpi_accounts = MintTo {
            mint,
            to: vault,
            authority: person,
        };

        let amount = TOKEN_LIMIT_AMOUNT * 10u64.pow(self.mint.decimals as u32);

        mint_to(
            CpiContext::new_with_signer(
                self.token_program.to_account_info(),
                cpi_accounts,
                &[person_seeds],
            ),
            amount,
        )?;
        Ok(())
    }

    pub fn initialize(&mut self, bumps: &InitPersonTokenBumps) -> Result<()> {
        self.person.init(
            *self.signer.to_account_info().key,
            *self.mint.to_account_info().key,
            *self.mint.to_account_info().key,
            bumps.person,
        );
        Ok(())
    }
}
