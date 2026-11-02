use solana_program::program_error::ProgramError;
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
}
