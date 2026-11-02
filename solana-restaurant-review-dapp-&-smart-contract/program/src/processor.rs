use borsh::{BorshDeserialize, BorshSerialize};
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
    /// ADIM 4 (A): add_restaurant_review fonksiyonunda `location` saklanması
    /// ====================================================================
    pub fn add_restaurant_review(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        title: String,
        rating: u8,
        location: String, // Adım 4: Yeni konum parametresi
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

        // 5. Gerekli hesap boyutunu ve kira muafiyeti (rent exemption) miktarını hesapla
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
        // yeni `location` değişkenini de saklıyoruz.
        let account_state = AccountState {
            is_initialized: true,
            rating,
            title,
            location, // Adım 4: Yeni konum alanı account_data'ya yazılıyor
            description,
        };

        account_state.serialize(&mut &mut pda_review.data.borrow_mut()[..])?;
        msg!("Restoran incelemesi başarıyla blokzincire kaydedildi!");

        Ok(())
    }

    /// ====================================================================
    /// ADIM 4 (B): update_restaurant_review fonksiyonunda `location` güncellenmesi
    /// ====================================================================
    pub fn update_restaurant_review(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        title: String,
        rating: u8,
        location: String, // Adım 4: Güncellenen konum parametresi
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
        account_state.location = location; // Adım 4: Yeni konum alanı güncellendi
        account_state.description = description;

        account_state.serialize(&mut &mut pda_review.data.borrow_mut()[..])?;
        msg!("Restoran incelemesi ve konumu başarıyla güncellendi!");

        Ok(())
    }
}
