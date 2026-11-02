export interface ContractFile {
  name: string;
  path: string;
  description: string;
  code: string;
  stepTags: string[];
}

export const CONTRACT_FILES: ContractFile[] = [
  {
    name: 'state.rs',
    path: 'program/src/state.rs',
    description: 'Adım 1: AccountState veri yapısına `location` (konum) alanının ve boyut hesaplayıcısının eklenmesi.',
    stepTags: ['Adım 1', 'AccountState', 'Konum Alanı'],
    code: `use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_pack::{IsInitialized, Sealed};

/// ========================================================================
/// ADIM 1: AccountState'e \`location\` (konum) alanının eklenmesi
/// ========================================================================
/// Restaurant Review PDA hesabının Solana blokzinciri üzerinde tuttuğu veriler.
/// Orijinal Movie Review sözleşmesinde sadece is_initialized, rating, title
/// ve description bulunurken, bu nihai projede restoranın konumunu saklamak
/// amacıyla \`location\` (konum) String alanı eklenmiştir.
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
pub struct AccountState {
    pub is_initialized: bool,
    pub rating: u8,
    pub title: String,
    pub location: String, // 🎯 Adım 1: Yeni eklenen konum (location) değişkeni
    pub description: String,
}

impl Sealed for AccountState {}

impl IsInitialized for AccountState {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

impl AccountState {
    /// Hesap için gereken dinamik alan boyutunu hesaplar:
    /// - 1 bayt: is_initialized (bool)
    /// - 1 bayt: rating (u8)
    /// - 4 bayt: title uzunluk öneki + title baytları
    /// - 4 bayt: location uzunluk öneki + location baytları (Adım 1)
    /// - 4 bayt: description uzunluk öneki + description baytları
    pub fn get_account_size(title: &str, location: &str, description: &str) -> usize {
        1 + 1 + (4 + title.len()) + (4 + location.len()) + (4 + description.len())
    }
}`,
  },
  {
    name: 'instruction.rs',
    path: 'program/src/instruction.rs',
    description: 'Adım 2 & Adım 3: ReviewInstruction, ReviewPayload ve unpack fonksiyonuna `location` entegrasyonu.',
    stepTags: ['Adım 2', 'Adım 3', 'ReviewInstruction', 'ReviewPayload', 'Unpack'],
    code: `use borsh::BorshDeserialize;
use solana_program::program_error::ProgramError;

/// ========================================================================
/// ADIM 2: ReviewInstruction ve ReviewPayload içerisine \`location\` eklenmesi
/// ADIM 3: Unpack fonksiyonunda yeni \`location\` dizisinin açılması
/// ========================================================================

#[derive(Debug, PartialEq)]
pub enum ReviewInstruction {
    /// 0. Talimat: Yeni bir restoran incelemesi ekle
    AddReview {
        title: String,
        rating: u8,
        location: String, // 🎯 Adım 2: Konum parametresi talimata eklendi
        description: String,
    },
    /// 1. Talimat: Var olan bir restoran incelemesini güncelle
    UpdateReview {
        title: String,
        rating: u8,
        location: String, // 🎯 Adım 2: Konum parametresi talimata eklendi
        description: String,
    },
}

/// İstemciden (client) Borsh formatında gelen talimat yükü
#[derive(BorshDeserialize, Debug)]
pub struct ReviewPayload {
    pub rating: u8,
    pub title: String,
    pub location: String, // 🎯 Adım 2: Konum parametresi yüke eklendi
    pub description: String,
}

impl ReviewInstruction {
    /// ====================================================================
    /// ADIM 3: Unpack fonksiyonunda yeni \`location\` dizisini açmak
    /// ====================================================================
    /// İstemciden gelen ham bayt verisini ayrıştırır.
    /// İlk bayt işlem çeşidini (0 = AddReview, 1 = UpdateReview),
    /// geri kalan baytlar ise Borsh ile serileştirilmiş ReviewPayload nesnesini içerir.
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variant, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;

        let payload = ReviewPayload::try_from_slice(rest)
            .map_err(|_| ProgramError::InvalidInstructionData)?;

        match variant {
            0 => Ok(Self::AddReview {
                title: payload.title,
                rating: payload.rating,
                location: payload.location, // 🎯 Adım 3: unpack içinde yeni konum verisi açıldı
                description: payload.description,
            }),
            1 => Ok(Self::UpdateReview {
                title: payload.title,
                rating: payload.rating,
                location: payload.location, // 🎯 Adım 3: unpack içinde yeni konum verisi açıldı
                description: payload.description,
            }),
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}`,
  },
  {
    name: 'processor.rs',
    path: 'program/src/processor.rs',
    description: 'Adım 4: add_restaurant_review ve update_restaurant_review içinde `location` alanının account_data içine yazılması.',
    stepTags: ['Adım 4', 'Processor', 'Account Data', 'Borsh Serialize'],
    code: `use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::invoke_signed,
    program_error::ProgramError,
    program_pack::IsInitialized,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    sysvar::Sysvar,
};

use crate::error::ReviewError;
use crate::instruction::ReviewInstruction;
use crate::state::AccountState;

pub struct Processor;

impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        // Adım 3'te güncellenen unpack metodu çağrılır
        let instruction = ReviewInstruction::unpack(instruction_data)?;

        match instruction {
            ReviewInstruction::AddReview {
                title,
                rating,
                location,
                description,
            } => {
                msg!("Talimat Çalıştırılıyor: Restoran İncelemesi Ekle");
                Self::add_restaurant_review(
                    program_id,
                    accounts,
                    title,
                    rating,
                    location,
                    description,
                )
            }
            ReviewInstruction::UpdateReview {
                title,
                rating,
                location,
                description,
            } => {
                msg!("Talimat Çalıştırılıyor: Restoran İncelemesi Güncelle");
                Self::update_restaurant_review(
                    program_id,
                    accounts,
                    title,
                    rating,
                    location,
                    description,
                )
            }
        }
    }

    /// ====================================================================
    /// ADIM 4 (A): add_restaurant_review fonksiyonunda \`location\` saklanması
    /// ====================================================================
    pub fn add_restaurant_review(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        title: String,
        rating: u8,
        location: String, // 🎯 Adım 4: Yeni konum parametresi
        description: String,
    ) -> ProgramResult {
        msg!("Restoran İncelemesi Ekleniyor: '{}' - Konum: '{}'", title, location);

        let account_info_iter = &mut accounts.iter();
        let initializer = next_account_info(account_info_iter)?;
        let pda_review = next_account_info(account_info_iter)?;
        let system_program = next_account_info(account_info_iter)?;

        // 1. İmza kontrolü: İşlemi başlatan hesabın imzası zorunludur
        if !initializer.is_signer {
            msg!("Hata: İnceleme ekleyen hesap işlemi imzalamalıdır");
            return Err(ProgramError::MissingRequiredSignature);
        }

        // 2. Derecelendirme kontrolü: 1 ile 5 arasında olmalıdır
        if rating < 1 || rating > 5 {
            msg!("Hata: Puanlama 1 ile 5 arasında olmalıdır. Verilen: {}", rating);
            return Err(ReviewError::InvalidRating.into());
        }

        // 3. String sınır kontrolleri
        if title.len() > 50 || location.len() > 100 || description.len() > 500 {
            msg!("Hata: Metin uzunlukları sınırları aşıyor");
            return Err(ReviewError::InvalidDataLength.into());
        }

        // 4. PDA Adres doğrulaması: seeds = [initializer_pubkey, title]
        let (pda, bump_seed) = Pubkey::find_program_address(
            &[initializer.key.as_ref(), title.as_bytes()],
            program_id,
        );

        if pda != *pda_review.key {
            msg!("Hata: Sağlanan PDA hesabı beklenen PDA adresiyle uyuşmuyor");
            return Err(ReviewError::InvalidPDA.into());
        }

        // 5. Gerekli hesap boyutunu ve kira muafiyeti miktarını hesapla
        let account_len = AccountState::get_account_size(&title, &location, &description);
        let rent = Rent::get()?;
        let rent_lamports = rent.minimum_balance(account_len);

        // 6. Sistem programı çağrısıyla PDA hesabını oluştur
        msg!("PDA Hesabı Oluşturuluyor: {} bayt tahsis ediliyor", account_len);
        invoke_signed(
            &system_instruction::create_account(
                initializer.key,
                pda_review.key,
                rent_lamports,
                account_len as u64,
                program_id,
            ),
            &[
                initializer.clone(),
                pda_review.clone(),
                system_program.clone(),
            ],
            &[&[initializer.key.as_ref(), title.as_bytes(), &[bump_seed]]],
        )?;

        // 7. Adım 4: account_data içinde başlık, derecelendirme ve açıklama ile birlikte
        // yeni \`location\` değişkenini de saklıyoruz.
        let account_state = AccountState {
            is_initialized: true,
            rating,
            title,
            location, // 🎯 Adım 4: Yeni konum alanı account_data'ya yazılıyor
            description,
        };

        account_state.serialize(&mut &mut pda_review.data.borrow_mut()[..])?;
        msg!("Restoran incelemesi başarıyla blokzincire kaydedildi!");

        Ok(())
    }

    /// ====================================================================
    /// ADIM 4 (B): update_restaurant_review fonksiyonunda \`location\` güncellenmesi
    /// ====================================================================
    pub fn update_restaurant_review(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        title: String,
        rating: u8,
        location: String, // 🎯 Adım 4: Güncellenen konum parametresi
        description: String,
    ) -> ProgramResult {
        msg!("Restoran İncelemesi Güncelleniyor: '{}' - Yeni Konum: '{}'", title, location);

        let account_info_iter = &mut accounts.iter();
        let initializer = next_account_info(account_info_iter)?;
        let pda_review = next_account_info(account_info_iter)?;

        // 1. İmza kontrolü
        if !initializer.is_signer {
            msg!("Hata: İncelemeyi güncelleyen hesap işlemi imzalamalıdır");
            return Err(ProgramError::MissingRequiredSignature);
        }

        // 2. Derecelendirme kontrolü
        if rating < 1 || rating > 5 {
            msg!("Hata: Puanlama 1 ile 5 arasında olmalıdır. Verilen: {}", rating);
            return Err(ReviewError::InvalidRating.into());
        }

        // 3. String sınır kontrolleri
        if title.len() > 50 || location.len() > 100 || description.len() > 500 {
            msg!("Hata: Metin uzunlukları sınırları aşıyor");
            return Err(ReviewError::InvalidDataLength.into());
        }

        // 4. PDA Adres doğrulaması
        let (pda, _bump_seed) = Pubkey::find_program_address(
            &[initializer.key.as_ref(), title.as_bytes()],
            program_id,
        );

        if pda != *pda_review.key {
            msg!("Hata: Sağlanan PDA hesabı beklenen PDA adresiyle uyuşmuyor");
            return Err(ReviewError::InvalidPDA.into());
        }

        // 5. Mevcut hesap durumunu deserialize et ve doğrula
        let mut account_state = AccountState::try_from_slice(&pda_review.data.borrow())
            .map_err(|_| ProgramError::InvalidAccountData)?;

        if !account_state.is_initialized() {
            msg!("Hata: Güncellenmek istenen hesap henüz başlatılmamış");
            return Err(ReviewError::UninitializedAccount.into());
        }

        // 6. Gerekli yeni boyutu hesapla ve realloc yap
        let new_account_len = AccountState::get_account_size(&title, &location, &description);
        if new_account_len > pda_review.data_len() {
            let rent = Rent::get()?;
            let new_minimum_balance = rent.minimum_balance(new_account_len);
            let lamports_diff = new_minimum_balance.saturating_sub(pda_review.lamports());

            if lamports_diff > 0 {
                let system_program = next_account_info(account_info_iter)?;
                solana_program::program::invoke(
                    &system_instruction::transfer(initializer.key, pda_review.key, lamports_diff),
                    &[initializer.clone(), pda_review.clone(), system_program.clone()],
                )?;
            }

            pda_review.realloc(new_account_len, false)?;
        }

        // 7. Adım 4: account_data içinde rating, location ve description güncelleniyor
        account_state.rating = rating;
        account_state.location = location; // 🎯 Adım 4: Yeni konum alanı güncellendi
        account_state.description = description;

        account_state.serialize(&mut &mut pda_review.data.borrow_mut()[..])?;
        msg!("Restoran incelemesi ve konumu başarıyla güncellendi!");

        Ok(())
    }
}`,
  },
  {
    name: 'error.rs',
    path: 'program/src/error.rs',
    description: 'Hata tanımları: geçersiz puan, yetkisiz imzalayan, uyuşmayan PDA ve sınır aşımı.',
    stepTags: ['Hatalar', 'ReviewError', 'ProgramError'],
    code: `use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Error, Debug, Copy, Clone)]
pub enum ReviewError {
    #[error("Restoran hesabı zaten başlatılmış")]
    AccountAlreadyInitialized,

    #[error("Restoran hesabı henüz başlatılmamış")]
    UninitializedAccount,

    #[error("Geçersiz puanlama değeri: Puan 1 ile 5 arasında olmalıdır")]
    InvalidRating,

    #[error("Türetilen Program Derived Address (PDA) adresi uyuşmuyor")]
    InvalidPDA,

    #[error("Girilen veri boyutu izin verilen maksimum sınırı aşıyor")]
    InvalidDataLength,

    #[error("İncelemeyi güncelleyen hesap asıl yazar ile eşleşmiyor")]
    UnauthorizedSigner,
}

impl From<ReviewError> for ProgramError {
    fn from(e: ReviewError) -> Self {
        ProgramError::Custom(e as u32)
    }
}`,
  },
  {
    name: 'lib.rs',
    path: 'program/src/lib.rs',
    description: 'Solana BPF program giriş noktası (entrypoint! macro ve modül tanımları).',
    stepTags: ['Entrypoint', 'lib.rs', 'BPF'],
    code: `pub mod error;
pub mod instruction;
pub mod processor;
pub mod state;

#[cfg(not(feature = "no-entrypoint"))]
pub mod entrypoint {
    use solana_program::{
        account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, pubkey::Pubkey,
    };

    use crate::processor::Processor;

    entrypoint!(process_instruction);

    pub fn process_instruction(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        Processor::process(program_id, accounts, instruction_data)
    }
}`,
  },
  {
    name: 'Cargo.toml',
    path: 'program/Cargo.toml',
    description: 'Rust paket yapılandırması: solana-program, borsh, thiserror bağımlılıkları ve cdylib tipi.',
    stepTags: ['Cargo.toml', 'Borsh', 'Solana CLI'],
    code: `[package]
name = "solana-restaurant-review"
version = "0.1.0"
edition = "2021"
description = "Solana Restaurant Review Smart Contract with Location Support"
authors = ["Enes Öztürk <enesbino38@gmail.com>"]

[lib]
crate-type = ["cdylib", "lib"]

[dependencies]
solana-program = "~1.18.0"
borsh = "~0.10.3"
thiserror = "~1.0.40"

[features]
no-entrypoint = []`,
  },
];
