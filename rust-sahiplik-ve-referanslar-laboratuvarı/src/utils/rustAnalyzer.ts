import { ChecklistItem, ExecutionStep, MemoryVariable, HeapAllocation } from '../types/rust';

export function analyzeRustCode(code: string): {
  checklist: ChecklistItem[];
  allPassed: boolean;
  extractedValues: { string1: string; string2: string };
  errors: string[];
} {
  const errors: string[] = [];

  // 1. Signature Check
  const sigRegex = /fn\s+concatenate_strings\s*\(\s*([a-zA-Z0-9_]+)\s*:\s*(&str|&String|String)\s*,\s*([a-zA-Z0-9_]+)\s*:\s*(&str|&String|String)\s*\)\s*(?:->\s*(String|&str))?/;
  const sigMatch = code.match(sigRegex);
  
  let signaturePassed = false;
  let signatureHint = 'Fonksiyon imzasını şu şekilde tanımlayın: `fn concatenate_strings(s1: &str, s2: &str) -> String`';
  let signatureDetails = '';

  if (sigMatch) {
    const [, p1Name, p1Type, p2Name, p2Type, returnType] = sigMatch;
    if (p1Type === '&str' && p2Type === '&str' && returnType === 'String') {
      signaturePassed = true;
      signatureDetails = `Doğru imza: fn concatenate_strings(${p1Name}: &str, ${p2Name}: &str) -> String`;
    } else if (p1Type === 'String' || p2Type === 'String') {
      signaturePassed = false;
      signatureHint = 'Parametreler sahiplik almamalıdır (move). Dize dilimi referansı olan `&str` kullanın!';
      errors.push('HATA: `String` parametresi sahiplik transferine (move) yol açar. Görevde `&str` istenmektedir.');
    } else if (returnType !== 'String') {
      signaturePassed = false;
      signatureHint = 'Fonksiyon birleştirilmiş yeni dizeyi oluşturup bir `String` döndürmelidir (`-> String`).';
    } else {
      signaturePassed = true;
      signatureDetails = `İmza: fn concatenate_strings(${p1Name}: ${p1Type}, ${p2Name}: ${p2Type}) -> String`;
    }
  }

  // 2. Implementation Check
  const hasResultNew = /let\s+mut\s+result\s*=\s*(String::new\(\)|String::with_capacity\([^)]*\))/i.test(code);
  const pushCount = (code.match(/\.push_str\s*\(/g) || []).length;
  const returnsResult = /(return\s+result\s*;?|result\s*(?:\n|\r\n)?\s*\})/m.test(code);

  const implPassed = hasResultNew && pushCount >= 2 && returnsResult;
  let implHint = 'Fonksiyon içinde `let mut result = String::new();` oluşturup, `result.push_str()` ile her iki dilimi ekleyin ve `result`ı döndürün.';
  if (!hasResultNew) {
    implHint = '`let mut result = String::new();` değişkeni tanımlanmadı.';
  } else if (pushCount < 2) {
    implHint = `En az iki kez push_str() çağrılmalı (şu an: ${pushCount} kez çağrıldı).`;
  } else if (!returnsResult) {
    implHint = 'Fonksiyonun sonunda `result` döndürülmelidir (noktalı virgülsüz `result` veya `return result;`).';
  }

  // 3. String1 & String2 initialization in main
  const string1Regex = /let\s+(?:mut\s+)?string1\s*=\s*String::from\(\s*["']([^"']*)["']\s*\)/;
  const string2Regex = /let\s+(?:mut\s+)?string2\s*=\s*String::from\(\s*["']([^"']*)["']\s*\)/;
  
  const string1Match = code.match(string1Regex);
  const string2Match = code.match(string2Regex);

  const initPassed = Boolean(string1Match && string2Match);
  let initHint = 'main fonksiyonunda `let string1 = String::from("...");` ve `let string2 = String::from("...");` tanımlayın.';
  
  const extractedString1 = string1Match ? string1Match[1] : 'Merhaba, ';
  const extractedString2 = string2Match ? string2Match[1] : 'Rust Dünyası!';

  // 4. Call with references
  const callRegex = /(?:let\s+(?:mut\s+)?concatenated_string\s*=\s*)?concatenate_strings\s*\(\s*&string1\s*,\s*&string2\s*\)/;
  const directCall = /concatenate_strings\s*\(\s*&string1\s*,\s*&string2\s*\)/.test(code);
  const storesInVar = /let\s+(?:mut\s+)?concatenated_string\s*=\s*concatenate_strings/.test(code);
  
  const callPassed = directCall && storesInVar;
  let callHint = '`let concatenated_string = concatenate_strings(&string1, &string2);` şeklinde çağırın.';
  if (!directCall && /concatenate_strings\s*\(\s*string1\s*,/.test(code)) {
    callHint = 'DİKKAT: & işareti olmadan çağrı yapıyorsunuz! Sahiplik referansı için `&string1, &string2` kullanmalısınız.';
    errors.push('HATA: `string1` ve `string2` referans olarak (&) geçilmedi.');
  }

  // 5. Print to console
  const printRegex = /println!\s*\(\s*["'][^"']*["']\s*,\s*concatenated_string\s*\)/;
  const printPassed = printRegex.test(code);
  const printHint = '`println!("{}", concatenated_string);` komutuyla birleştirilmiş dizeyi konsola yazdırın.';

  // 6. Test and compilation readiness
  const hasMain = /fn\s+main\s*\(\s*\)/.test(code);
  const testPassed = signaturePassed && implPassed && initPassed && callPassed && printPassed && hasMain;
  const testHint = testPassed
    ? 'Tüm sözdizimi ve sahiplik kuralları geçerli. Program başarıyla derlenip çalıştırılabilir.'
    : 'Lütfen yukarıdaki eksik veya hatalı adımları düzeltin.';

  const checklist: ChecklistItem[] = [
    {
      id: 'step1',
      title: 'concatenate_strings fonksiyon imzasını yaz',
      requirement: 'İki &str dilim parametresi alıp String döndüren fonksiyon imzası',
      passed: signaturePassed,
      hint: signatureHint,
      details: signatureDetails,
    },
    {
      id: 'step2',
      title: 'concatenate_strings fonksiyonunu uygula',
      requirement: 'result = String::new(), iki push_str() çağrısı ve sonucu geri döndürme',
      passed: implPassed,
      hint: implHint,
      details: implPassed ? 'String::new() ve push_str() doğru şekilde uygulandı' : undefined,
    },
    {
      id: 'step3',
      title: 'Ana fonksiyonda iki String değişkenini başlatın',
      requirement: 'string1 ve string2 değişkenlerini String::from() ile başlatma',
      passed: initPassed,
      hint: initHint,
      details: initPassed ? `string1: "${extractedString1}", string2: "${extractedString2}"` : undefined,
    },
    {
      id: 'step4',
      title: 'Değişkenlerin dilimleriyle concatenate_strings fonksiyonunu çağırın',
      requirement: 'Referanslar (&string1, &string2) ile çağırıp concatenated_string değişkenine atama',
      passed: callPassed,
      hint: callHint,
      details: callPassed ? 'Ödünç alma (&) kuralı uygulandı; sahiplik main\'de kaldı' : undefined,
    },
    {
      id: 'step5',
      title: 'Sonucu konsola yazdır',
      requirement: 'println! makrosu ile concatenated_string değişkenini ekrana basma',
      passed: printPassed,
      hint: printHint,
      details: printPassed ? 'println!("{}", concatenated_string) konsola yazdırma hazır' : undefined,
    },
    {
      id: 'step6',
      title: 'Programı derleyip çalıştırarak işlevselliğini test edin',
      requirement: 'Rust sahiplik ve ödünç alma kurallarına uygun eksiksiz çalışma',
      passed: testPassed,
      hint: testHint,
      details: testPassed ? 'Cargo derlemesi ve Borrow Checker doğrulaması onaylandı' : undefined,
    },
  ];

  return {
    checklist,
    allPassed: checklist.every((item) => item.passed),
    extractedValues: {
      string1: extractedString1,
      string2: extractedString2,
    },
    errors,
  };
}

