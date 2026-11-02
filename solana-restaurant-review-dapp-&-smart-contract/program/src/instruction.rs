use borsh::BorshDeserialize;
use solana_program::program_error::ProgramError;

/// ========================================================================
/// ADIM 2: ReviewInstruction ve ReviewPayload içerisine `location` eklenmesi
/// ADIM 3: Unpack fonksiyonunda yeni `location` dizisinin açılması
/// ========================================================================

#[derive(Debug, PartialEq)]
pub enum ReviewInstruction {
    /// 0. Talimat: Yeni bir restoran incelemesi ekle
    AddReview {
        title: String,
        rating: u8,
        location: String, // Adım 2: Konum parametresi talimata eklendi
        description: String,
    },
    /// 1. Talimat: Var olan bir restoran incelemesini güncelle
    UpdateReview {
        title: String,
        rating: u8,
        location: String, // Adım 2: Konum parametresi talimata eklendi
        description: String,
    },
}

/// İstemciden (client) Borsh formatında gelen talimat yükü
#[derive(BorshDeserialize, Debug)]
pub struct ReviewPayload {
    pub rating: u8,
    pub title: String,
    pub location: String, // Adım 2: Konum parametresi yüke eklendi
    pub description: String,
}

impl ReviewInstruction {
    /// ====================================================================
    /// ADIM 3: Unpack fonksiyonunda yeni `location` dizisini açmak
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
                location: payload.location, // Adım 3: unpack içinde yeni konum verisi açıldı
                description: payload.description,
            }),
            1 => Ok(Self::UpdateReview {
                title: payload.title,
                rating: payload.rating,
                location: payload.location, // Adım 3: unpack içinde yeni konum verisi açıldı
                description: payload.description,
            }),
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}
