import { Language, TraceStep, TriangleType } from '../types';

export function ucgen(satirSayisi: number, karakter: string = 'O', imza: boolean = true): string[] {
  const satirlar: string[] = [];
  let i = 1; // 1'den başlayarak satır sayısını kontrol eden while değişkeni

  // 1. DÖNGÜ: Satırları yöneten WHILE döngüsü
  while (i <= satirSayisi) {
    let satir = '';

    // 2. DÖNGÜ: Her satırdaki karakterleri basan FOR döngüsü
    for (let j = 0; j < i; j++) {
      satir += (j === 0 ? karakter : ` ${karakter}`);
    }

    satirlar.push(satir);
    i++;
  }

  // Enes Öztürk İmzası (Ödev isterine uygun olarak)
  if (imza) {
    satirlar.push(`Ödev Hazırlayan: Enes Öztürk`);
  }

  return satirlar;
}

export function generateCustomTriangle(
  n: number,
  char: string = 'O',
  type: TriangleType = 'left',
  includeSignature: boolean = true,
  studentName: string = 'Enes Öztürk'
): { lines: string[]; totalChars: number; executionTimeMs: number } {
  const startTime = performance.now();
  const lines: string[] = [];
  let totalChars = 0;
  let i = 1;

  if (type === 'left') {
    while (i <= n) {
      let line = '';
      for (let j = 0; j < i; j++) {
        line += (j === 0 ? char : ` ${char}`);
        totalChars++;
      }
      lines.push(line);
      i++;
    }
  } else if (type === 'pyramid') {
    while (i <= n) {
      const spaces = ' '.repeat(n - i);
      let line = spaces;
      for (let j = 0; j < i; j++) {
        line += (j === 0 ? char : ` ${char}`);
        totalChars++;
      }
      lines.push(line);
      i++;
    }
  } else if (type === 'inverted') {
    let row = n;
    while (row >= 1) {
      let line = '';
      for (let j = 0; j < row; j++) {
        line += (j === 0 ? char : ` ${char}`);
        totalChars++;
      }
      lines.push(line);
      row--;
    }
  }

  if (includeSignature) {
    lines.push(`----------------------------------------`);
    lines.push(`Ödev Hazırlayan: ${studentName}`);
  }

  const endTime = performance.now();
  return {
    lines,
    totalChars,
    executionTimeMs: Number((endTime - startTime).toFixed(3)),
  };
}

export function generateTraceSteps(n: number, char: string = 'O', maxSteps: number = 60): TraceStep[] {
  const steps: TraceStep[] = [];
  const accumulated: string[] = [];
  let stepCount = 0;
  let i = 1;

  // Başlangıç adımı
  steps.push({
    stepNumber: ++stepCount,
    i: 1,
    j: 0,
    currentLine: '',
    accumulatedOutput: [],
    activeLoop: 'while-check',
    description: `Döngü başladı. 'i = 1' olarak ayarlandı. 'while (i <= ${n})' koşulu kontrol ediliyor (1 <= ${n}: DOĞRU).`,
  });

  while (i <= n && stepCount < maxSteps) {
    let currentLine = '';

    for (let j = 0; j < i && stepCount < maxSteps; j++) {
      currentLine += (j === 0 ? char : ` ${char}`);
      steps.push({
        stepNumber: ++stepCount,
        i,
        j: j + 1,
        currentLine,
        accumulatedOutput: [...accumulated],
        activeLoop: 'for-iteration',
        description: `Satır ${i} için FOR döngüsü çalışıyor: j = ${j}. '${char}' karakteri eklendi (toplam ${j + 1} adet).`,
      });
    }

    accumulated.push(currentLine);
    steps.push({
      stepNumber: ++stepCount,
      i,
      j: i,
      currentLine,
      accumulatedOutput: [...accumulated],
      activeLoop: 'row-complete',
      description: `Satır ${i} tamamlandı: "${currentLine}". 'i' değeri bir artırılarak ${i + 1} yapılıyor.`,
    });

    i++;

    if (i <= n && stepCount < maxSteps) {
      steps.push({
        stepNumber: ++stepCount,
        i,
        j: 0,
        currentLine: '',
        accumulatedOutput: [...accumulated],
        activeLoop: 'while-check',
        description: `'while (i <= ${n})' koşulu test ediliyor (${i} <= ${n}: DOĞRU). Satır ${i}'ye geçiliyor.`,
      });
    }
  }

  steps.push({
    stepNumber: ++stepCount,
    i,
    j: 0,
    currentLine: '',
    accumulatedOutput: [...accumulated, 'Ödev Hazırlayan: Enes Öztürk'],
    activeLoop: 'done',
    description: `'while (i <= ${n})' koşulu YANLIŞ oldu (${i} > ${n}). Döngü sonlandı ve Enes Öztürk imzası eklendi.`,
  });

  return steps;
}

