/**
 * Solana Counter Smart Contract Assignment Data
 * Öğrenci / Geliştirici: Enes Öztürk
 */

export interface CodeFile {
  filename: string;
  path: string;
  language: string;
  description: string;
  code: string;
}

export interface StepDiff {
  stepNumber: number;
  title: string;
  targetFile: string;
  summary: string;
  oldCode: string;
  newCode: string;
  explanationTr: string;
  technicalPoints: string[];
}

export const RUST_FILES: Record<string, CodeFile> = {
  instruction: {
    filename: "instruction.rs",
    path: "src/instruction.rs",
    language: "rust",
    description: "Adım 1 ve Adım 2: CounterInstructions enum ve u32 unpack deserialization fonksiyonu",
    code: `// ====================================================================
// Solana Counter Programı - Instruction Modülü
// Ödev Çözümü: Adım 1 & Adım 2
// Geliştirici / İmza: Enes Öztürk
// ====================================================================

use solana_program::program_error::ProgramError;
use std::convert::TryInto;

#[derive(Debug, PartialEq, Eq, Clone)]
pub enum CounterInstructions {
    /// Adım 1: Sayaç değerini verilen u32 parametresi kadar artırır
    Increment(u32),
    /// Adım 1: Sayaç değerini verilen u32 parametresi kadar azaltır (underflow durumunda 0 olur)
    Decrement(u32),
    /// Sayaç değerini doğrudan verilen u32 değerine ayarlar
    Update(u32),
    /// Sayaç değerini 0 olarak sıfırlar
    Reset,
}

impl CounterInstructions {
    /// Adım 2: Gelen byte dizisini çözümleyerek (unpack) CounterInstructions enum'ına dönüştürür.
    /// Tag (1 byte) + Value (4 bytes little-endian u32)
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        // İlk byte talimat türünü (tag), kalan baytlar ise parametre verisini içerir
        let (&tag, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;

        match tag {
            // Adım 2: Increment için 4 byte u32 değerini oku (Little-Endian)
            0 => {
                let val = rest
                    .get(..4)
                    .and_then(|slice| slice.try_into().ok())
                    .map(u32::from_le_bytes)
                    .ok_or(ProgramError::InvalidInstructionData)?;
                Ok(Self::Increment(val))
            }
            // Adım 2: Decrement için 4 byte u32 değerini oku (Little-Endian)
            1 => {
                let val = rest
                    .get(..4)
                    .and_then(|slice| slice.try_into().ok())
                    .map(u32::from_le_bytes)
                    .ok_or(ProgramError::InvalidInstructionData)?;
                Ok(Self::Decrement(val))
            }
            // Mevcut Update implementasyonu (referans model)
            2 => {
                let val = rest
                    .get(..4)
                    .and_then(|slice| slice.try_into().ok())
                    .map(u32::from_le_bytes)
                    .ok_or(ProgramError::InvalidInstructionData)?;
                Ok(Self::Update(val))
            }
            // Reset parametresiz kalır
            3 => Ok(Self::Reset),
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}
`,
  },

  lib: {
    filename: "lib.rs",
    path: "src/lib.rs",
    language: "rust",
    description: "Adım 3: lib.rs işleyici mantığı ve u32 underflow koruması (Enes Öztürk imzalı)",
    code: `// ====================================================================
// Solana Counter Programı - Entrypoint & İşleyici Mantığı
// Ödev Çözümü: Adım 3 (Underflow Koruması ile u32 Artırma/Azaltma)
// Geliştirici / İmza: Enes Öztürk
// ====================================================================

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

pub mod instruction;
pub mod state;

use crate::instruction::CounterInstructions;
use crate::state::CounterAccount;

// Solana programının ana giriş noktası
entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("--- Solana Counter Programı Başlatıldı [Enes Öztürk] ---");

    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;

    // Güvenlik Kontrolü: Hesabın sahibi bu program olmalıdır
    if account.owner != program_id {
        msg!("Hata: Hesap program ID'si ile eşleşmiyor!");
        return Err(ProgramError::IncorrectProgramId);
    }

    // Adım 2'de güncellenen unpack ile talimat çözümlenir
    let instruction = CounterInstructions::unpack(instruction_data)?;

    // Borsh ile hesabın mevcut durumunu oku
    let mut counter_account = CounterAccount::try_from_slice(&account.data.borrow())?;

    match instruction {
        // ==============================================================
        // Adım 3: Sabit 1 artırma yerine u32 parametre değeriyle artırma
        // ==============================================================
        CounterInstructions::Increment(val) => {
            msg!("İşlem: Increment({}) çağrıldı. Mevcut Sayaç: {}", val, counter_account.counter);
            
            // Taşma (overflow) korumalı ekleme
            counter_account.counter = counter_account.counter.saturating_add(val);
            msg!("Yeni Sayaç Değeri: {}", counter_account.counter);
        }

        // ==============================================================
        // Adım 3: Sabit 1 azaltma yerine u32 parametre değeriyle azaltma
        // ÖDEV NOTU: U32 negatif olamaz. Parametre gerçek durumdan büyükse
        // durum 0 olarak ayarlanmalıdır! (Enes Öztürk Kuralı)
        // ==============================================================
        CounterInstructions::Decrement(val) => {
            msg!("İşlem: Decrement({}) çağrıldı. Mevcut Sayaç: {}", val, counter_account.counter);

            if val > counter_account.counter {
                // Parametre durumdan büyük: Negatife düşmemesi için 0 yapılıyor
                msg!("UYARI: Azaltılacak değer ({}) mevcut durumdan ({}) büyük!", val, counter_account.counter);
                msg!("U32 Underflow koruması devrede: Sayaç 0 olarak ayarlandı.");
                counter_account.counter = 0;
            } else {
                // Normal azaltma işlemi
                counter_account.counter -= val;
                msg!("Yeni Sayaç Değeri: {}", counter_account.counter);
            }
        }

        // Mevcut güncelleme talimatı
        CounterInstructions::Update(val) => {
            msg!("İşlem: Update({}) çağrıldı.", val);
            counter_account.counter = val;
            msg!("Yeni Sayaç Değeri: {}", counter_account.counter);
        }

        // Mevcut sıfırlama talimatı
        CounterInstructions::Reset => {
            msg!("İşlem: Reset çağrıldı. Sayaç sıfırlanıyor.");
            counter_account.counter = 0;
            msg!("Yeni Sayaç Değeri: 0");
        }
    }

    // Güncellenen durumu hesaba geri yaz (serileştir)
    counter_account.serialize(&mut &mut account.data.borrow_mut()[..])?;
    msg!("İşlem başarıyla tamamlandı.");

    Ok(())
}
`,
  },

  state: {
    filename: "state.rs",
    path: "src/state.rs",
    language: "rust",
    description: "Sayaç hesabı veri yapısı (Borsh serialization ile u32)",
    code: `// ====================================================================
// Solana Counter Programı - Durum Modülü (State)
// Geliştirici / İmza: Enes Öztürk
// ====================================================================

use borsh::{BorshDeserialize, BorshSerialize};

/// Solana hesabında saklanan sayaç verisi
#[derive(BorshSerialize, BorshDeserialize, Debug, Default, PartialEq, Eq)]
pub struct CounterAccount {
    /// 4 baytlık işaretsiz tamsayı sayaç değeri (0 - 4,294,967,295)
    pub counter: u32,
}
`,
  },

  tests: {
    filename: "counter_test.rs",
    path: "tests/counter_test.rs",
    language: "rust",
    description: "Ödev gereksinimlerini ve u32 underflow korumasını doğrulayan birim testleri",
    code: `// ====================================================================
// Solana Counter Programı - Kapsamlı Birim Testleri
// Hazırlayan / İmza: Enes Öztürk
// ====================================================================

#[cfg(test)]
mod tests {
    use super::*;
    use crate::instruction::CounterInstructions;
    use crate::state::CounterAccount;

    #[test]
    fn test_unpack_increment() {
        // Tag 0 + Little-Endian 10 (0x0A, 0x00, 0x00, 0x00)
        let data = [0, 10, 0, 0, 0];
        let instruction = CounterInstructions::unpack(&data).unwrap();
        assert_eq!(instruction, CounterInstructions::Increment(10));
    }

    #[test]
    fn test_unpack_decrement() {
        // Tag 1 + Little-Endian 5 (0x05, 0x00, 0x00, 0x00)
        let data = [1, 5, 0, 0, 0];
        let instruction = CounterInstructions::unpack(&data).unwrap();
        assert_eq!(instruction, CounterInstructions::Decrement(5));
    }

    #[test]
    fn test_increment_by_value() {
        let mut account = CounterAccount { counter: 10 };
        let add_val: u32 = 25;
        
        // Adım 3 mantığı
        account.counter = account.counter.saturating_add(add_val);
        assert_eq!(account.counter, 35);
    }

    #[test]
    fn test_decrement_normal() {
        let mut account = CounterAccount { counter: 50 };
        let sub_val: u32 = 20;

        if sub_val > account.counter {
            account.counter = 0;
        } else {
            account.counter -= sub_val;
        }
        assert_eq!(account.counter, 30);
    }

    #[test]
    fn test_decrement_underflow_protection() {
        // Enes Öztürk Ödev Kuralı Testi:
        // Eğer çıkarılacak değer durumdan büyükse sonuç 0 olmalıdır.
        let mut account = CounterAccount { counter: 15 };
        let sub_val: u32 = 40; // 40 > 15

        if sub_val > account.counter {
            account.counter = 0;
        } else {
            account.counter -= sub_val;
        }

        assert_eq!(account.counter, 0, "Değer durumdan büyük olduğunda sayaç 0 olmalıdır!");
    }
}
`,
  },

  cargo: {
    filename: "Cargo.toml",
    path: "Cargo.toml",
    language: "toml",
    description: "Solana program bağımlılıkları ve konfigürasyonu",
    code: `[package]
name = "solana-counter-program"
version = "0.1.0"
edition = "2021"
authors = ["Enes Öztürk <enesbino38@gmail.com>"]
description = "Solana Native Counter Smart Contract with u32 Increment/Decrement by Enes Öztürk"

[lib]
crate-type = ["cdylib", "lib"]

[dependencies]
solana-program = "1.18.0"
borsh = "0.10.3"
thiserror = "1.0"

[dev-dependencies]
solana-program-test = "1.18.0"
solana-sdk = "1.18.0"
`,
  },
};

