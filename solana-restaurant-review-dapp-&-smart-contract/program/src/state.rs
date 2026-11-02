use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::program_pack::{IsInitialized, Sealed};

/// ========================================================================
/// ADIM 1: AccountState'e `location` (konum) alanının eklenmesi
/// ========================================================================
/// Restaurant Review PDA hesabının Solana blokzinciri üzerinde tuttuğu veriler.
/// Orijinal Movie Review sözleşmesinde sadece is_initialized, rating, title
/// ve description bulunurken, bu nihai projede restoranın konumunu saklamak
/// amacıyla `location` (konum) String alanı eklenmiştir.
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
pub struct AccountState {
    pub is_initialized: bool,
    pub rating: u8,
    pub title: String,
    pub location: String, // Adım 1: Yeni eklenen konum (location) değişkeni
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
}