export const CODE_SNIPPETS: Record<Language, { title: string; filename: string; code: string }> = {
  javascript: {
    title: 'JavaScript / Node.js',
    filename: 'ucgen.js',
    code: `/**
 * Ödev: Parametre olarak aldığı değer kadar satırı olan üçgen çizme
 * Kural: Fonksiyon içerisinde hem 'while' hem de 'for' döngüleri kullanılmalıdır.
 * Hazırlayan: Enes Öztürk
 */

function ucgen(satirSayisi) {
  let i = 1; // Satır sayısını tutan sayaç (1'den n'e kadar)

  // 1. DÖNGÜ (WHILE): Satır sayısını kontrol eder
  while (i <= satirSayisi) {
    let satir = "";

    // 2. DÖNGÜ (FOR): Bulunulan satıra i adet 'O' karakteri ekler
    for (let j = 0; j < i; j++) {
      if (j === 0) {
        satir += "O";
      } else {
        satir += " O";
      }
    }

    // Satırı ekrana yazdır ve sonraki satıra geçmek için i'yi artır
    console.log(satir);
    i++;
  }

  // Ödev İmzası
  console.log("Ödev Hazırlayan: Enes Öztürk");
}

// 15 satırlık üçgen çağrısı
ucgen(15);
`,
  },
  python: {
    title: 'Python 3',
    filename: 'ucgen.py',
    code: `# Ödev: Parametre kadar satırı olan üçgen çizme fonksiyonu
# Kural: Hem while hem de for döngüsü kullanılmalıdır.
# Hazırlayan: Enes Öztürk

def ucgen(satir_sayisi):
    i = 1  # 1. DÖNGÜ sayacı (satır kontrolü)
    
    # WHILE döngüsü satırları yönetir
    while i <= satir_sayisi:
        satir_elemanlari = []
        
        # FOR döngüsü satırdaki 'O' karakterlerini üretir
        for j in range(i):
            satir_elemanlari.append("O")
            
        print(" ".join(satir_elemanlari))
        i += 1
        
    print("Ödev Hazırlayan: Enes Öztürk")

# Fonksiyon çağrısı
if __name__ == "__main__":
    ucgen(15)
`,
  },
  cpp: {
    title: 'C / C++',
    filename: 'ucgen.cpp',
    code: `/**
 * Ödev: Parametre kadar satırı olan üçgen çizme
 * Kural: while ve for döngülerinin her ikisi de kullanılmalıdır.
 * Hazırlayan: Enes Öztürk
 */

#include <iostream>

void ucgen(int satirSayisi) {
    int i = 1; // Satır sayacı

    // WHILE döngüsü ile satır kontrolü
    while (i <= satirSayisi) {
        // FOR döngüsü ile satır içi 'O' karakterlerinin yazdırılması
        for (int j = 0; j < i; j++) {
            if (j == 0) {
                std::cout << "O";
            } else {
                std::cout << " O";
            }
        }
        std::cout << "\\n";
        i++;
    }

    std::cout << "Ödev Hazırlayan: Enes Öztürk\\n";
}

int main() {
    ucgen(15);
    return 0;
}
`,
  },
  java: {
    title: 'Java',
    filename: 'UcgenOdev.java',
    code: `/**
 * Ödev: Parametre kadar satırı olan üçgen çizme
 * Kural: while ve for döngülerinin her ikisi de kullanılmalıdır.
 * Hazırlayan: Enes Öztürk
 */

public class UcgenOdev {
    public static void ucgen(int satirSayisi) {
        int i = 1;

        // WHILE döngüsü: Satırları yönetir
        while (i <= satirSayisi) {
            StringBuilder satir = new StringBuilder();

            // FOR döngüsü: Satırdaki 'O' elemanlarını ekler
            for (int j = 0; j < i; j++) {
                if (j == 0) {
                    satir.append("O");
                } else {
                    satir.append(" O");
                }
            }

            System.out.println(satir.toString());
            i++;
        }

        System.out.println("Ödev Hazırlayan: Enes Öztürk");
    }

    public static void main(String[] args) {
        ucgen(15);
    }
}
`,
  },
  php: {
    title: 'PHP',
    filename: 'ucgen.php',
    code: `<?php
/**
 * Ödev: Parametre kadar satırı olan üçgen çizme
 * Kural: while ve for döngülerinin her ikisi de kullanılmalıdır.
 * Hazırlayan: Enes Öztürk
 */

function ucgen($satirSayisi) {
    $i = 1;

    // WHILE döngüsü satır kontrolü
    while ($i <= $satirSayisi) {
        $satir = "";

        // FOR döngüsü karakter basımı
        for ($j = 0; $j < $i; $j++) {
            $satir .= ($j === 0 ? "O" : " O");
        }

        echo $satir . PHP_EOL;
        $i++;
    }

    echo "Ödev Hazırlayan: Enes Öztürk" . PHP_EOL;
}

ucgen(15);
?>
`,
  },
};
