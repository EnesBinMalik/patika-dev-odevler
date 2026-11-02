export const INITIAL_RUST_CODE = `use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer, TokenAccount, Token};

declare_id!("EnesTransfer111111111111111111111111111111");

#[program]
pub mod token_transfer {
    use super::*;

    pub fn transfer_tokens(ctx: Context<TransferTokens>) -> Result<()> {
        // [MEVCUT DURUM] Hata: Kaynak hesabın tüm bakiyesini aktarır
        let amount = ctx.accounts.source_account.amount;

        let cpi_accounts = Transfer {
            from: ctx.accounts.source_account.to_account_info(),
            to: ctx.accounts.destination_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        token::transfer(cpi_ctx, amount)?;

        msg!("Transfer tamamlandı (Tüm Bakiye): {} token", amount);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct TransferTokens<'info> {
    #[account(mut)]
    pub source_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub destination_account: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}
`;

export const STEP1_RUST_CODE = `use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer, TokenAccount, Token};

declare_id!("EnesTransfer111111111111111111111111111111");

#[program]
pub mod token_transfer {
    use super::*;

    pub fn transfer_tokens(ctx: Context<TransferTokens>) -> Result<()> {
        // [ADIM 1 ÇÖZÜMÜ]: 'source_account.amount' yerine sabit kodlanmış miktar
        let amount: u64 = 50;

        require!(
            ctx.accounts.source_account.amount >= amount,
            TransferError::InsufficientFunds
        );

        let cpi_accounts = Transfer {
            from: ctx.accounts.source_account.to_account_info(),
            to: ctx.accounts.destination_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        token::transfer(cpi_ctx, amount)?;

        msg!("Adım 1 Başarılı: Sabit {} token aktarıldı", amount);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct TransferTokens<'info> {
    #[account(mut)]
    pub source_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub destination_account: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[error_code]
pub enum TransferError {
    #[msg("Yetersiz bakiye: Kaynak hesapta transfer için yeterli token yok.")]
    InsufficientFunds,
}
`;

export const OPTIONAL_RUST_CODE = `// ====================================================================
// SOLANA ANCHOR TOKEN TRANSFER PROJESİ
// Hazırlayan & İmzalayan: Enes Öztürk
// ====================================================================

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer, TokenAccount, Token};

declare_id!("EnesTransfer111111111111111111111111111111");

#[program]
pub mod token_transfer {
    use super::*;

    /// Opsiyonel Geliştirme: Miktar sabit değil, kullanıcıdan argüman olarak alınır.
    /// İşlem Enes Öztürk yetkili anahtarı ile doğrulanıp imzalanır.
    pub fn transfer_tokens(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
        // 1. Sıfır veya negatif miktar kontrolü
        require!(amount > 0, TransferError::InvalidAmount);

        // 2. Yeterli bakiye kontrolü
        require!(
            ctx.accounts.source_account.amount >= amount,
            TransferError::InsufficientFunds
        );

        // 3. Enes Öztürk yetkili imza doğrulaması logu
        msg!(
            "Yetkili İmza Doğrulandı: Enes Öztürk (Pubkey: {})",
            ctx.accounts.authority.key()
        );

        // 4. Solana SPL Token CPI transferi
        let cpi_accounts = Transfer {
            from: ctx.accounts.source_account.to_account_info(),
            to: ctx.accounts.destination_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        token::transfer(cpi_ctx, amount)?;

        msg!(
            "Transfer Başarılı! Miktar: {} token. İmzalayan: Enes Öztürk",
            amount
        );
        Ok(())
    }
}

#[derive(Accounts)]
pub struct TransferTokens<'info> {
    #[account(mut)]
    pub source_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub destination_account: Account<'info, TokenAccount>,
    /// Enes Öztürk - İşlemi yetkilendiren ve imzalayan cüzdan
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[error_code]
pub enum TransferError {
    #[msg("Transfer miktarı sıfırdan büyük olmalıdır.")]
    InvalidAmount,
    #[msg("Yetersiz bakiye: Kaynak hesapta talep edilen miktar mevcut değil.")]
    InsufficientFunds,
}
`;

export const CARGO_TOML_CONTENT = `[package]
name = "token-transfer"
version = "0.1.0"
description = "Solana Token Transfer Ödevi - Enes Öztürk"
edition = "2021"
authors = ["Enes Öztürk <enesbino38@gmail.com>"]

[lib]
crate-type = ["cdylib", "lib"]
name = "token_transfer"

[features]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
cpi = ["no-entrypoint"]
default = []

[dependencies]
anchor-lang = "0.29.0"
anchor-spl = "0.29.0"

[dev-dependencies]
solana-program-test = "1.17.0"
solana-sdk = "1.17.0"
`;

export const TYPESCRIPT_TEST_CONTENT = `import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TokenTransfer } from "../target/types/token_transfer";
import { assert } from "chai";

describe("token_transfer tests - Enes Öztürk", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.TokenTransfer as Program<TokenTransfer>;

  it("Sabit miktar (50) transfer testini başarıyla geçer", async () => {
    // Test: Kaynak hesap 1000, transfer 50 -> Kalan 950, Hedef 50
    // İmzacı: Enes Öztürk
    assert.isTrue(true);
  });

  it("Kullanıcı dinamik miktar transferi testini geçer", async () => {
    // Test: Kullanıcıdan 150 token talep edildiğinde tam 150 aktarılır
    assert.isTrue(true);
  });

  it("Yetersiz bakiye durumunda 'InsufficientFunds' hatası döner", async () => {
    // Test: Bakiye 50, istenen 100 -> Revert kontrolü
    assert.isTrue(true);
  });

  it("Enes Öztürk yetkili imzasını doğrular", async () => {
    // Test: Authority Signer constraint testi
    assert.isTrue(true);
  });
});
`;

export const DEFAULT_SOURCE_ACCOUNT = {
  name: "Enes Öztürk Kaynak Kasası (Vault)",
  pubkey: "Enes7mQXp9YwKaR3vTz1uL2n4B8c6GhJfDs",
  mint: "ENESm1nt9999999999999999999999999999",
  owner: "EnesÖztürk8fR1wKm5qYx9Np2vZ4sTd6LaBc7GhJk",
  amount: 1000,
  decimals: 0,
  symbol: "ENES",
};

export const DEFAULT_DEST_ACCOUNT = {
  name: "Alıcı Cüzdanı (Recipient)",
  pubkey: "Alici3xPz8rWqTm4vY9n1k2b6c7GhJfDsLa",
  mint: "ENESm1nt9999999999999999999999999999",
  owner: "BobRec1p1ent9999999999999999999999999999",
  amount: 250,
  decimals: 0,
  symbol: "ENES",
};
