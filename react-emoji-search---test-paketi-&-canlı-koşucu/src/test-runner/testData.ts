import { TestCaseResult } from './testTypes';

export const initialTestCases: TestCaseResult[] = [
  {
    id: 'test-header',
    title: 'Başlık kısmının render testi',
    requirementNumber: 1,
    description: 'Header bileşeninin ve "Emoji Search" başlığının DOM üzerinde başarıyla render edildiğini doğrular.',
    status: 'idle',
    durationMs: 0,
    assertions: [
      {
        id: 'assert-header-element',
        name: 'Header elementi belgede mevcut olmalı',
        passed: false,
        expected: 'data-testid="header" elementi DOM içinde bulunmalı',
        actual: 'Henüz çalıştırılmadı',
      },
      {
        id: 'assert-header-title',
        name: '"Emoji Search" metni ekranda görünür olmalı',
        passed: false,
        expected: 'screen.getByText(/Emoji Search/i) bulunmalı',
        actual: 'Henüz çalıştırılmadı',
      },
    ],
    codeSnippet: `test("1. Başlık kısmının (Header) başarılı bir şekilde render edildiğini kontrol eder", () => {
  render(<App />);

  const headerElement = screen.getByText(/Emoji Search/i);
  expect(headerElement).toBeInTheDocument();

  const headerContainer = screen.getByTestId("header");
  expect(headerContainer).toBeInTheDocument();
});`,
    explanation:
      'React Testing Library\'nin getByText sorgusu regex desteği ile büyük/küçük harf duyarsız (/Emoji Search/i) olarak başlık metnini arar. toBeInTheDocument() matcher\'ı öğenin DOM hiyerarşisinde var olduğunu garanti eder.',
  },
  {
    id: 'test-initial-list',
    title: 'İlk açılışta emoji listesi render testi',
    requirementNumber: 2,
    description: 'Uygulama ilk açıldığında varsayılan olarak belirlenen 20 adet emojinin eksiksiz listelendiğini kontrol eder.',
    status: 'idle',
    durationMs: 0,
    assertions: [
      {
        id: 'assert-initial-count',
        name: 'Toplam 20 adet emoji satırı render edilmeli',
        passed: false,
        expected: 'emojiRows.length === 20',
        actual: 'Henüz çalıştırılmadı',
      },
      {
        id: 'assert-first-item',
        name: 'İlk varsayılan öğe olan "100" emojisi bulunmalı',
        passed: false,
        expected: 'screen.getByText("100") belgede yer almalı',
        actual: 'Henüz çalıştırılmadı',
      },
    ],
    codeSnippet: `test("2. Uygulama ilk açıldığında varsayılan emoji listesinin (20 adet) render edildiğini kontrol eder", () => {
  render(<App />);

  const emojiRows = screen.getAllByTestId("emoji-row");
  expect(emojiRows).toHaveLength(20);

  const firstEmoji = screen.getByText("100");
  expect(firstEmoji).toBeInTheDocument();
});`,
    explanation:
      'getAllByTestId("emoji-row") ile listelenen satır sayısı kontrol edilir. Orijinal React dokümanı projesinde limit 20 olarak ayarlandığı için toHaveLength(20) doğrulaması yapılır.',
  },
  {
    id: 'test-filtering',
    title: 'Filtreleme işlemi testi',
    requirementNumber: 3,
    description: 'Arama input alanına bir anahtar kelime girildiğinde, filtrelenmiş emojilerin render edildiğini ve ilgisiz emojilerin kaldırıldığını kontrol eder.',
    status: 'idle',
    durationMs: 0,
    assertions: [
      {
        id: 'assert-filter-input',
        name: 'Arama input alanına değer girilebilmeli',
        passed: false,
        expected: 'fireEvent.change(input, { target: { value: "Joy" } })',
        actual: 'Henüz çalıştırılmadı',
      },
      {
        id: 'assert-filtered-items',
        name: 'Arama sonucu "Joy" emojisi ekranda olmalı',
        passed: false,
        expected: 'screen.getByText("Joy") DOM üzerinde bulunmalı',
        actual: 'Henüz çalıştırılmadı',
      },
      {
        id: 'assert-non-matching-removed',
        name: 'Uyuşmayan emojiler ("100") filtrelenerek kaldırılmalı',
        passed: false,
        expected: 'screen.queryByText("100") null/undefined olmalı',
        actual: 'Henüz çalıştırılmadı',
      },
    ],
    codeSnippet: `test("3. Bir filtreleme işlemi yapıldığında emoji listesinin uygun render edildiğini kontrol eder", () => {
  render(<App />);

  const searchInput = screen.getByPlaceholderText(/search emoji/i);
  fireEvent.change(searchInput, { target: { value: "Joy" } });

  const joyEmoji = screen.getByText("Joy");
  expect(joyEmoji).toBeInTheDocument();

  const nonMatchingEmoji = screen.queryByText("100");
  expect(nonMatchingEmoji).not.toBeInTheDocument();
});`,
    explanation:
      'fireEvent.change ile input değerinin değiştirilmesi simüle edilir. Bulunmaması gereken öğeleri test etmek için getByText yerine queryByText kullanılır; çünkü queryByText öğe bulunamadığında hata fırlatmaz, null döner.',
  },
  {
    id: 'test-clipboard-copy',
    title: 'Emoji kopyalama işlemi testi',
    requirementNumber: 4,
    description: 'Herhangi bir emoji satırına tıklandığında, ilgili emoji sembolünün panoya (navigator.clipboard.writeText) başarıyla kopyalandığını kontrol eder.',
    status: 'idle',
    durationMs: 0,
    assertions: [
      {
        id: 'assert-clipboard-mock',
        name: 'Clipboard API mock edilmiş olmalı',
        passed: false,
        expected: 'navigator.clipboard.writeText spy/mock fonksiyonu',
        actual: 'Henüz çalıştırılmadı',
      },
      {
        id: 'assert-row-click',
        name: 'Emoji satırına tıklandığında kopyalama tetiklenmeli',
        passed: false,
        expected: 'fireEvent.click(firstEmojiRow) çalıştırılmalı',
        actual: 'Henüz çalıştırılmadı',
      },
      {
        id: 'assert-copied-symbol',
        name: 'Panoya kopyalanan değer doğru emoji sembolü olmalı',
        passed: false,
        expected: 'writeTextMock beklenen emoji sembolü (ör. "💯") ile çağrılmalı',
        actual: 'Henüz çalıştırılmadı',
      },
    ],
    codeSnippet: `test("4. Liste üzerinden bir emojiye tıklandığında panoya kopyalandığını kontrol eder", async () => {
  render(<App />);

  const emojiRows = screen.getAllByTestId("emoji-row");
  const firstEmojiRow = emojiRows[0];
  const expectedSymbol = firstEmojiRow.getAttribute("data-clipboard-text");

  fireEvent.click(firstEmojiRow);

  expect(writeTextMock).toHaveBeenCalledTimes(1);
  expect(writeTextMock).toHaveBeenCalledWith(expectedSymbol);
});`,
    explanation:
      'Tarayıcı ortamında clipboard izinleri sandbox gereği mocklanmalıdır. jest.fn() ile navigator.clipboard.writeText fonksiyonu dinlenir, tıklama sonrasında fonksiyonun 1 kez ve doğru emoji sembolüyle çağrıldığı doğrulanır.',
  },
];