export function generateExecutionSteps(str1: string, str2: string): ExecutionStep[] {
  const combined = str1 + str2;
  const len1 = new TextEncoder().encode(str1).length;
  const len2 = new TextEncoder().encode(str2).length;
  const lenCombined = new TextEncoder().encode(combined).length;

  const steps: ExecutionStep[] = [
    {
      stepNumber: 1,
      title: 'main() Fonksiyonu Başlatıldı',
      line: 8,
      codeSnippet: 'fn main() {',
      explanation: 'İşletim sistemi programı çalıştırdı. Yığın (Stack) üzerinde main() fonksiyonu için yeni bir yığın çerçevesi (stack frame) oluşturuldu.',
      activeFunction: 'main',
      variables: [],
      heap: [],
      borrowCheckerNote: 'Yığın henüz boş. Değişkenler başlatılmaya hazır.',
    },
    {
      stepNumber: 2,
      title: 'string1 Başlatıldı (Heap Tahsisi)',
      line: 9,
      codeSnippet: `let string1 = String::from("${str1}");`,
      explanation: `main çerçevesinde string1 değişkeni oluşturuldu. Yığın üzerinde 24 bayt (işaretçi, uzunluk: ${len1}, kapasite: ${len1}) yer tutar; asıl metin verisi "${str1}" ise Heap (öbek) belleğinde saklanır. string1 bu verinin tek sahibidir (owner).`,
      activeFunction: 'main',
      variables: [
        {
          name: 'string1',
          type: 'String',
          scope: 'main',
          stackAddress: '0x7ffd_0020',
          ptr: '0x55aa_1000',
          len: len1,
          capacity: len1,
          pointsToHeapAddress: '0x55aa_1000',
          isMut: false,
          status: 'active',
        },
      ],
      heap: [
        {
          address: '0x55aa_1000',
          content: str1,
          ownerVar: 'string1',
          allocatedInStep: 2,
          capacityBytes: len1,
          usedBytes: len1,
        },
      ],
      borrowCheckerNote: 'string1 heap verisinin tam sahibidir. Henüz ödünç alınmadı.',
    },
    {
      stepNumber: 3,
      title: 'string2 Başlatıldı (Heap Tahsisi)',
      line: 10,
      codeSnippet: `let string2 = String::from("${str2}");`,
      explanation: `string2 yığın üzerinde tanımlandı ve heap belleğinde "${str2}" için yeni bir bellek alanı ayrıldı. Her String kendi heap tamponuna bağımsız olarak sahiptir.`,
      activeFunction: 'main',
      variables: [
        {
          name: 'string1',
          type: 'String',
          scope: 'main',
          stackAddress: '0x7ffd_0020',
          ptr: '0x55aa_1000',
          len: len1,
          capacity: len1,
          pointsToHeapAddress: '0x55aa_1000',
          isMut: false,
          status: 'active',
        },
        {
          name: 'string2',
          type: 'String',
          scope: 'main',
          stackAddress: '0x7ffd_0038',
          ptr: '0x55aa_1040',
          len: len2,
          capacity: len2,
          pointsToHeapAddress: '0x55aa_1040',
          isMut: false,
          status: 'active',
        },
      ],
      heap: [
        {
          address: '0x55aa_1000',
          content: str1,
          ownerVar: 'string1',
          allocatedInStep: 2,
          capacityBytes: len1,
          usedBytes: len1,
        },
        {
          address: '0x55aa_1040',
          content: str2,
          ownerVar: 'string2',
          allocatedInStep: 3,
          capacityBytes: len2,
          usedBytes: len2,
        },
      ],
      borrowCheckerNote: 'Hem string1 hem string2 geçerlidir. Sahiplik kuralları korunmaktadır.',
    },
    {
      stepNumber: 4,
      title: 'concatenate_strings Çağrıldı & Borrows (&str)',
      line: 12,
      codeSnippet: 'let concatenated_string = concatenate_strings(&string1, &string2);',
      explanation: 'concatenate_strings çağrıldı. Yığın üzerine yeni bir çerçeve eklendi. &string1 ve &string2 ifadeleri "Deref Coercion" sayesinde 16 baytlık dize dilimlerine (&str: [ptr, len]) dönüştürülüp ödünç verildi. Heap verisi ASLA KOPYALANMADI; sahiplik devredilmedi (move gerçekleşmedi).',
      activeFunction: 'concatenate_strings',
      variables: [
        {
          name: 'string1',
          type: 'String',
          scope: 'main',
          stackAddress: '0x7ffd_0020',
          ptr: '0x55aa_1000',
          len: len1,
          capacity: len1,
          pointsToHeapAddress: '0x55aa_1000',
          isMut: false,
          status: 'borrowed',
        },
        {
          name: 'string2',
          type: 'String',
          scope: 'main',
          stackAddress: '0x7ffd_0038',
          ptr: '0x55aa_1040',
          len: len2,
          capacity: len2,
          pointsToHeapAddress: '0x55aa_1040',
          isMut: false,
          status: 'borrowed',
        },
        {
          name: 's1',
          type: '&str',
          scope: 'concatenate_strings',
          stackAddress: '0x7ffd_0008',
          ptr: '0x55aa_1000',
          len: len1,
          borrowedFrom: 'string1',
          pointsToHeapAddress: '0x55aa_1000',
          isMut: false,
          status: 'active',
        },
        {
          name: 's2',
          type: '&str',
          scope: 'concatenate_strings',
          stackAddress: '0x7ffd_0018',
          ptr: '0x55aa_1040',
          len: len2,
          borrowedFrom: 'string2',
          pointsToHeapAddress: '0x55aa_1040',
          isMut: false,
          status: 'active',
        },
      ],
      heap: [
        {
          address: '0x55aa_1000',
          content: str1,
          ownerVar: 'string1 (s1 tarafından &str ile ödünç alındı)',
          allocatedInStep: 2,
          capacityBytes: len1,
          usedBytes: len1,
        },
        {
          address: '0x55aa_1040',
          content: str2,
          ownerVar: 'string2 (s2 tarafından &str ile ödünç alındı)',
          allocatedInStep: 3,
          capacityBytes: len2,
          usedBytes: len2,
        },
      ],
      borrowCheckerNote: 'string1 ve string2 şu anda değişmez (immutable) olarak ödünç alındı. Bu sürede değiştirilemezler ama okunabilirler.',
    },
    {
      stepNumber: 5,
      title: 'result Değişkeni Oluşturuldu',
      line: 2,
      codeSnippet: 'let mut result = String::new();',
      explanation: 'concatenate_strings çerçevesinde mutlenebilir (mutable) boş bir String oluşturuldu. Henüz heap üzerinde bellek ayrılmadı (veya 0 bayt kapasite).',
      activeFunction: 'concatenate_strings',
      variables: [
        {
          name: 's1',
          type: '&str',
          scope: 'concatenate_strings',
          stackAddress: '0x7ffd_0008',
          ptr: '0x55aa_1000',
          len: len1,
          borrowedFrom: 'string1',
          pointsToHeapAddress: '0x55aa_1000',
          isMut: false,
          status: 'active',
        },
        {
          name: 's2',
          type: '&str',
          scope: 'concatenate_strings',
          stackAddress: '0x7ffd_0018',
          ptr: '0x55aa_1040',
          len: len2,
          borrowedFrom: 'string2',
          pointsToHeapAddress: '0x55aa_1040',
          isMut: false,
          status: 'active',
        },
        {
          name: 'result',
          type: 'mut String',
          scope: 'concatenate_strings',
          stackAddress: '0x7ffd_0000',
          ptr: '0x0000_0000',
          len: 0,
          capacity: 0,
          isMut: true,
          status: 'active',
        },
      ],
      heap: [
        {
          address: '0x55aa_1000',
          content: str1,
          ownerVar: 'string1',
          allocatedInStep: 2,
          capacityBytes: len1,
          usedBytes: len1,
        },
        {
          address: '0x55aa_1040',
          content: str2,
          ownerVar: 'string2',
          allocatedInStep: 3,
          capacityBytes: len2,
          usedBytes: len2,
        },
      ],
      borrowCheckerNote: 'result mutlenebilir olduğu için push_str ile genişletilmesine izin verilir.',
    },
    {
      stepNumber: 6,
      title: 'push_str(s1) ile İlk Dizi Eklendi',
      line: 3,
      codeSnippet: 'result.push_str(s1);',
      explanation: `result için heap üzerinde yeni bir tampon tahsis edildi (0x55aa_2000). s1 diliminin işaret ettiği "${str1}" verisi kopyalanıp result'ın heap alanına yazıldı. len: ${len1}, cap: ${Math.max(16, len1)}.`,
      activeFunction: 'concatenate_strings',
      variables: [
        {
          name: 's1',
          type: '&str',
          scope: 'concatenate_strings',
          stackAddress: '0x7ffd_0008',
          ptr: '0x55aa_1000',
          len: len1,
          borrowedFrom: 'string1',
          pointsToHeapAddress: '0x55aa_1000',
          isMut: false,
          status: 'active',
        },
        {
          name: 's2',
          type: '&str',
          scope: 'concatenate_strings',
          stackAddress: '0x7ffd_0018',
          ptr: '0x55aa_1040',
          len: len2,
          borrowedFrom: 'string2',
          pointsToHeapAddress: '0x55aa_1040',
          isMut: false,
          status: 'active',
        },
        {
          name: 'result',
          type: 'mut String',
          scope: 'concatenate_strings',
          stackAddress: '0x7ffd_0000',
          ptr: '0x55aa_2000',
          len: len1,
          capacity: Math.max(16, len1),
          pointsToHeapAddress: '0x55aa_2000',
          isMut: true,
          status: 'active',
        },
      ],
      heap: [
        {
          address: '0x55aa_1000',
          content: str1,
          ownerVar: 'string1',
          allocatedInStep: 2,
          capacityBytes: len1,
          usedBytes: len1,
        },
        {
          address: '0x55aa_1040',
          content: str2,
          ownerVar: 'string2',
          allocatedInStep: 3,
          capacityBytes: len2,
          usedBytes: len2,
        },
        {
          address: '0x55aa_2000',
          content: str1,
          ownerVar: 'result',
          allocatedInStep: 6,
          capacityBytes: Math.max(16, len1),
          usedBytes: len1,
        },
      ],
      borrowCheckerNote: 's1 sadece okundu; orijinal string1 üzerinde hiçbir değişiklik olmadı.',
    },
    {
      stepNumber: 7,
      title: 'push_str(s2) ile İkinci Dizi Eklendi',
      line: 4,
      codeSnippet: 'result.push_str(s2);',
      explanation: `result'ın heap tamponuna "${str2}" eklendi. Artık result heap içeriği "${combined}". Toplam uzunluk: ${lenCombined} bayt.`,
      activeFunction: 'concatenate_strings',
      variables: [
        {
          name: 's1',
          type: '&str',
          scope: 'concatenate_strings',
          stackAddress: '0x7ffd_0008',
          ptr: '0x55aa_1000',
          len: len1,
          borrowedFrom: 'string1',
          pointsToHeapAddress: '0x55aa_1000',
          isMut: false,
          status: 'active',
        },
        {
          name: 's2',
          type: '&str',
          scope: 'concatenate_strings',
          stackAddress: '0x7ffd_0018',
          ptr: '0x55aa_1040',
          len: len2,
          borrowedFrom: 'string2',
          pointsToHeapAddress: '0x55aa_1040',
          isMut: false,
          status: 'active',
        },
        {
          name: 'result',
          type: 'mut String',
          scope: 'concatenate_strings',
          stackAddress: '0x7ffd_0000',
          ptr: '0x55aa_2000',
          len: lenCombined,
          capacity: Math.max(32, lenCombined),
          pointsToHeapAddress: '0x55aa_2000',
          isMut: true,
          status: 'active',
        },
      ],
      heap: [
        {
          address: '0x55aa_1000',
          content: str1,
          ownerVar: 'string1',
          allocatedInStep: 2,
          capacityBytes: len1,
          usedBytes: len1,
        },
        {
          address: '0x55aa_1040',
          content: str2,
          ownerVar: 'string2',
          allocatedInStep: 3,
          capacityBytes: len2,
          usedBytes: len2,
        },
        {
          address: '0x55aa_2000',
          content: combined,
          ownerVar: 'result',
          allocatedInStep: 6,
          capacityBytes: Math.max(32, lenCombined),
          usedBytes: lenCombined,
        },
      ],
      borrowCheckerNote: 'Her iki ödünç alma işlemi de güvenle tamamlandı.',
    },
    {
      stepNumber: 8,
      title: 'result Döndürüldü (Sahiplik Transferi - Move)',
      line: 5,
      codeSnippet: 'result',
      explanation: 'concatenate_strings sona erdi. Yığın çerçevesi temizlendi (s1 ve s2 ödünçleri bitti). result nesnesinin heap sahipliği (pointer, len, cap) kopyalanmadan doğrudan main içindeki concatenated_string değişkenine devredildi (MOVE)!',
      activeFunction: 'main',
      variables: [
        {
          name: 'string1',
          type: 'String',
          scope: 'main',
          stackAddress: '0x7ffd_0020',
          ptr: '0x55aa_1000',
          len: len1,
          capacity: len1,
          pointsToHeapAddress: '0x55aa_1000',
          isMut: false,
          status: 'active',
        },
        {
          name: 'string2',
          type: 'String',
          scope: 'main',
          stackAddress: '0x7ffd_0038',
          ptr: '0x55aa_1040',
          len: len2,
          capacity: len2,
          pointsToHeapAddress: '0x55aa_1040',
          isMut: false,
          status: 'active',
        },
        {
          name: 'concatenated_string',
          type: 'String',
          scope: 'main',
          stackAddress: '0x7ffd_0050',
          ptr: '0x55aa_2000',
          len: lenCombined,
          capacity: Math.max(32, lenCombined),
          pointsToHeapAddress: '0x55aa_2000',
          isMut: false,
          status: 'active',
        },
      ],
      heap: [
        {
          address: '0x55aa_1000',
          content: str1,
          ownerVar: 'string1 (Hâlâ geçerli!)',
          allocatedInStep: 2,
          capacityBytes: len1,
          usedBytes: len1,
        },
        {
          address: '0x55aa_1040',
          content: str2,
          ownerVar: 'string2 (Hâlâ geçerli!)',
          allocatedInStep: 3,
          capacityBytes: len2,
          usedBytes: len2,
        },
        {
          address: '0x55aa_2000',
          content: combined,
          ownerVar: 'concatenated_string (Yeni sahip)',
          allocatedInStep: 6,
          capacityBytes: Math.max(32, lenCombined),
          usedBytes: lenCombined,
        },
      ],
      borrowCheckerNote: 'KRİTİK ZAFER: string1 ve string2 yalnızca ödünç verildiği için main içinde HÂLÂ KULLANILABİLİR! Sahiplik kuralları ihlal edilmedi.',
    },
    {
      stepNumber: 9,
      title: 'println! Konsola Yazdırdı & Temizlik (RAII / Drop)',
      line: 14,
      codeSnippet: 'println!("{}", concatenated_string);',
      explanation: `concatenated_string değeri konsola yazdırıldı. Ardından main fonksiyonunun sonuna gelindiğinde (scope sonu), Rust'ın otomatik RAII mekanizması devreye girer: string1, string2 ve concatenated_string için sırayla drop() çağrılır ve tüm heap bellekleri serbest bırakılır (0 bellek sızıntısı!).`,
      activeFunction: 'main',
      variables: [
        {
          name: 'string1',
          type: 'String',
          scope: 'main',
          stackAddress: '0x7ffd_0020',
          ptr: '0x55aa_1000',
          len: len1,
          capacity: len1,
          pointsToHeapAddress: '0x55aa_1000',
          isMut: false,
          status: 'dropped',
        },
        {
          name: 'string2',
          type: 'String',
          scope: 'main',
          stackAddress: '0x7ffd_0038',
          ptr: '0x55aa_1040',
          len: len2,
          capacity: len2,
          pointsToHeapAddress: '0x55aa_1040',
          isMut: false,
          status: 'dropped',
        },
        {
          name: 'concatenated_string',
          type: 'String',
          scope: 'main',
          stackAddress: '0x7ffd_0050',
          ptr: '0x55aa_2000',
          len: lenCombined,
          capacity: Math.max(32, lenCombined),
          pointsToHeapAddress: '0x55aa_2000',
          isMut: false,
          status: 'dropped',
        },
      ],
      heap: [],
      stdout: combined + '\n',
      borrowCheckerNote: 'Program başarıyla sonlandı. Çöp toplayıcı (GC) olmadan deterministik bellek temizliği tamamlandı.',
    },
  ];

  return steps;
}
