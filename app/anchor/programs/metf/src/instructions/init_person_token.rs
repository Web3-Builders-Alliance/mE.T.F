use crate::{
    constants::{PERSON_SEED, PERSON_TOKEN_SEED, TOKEN_LIMIT_AMOUNT},
    state::{InitPersonTokenParams, Person},
};
use anchor_lang::{
    prelude::*,
    system_program::{create_account, create_account_with_seed, CreateAccountWithSeed},
};
use anchor_lang::{solana_program::sysvar::rent::ID as RENT_ID, system_program::CreateAccount};
use anchor_spl::{
    associated_token::{create, AssociatedToken, Create},
    token_2022::{
        spl_token_2022::{
            self,
            extension::{
                metadata_pointer::instruction::initialize as initialize_metadata_pointer,
                transfer_hook::instruction::initialize as intialize_transfer_hook, ExtensionType,
            },
            instruction::{initialize_mint2, AuthorityType},
            state::Mint,
        },
        Token2022,
    },
    token_interface::{mint_to, set_authority, MintTo, SetAuthority},
};
use solana_program::program::invoke_signed;
use spl_token_metadata_interface::state::TokenMetadata;

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
    /// CHECK it's ok
    #[account(
      mut,
      seeds = [PERSON_TOKEN_SEED.as_ref()],
      bump,
    )]
    pub mint: UncheckedAccount<'info>,
    /// CHECK it'ok
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
    pub vault: UncheckedAccount<'info>,
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
        let person_seeds = &[
            PERSON_SEED.as_ref(),
            self.signer.to_account_info().key.as_ref(),
            &[bumps.person],
        ];

        let size = ExtensionType::try_calculate_account_len::<Mint>(&[
            ExtensionType::MetadataPointer,
            ExtensionType::TransferHook,
        ])
        .unwrap();

        let metadata = TokenMetadata {
            update_authority: spl_pod::optional_keys::OptionalNonZeroPubkey::try_from(Some(
                self.person.key(),
            ))
            .unwrap(),
            mint: self.mint.key(),
            name: params.name,
            symbol: params.symbol,
            uri: params.uri,
            additional_metadata: vec![(
                "description".to_string(),
                "This is a test token".to_string(),
            )],
        };

        let extension_extra_space = metadata.tlv_size_of().unwrap();
        let rent = &Rent::from_account_info(&self.rent.to_account_info())?;
        let lamports = rent.minimum_balance(size + extension_extra_space);

        create_account_with_seed(
            CpiContext::new_with_signer(
                self.token_2022_program.to_account_info(),
                CreateAccountWithSeed {
                    from: self.signer.to_account_info(),
                    to: self.mint.to_account_info(),
                    base: self.signer.to_account_info(),
                },
                &[person_seeds],
            ),
            std::str::from_utf8(PERSON_TOKEN_SEED).unwrap(),
            lamports,
            (size).try_into().unwrap(),
            &self.person.key(),
        )?;

        // invoke_signed(
        //     &solana_program::system_instruction::create_account(
        //         &self.person.key(),
        //         &self.mint.key(),
        //         lamports,
        //         (size).try_into().unwrap(),
        //         &spl_token_2022::id(),
        //     ),
        //     &vec![self.person.to_account_info(), self.mint.to_account_info()],
        //     &[person_seeds],
        // )?;

        Ok(())
    }

    pub fn mint_token_to_vault(&mut self) -> Result<()> {
        // let mint = self.mint.to_account_info();
        // let vault = self.vault.to_account_info();
        // let person = self.person.to_account_info();
        // let person_seeds = &[
        //     PERSON_SEED.as_ref(),
        //     self.signer.to_account_info().key.as_ref(),
        //     &[self.person.bump],
        // ];

        // let cpi_accounts = MintTo {
        //     mint,
        //     to: vault,
        //     authority: person,
        // };

        // let amount = TOKEN_LIMIT_AMOUNT * 10u64.pow(self.mint.decimals as u32);

        // mint_to(
        //     CpiContext::new_with_signer(
        //         self.token_program.to_account_info(),
        //         cpi_accounts,
        //         &[person_seeds],
        //     ),
        //     amount,
        // )?;
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