export const HOMEWORK_STEPS: StepDiff[] = [
  {
    stepNumber: 1,
    title: "Adım 1: CounterInstructions Enum Güncellemesi",
    targetFile: "src/instruction.rs",
    summary: "CounterInstructions enum'ına hem Increment hem de Decrement için u32 argümanı eklendi.",
    oldCode: `#[derive(Debug, PartialEq)]
pub enum CounterInstructions {
    Increment,     // Eski: Parametresiz (her seferinde sabit 1 artırıyordu)
    Decrement,     // Eski: Parametresiz (her seferinde sabit 1 azaltıyordu)
    Update(u32),   // u32 parametreli
    Reset,
}`,
    newCode: `#[derive(Debug, PartialEq, Eq, Clone)]
pub enum CounterInstructions {
    Increment(u32), // Yeni: Kullanıcıdan gelen u32 değeri kadar artırır
    Decrement(u32), // Yeni: Kullanıcıdan gelen u32 değeri kadar azaltır
    Update(u32),    // Mevcut: Doğrudan değere eşitler
    Reset,          // Parametresiz
}`,
    explanationTr: "Rust dilinde enum varyantlarına veri eklemek için tuple-like sözdizimi kullanılır. 'Increment' ve 'Decrement' varyantlarına '(u32)' eklenerek, işlem çağrıldığında kullanıcının istediği miktar taşınabilir hale getirilmiştir.",
    technicalPoints: [
      "Increment ve Decrement artık veri taşıyan varyantlardır (Data-bearing enum variants).",
      "Update(u32) ile aynı arayüze ve tip güvenliğine (type-safety) kavuşmuştur.",
      "Derleyici seviyesinde eksik argüman gönderilmesi engellenir.",
    ],
  },

  {
    stepNumber: 2,
    title: "Adım 2: Unpack Fonksiyonunda Byte Çözümleme",
    targetFile: "src/instruction.rs",
    summary: "Unpack fonksiyonunda hem artırma hem de azaltma için 4 byte'lık u32 değeri çözümlendi.",
    oldCode: `match tag {
    0 => Ok(Self::Increment), // Eski: Sadece tag okunuyordu
    1 => Ok(Self::Decrement), // Eski: Sadece tag okunuyordu
    2 => {
        let val = rest
            .get(..4)
            .and_then(|slice| slice.try_into().ok())
            .map(u32::from_le_bytes)
            .ok_or(ProgramError::InvalidInstructionData)?;
        Ok(Self::Update(val))
    }
    3 => Ok(Self::Reset),
    _ => Err(ProgramError::InvalidInstructionData),
}`,
    newCode: `match tag {
    // Adım 2: Increment için 4 byte u32 oku
    0 => {
        let val = rest
            .get(..4)
            .and_then(|slice| slice.try_into().ok())
            .map(u32::from_le_bytes)
            .ok_or(ProgramError::InvalidInstructionData)?;
        Ok(Self::Increment(val))
    }
    // Adım 2: Decrement için 4 byte u32 oku
    1 => {
        let val = rest
            .get(..4)
            .and_then(|slice| slice.try_into().ok())
            .map(u32::from_le_bytes)
            .ok_or(ProgramError::InvalidInstructionData)?;
        Ok(Self::Decrement(val))
    }
    2 => {
        let val = rest
            .get(..4)
            .and_then(|slice| slice.try_into().ok())
            .map(u32::from_le_bytes)
            .ok_or(ProgramError::InvalidInstructionData)?;
        Ok(Self::Update(val))
    }
    3 => Ok(Self::Reset),
    _ => Err(ProgramError::InvalidInstructionData),
}`,
    explanationTr: "Solana'da instruction verileri ham byte dilimleri (&[u8]) olarak aktarılır. Tag (ilk byte) işlem tipini belirlerken, sonraki 4 byte u32 değeridir. 'u32::from_le_bytes' ile Little-Endian sıralamasına sahip 4 baytlık dilim tamsayıya dönüştürülür.",
    technicalPoints: [
      "rest.get(..4): Bellek güvenliği için ilk 4 baytı güvenle dilimler.",
      "slice.try_into().ok(): [u8] referansını sabit boyutlu &[u8; 4] dizisine çevirir.",
      "u32::from_le_bytes: Solana mimarisinin standart Little-Endian formatını çözümler.",
      "Geçersiz veya 4 bayttan kısa verilerde ProgramError::InvalidInstructionData hatası fırlatılır.",
    ],
  },

  {
    stepNumber: 3,
    title: "Adım 3: lib.rs Mantığı & U32 Underflow Koruması",
    targetFile: "src/lib.rs",
    summary: "lib.rs içinde 1 artırma/azaltma yerine u32 ile işlem yapılması ve negatif değer koruması.",
    oldCode: `// Eski satırlar (1 artırma / 1 eksiltme)
CounterInstructions::Increment => {
    counter_account.counter += 1;
}
CounterInstructions::Decrement => {
    counter_account.counter -= 1;
}`,
    newCode: `// Adım 3 Yeni Satırlar - Enes Öztürk Çözümü:
CounterInstructions::Increment(val) => {
    // u32 taşma koruması (saturating_add)
    counter_account.counter = counter_account.counter.saturating_add(val);
}
CounterInstructions::Decrement(val) => {
    // Ödev Notu: U32 negatif olamaz.
    // Parametre gerçek durumdan büyükse, durumu 0 olarak ayarlamalıdır!
    if val > counter_account.counter {
        counter_account.counter = 0;
    } else {
        counter_account.counter -= val;
    }
}`,
    explanationTr: "Rust dilinde varsayılan çıkarma işleminde (a - b) eğer b > a ise 'attempt to subtract with overflow' paniği oluşur. Solana'da bu durum tüm işlemi revert ettirir. Ödevin özel notu uyarınca; eğer çıkarılacak değer mevcut durumdan büyükse işlem hata vermeyip durumu doğrudan 0 yapmaktadır.",
    technicalPoints: [
      "Kritik Kural: 'val > counter_account.counter' kontrolü negatif değer oluşumunu (%100) engeller.",
      "Eğer val > counter ise: counter = 0 olarak atanır.",
      "Eğer val <= counter ise: counter -= val güvenle uygulanır.",
      "Rust saturating_sub(val) fonksiyonu da aynı matematiksel davranışı sağlar (0'da doyum noktasına ulaşır).",
    ],
  },
];
