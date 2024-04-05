use crate::{
    constants::{CONFIG_SEED, DEFAULT_TOKEN_DECIMALS, PERSON_BANK_SEED, PERSON_SEED},
    state::{BondingCurve, Config, Person},
};
use anchor_lang::solana_program::sysvar::rent::ID as RENT_ID;
use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};
use anchor_spl::{
    associated_token::{create, AssociatedToken, Create},
    token_2022::{spl_token_2022::onchain::invoke_transfer_checked, Token2022},
    token_interface::Mint,
};

#[derive(Accounts)]
pub struct BuyToken<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [PERSON_SEED.as_ref(), person.user.as_ref()],
        bump
    )]
    pub person: Account<'info, Person>,
    #[account(address = person.token_mint)]
    pub mint: InterfaceAccount<'info, Mint>,
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
        mut,
        seeds = [
            signer.key().as_ref(),
            token_2022_program.key().as_ref(),
            mint.key().as_ref()
        ],
        seeds::program = associated_token_program.key(),
        bump
    )]
    /// CHECK
    pub user_ata: UncheckedAccount<'info>,
    /// CHECK: this is fine since we make it.
    #[account(address = person.transfer_hook)]
    pub transfer_hook: AccountInfo<'info>,
    #[account(
        mut,
        seeds = [b"extra-account-metas", mint.key().as_ref()],
        bump,
        seeds::program = transfer_hook
    )]
    /// CHECK: ExtraAccountMetaList Account, must use these seeds
    pub extra_account_meta_list: UncheckedAccount<'info>,
    /// CHECK: this is fine
    pub owner_without_fee: AccountInfo<'info>,
    #[account(
        seeds = [CONFIG_SEED.as_ref()],
        bump
      )]
    pub config: Account<'info, Config>,
    #[account(
        address = person.bonding_curve
    )]
    pub bond_curve: Account<'info, BondingCurve>,
    #[account(
        mut,
        seeds = [
            PERSON_BANK_SEED.as_ref(),
            mint.key().as_ref()
        ],
        bump,
    )]
    pub person_bank: SystemAccount<'info>,
    pub token_2022_program: Program<'info, Token2022>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    /// CHECK: this is fine since we are hard coding the rent sysvar.
    #[account(address = RENT_ID)]
    pub rent: UncheckedAccount<'info>,
}

impl<'info> BuyToken<'info> {
    pub fn buy_token(&mut self, amount: u64) -> Result<()> {
        // check user_ata acccount initialized or not
        if **self.user_ata.try_borrow_lamports()? <= 0 {
            create(CpiContext::new(
                self.associated_token_program.to_account_info(),
                Create {
                    payer: self.signer.to_account_info(), // payer
                    associated_token: self.user_ata.to_account_info(),
                    authority: self.signer.to_account_info(), // owner
                    mint: self.mint.to_account_info(),
                    system_program: self.system_program.to_account_info(),
                    token_program: self.token_2022_program.to_account_info(),
                },
            ))?;
        }

        let pool_balance = self.person_bank.lamports();
        let current_supply = self.person.current_supply;

        if current_supply == 0 {
            let token_return = amount
                .checked_div(self.person.init_price)
                .unwrap()
                .checked_mul(10u64.pow(DEFAULT_TOKEN_DECIMALS.into()))
                .unwrap();

            self.tranfer_token(token_return)?;
            self.tranfer_currency(amount)?;
            self.person.current_supply = current_supply.checked_add(token_return).unwrap();
            self.person.reserves = token_return
                .checked_mul(self.bond_curve.reserve_ratio.into())
                .unwrap()
                .checked_div(10000)
                .unwrap()
        } else {
            self.buy_token_with_curve(amount, current_supply, pool_balance)?;
        }

        Ok(())
    }

    fn buy_token_with_curve(
        &mut self,
        amount: u64,
        current_supply: u64,
        pool_balance: u64,
    ) -> Result<()> {
        let token = self
            .bond_curve
            .calculate_purchase_return(current_supply, self.person.reserves, pool_balance, amount)
            .unwrap();

        msg!("token: {}", token);

        self.tranfer_token(token)?;
        self.tranfer_currency(amount)?;

        self.person.current_supply = current_supply.checked_add(token).unwrap();
        let current_reserves = self.person.reserves;

        self.person.reserves =
            (current_reserves as f64 * (1.0 - self.bond_curve.reserve_ratio as f64 / 10000.0)
                + token as f64 * self.bond_curve.reserve_ratio as f64 / 10000.0) as u64;

        Ok(())
    }

    fn tranfer_currency(&self, amount: u64) -> Result<()> {
        transfer(
            CpiContext::new(
                self.system_program.to_account_info(),
                Transfer {
                    from: self.signer.to_account_info(),
                    to: self.person_bank.to_account_info(),
                },
            ),
            amount,
        )?;
        Ok(())
    }

    fn tranfer_token(&self, amount: u64) -> Result<()> {
        let seeds = &[
            PERSON_SEED.as_ref(),
            self.person.user.as_ref(),
            &[self.person.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        invoke_transfer_checked(
            &self.token_2022_program.to_account_info().key(),
            self.vault.to_account_info(),
            self.mint.to_account_info(),
            self.user_ata.to_account_info(),
            self.person.to_account_info(),
            &[
                self.transfer_hook.to_account_info(),
                self.extra_account_meta_list.to_account_info(),
                self.owner_without_fee.to_account_info(),
            ],
            amount,
            self.mint.decimals,
            signer_seeds,
        )?;
        Ok(())
    }
}
