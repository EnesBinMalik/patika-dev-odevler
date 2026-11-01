export interface Book {
  id: string;
  name: string;        // Kitap ismi
  pageCount: number;   // Sayfa sayısı
  authorName: string;  // Yazarın ismi
  publishDate: string; // Yayın tarihi
  genre: string;       // Tür (ek bilgi)
  description?: string;// Kısa özet
}

export const INITIAL_BOOKS: Book[] = [
  {
    id: "book-1",
    name: "Küçük Prens",
    pageCount: 96,
    authorName: "Antoine de Saint-Exupéry",
    publishDate: "1943",
    genre: "Klasik & Masal",
    description: "Sevgi, dostluk ve insan doğası üzerine derin felsefi bir başyapıt."
  },
  {
    id: "book-2",
    name: "Dönüşüm",
    pageCount: 80,
    authorName: "Franz Kafka",
    publishDate: "1915",
    genre: "Modern Klasik",
    description: "Gregor Samsa'nın bir sabah devasa bir böceğe dönüşmesiyle başlayan yabancılaşma öyküsü."
  },
  {
    id: "book-3",
    name: "Kürk Mantolu Madonna",
    pageCount: 160,
    authorName: "Sabahattin Ali",
    publishDate: "1943",
    genre: "Türk Edebiyatı",
    description: "Raif Efendi ile Maria Puder arasındaki unutulmaz, dokunaklı aşk hikayesi."
  },
  {
    id: "book-4",
    name: "Satranç",
    pageCount: 84,
    authorName: "Stefan Zweig",
    publishDate: "1942",
    genre: "Psikolojik Kurgu",
    description: "Gestapo tecritindeki bir adamın satranç üzerinden zihinsel direnç ve delilik mücadelesi."
  },
  {
    id: "book-5",
    name: "Beyaz Gemi",
    pageCount: 168,
    authorName: "Cengiz Aytmatov",
    publishDate: "1970",
    genre: "Kırgız Edebiyatı",
    description: "Issık Göl kıyısında dedesiyle yaşayan küçük bir çocuğun masum dünyası ve efsaneleri."
  },
  {
    id: "book-6",
    name: "Simyacı",
    pageCount: 184,
    authorName: "Paulo Coelho",
    publishDate: "1988",
    genre: "Felsefi Roman",
    description: "Endülüslü çoban Santiago'nun kişisel menkıbesini aramak için Mısır piramitlerine yolculuğu."
  },
  {
    id: "book-7",
    name: "Tutunamayanlar",
    pageCount: 724,
    authorName: "Oğuz Atay",
    publishDate: "1972",
    genre: "Postmodern Klasik",
    description: "Selim Işık'ın intiharını araştıran Turgut Özben'in Türk aydınıyla yüzleşmesi."
  },
  {
    id: "book-8",
    name: "İnsan Neyle Yaşar?",
    pageCount: 92,
    authorName: "Lev Tolstoy",
    publishDate: "1885",
    genre: "Ahlaki Hikaye",
    description: "Tolstoy'un sevgi, fedakarlık ve insanın varoluş amacını sorguladığı zamansız eseri."
  },
  {
    id: "book-9",
    name: "Saatleri Ayarlama Enstitüsü",
    pageCount: 382,
    authorName: "Ahmet Hamdi Tanpınar",
    publishDate: "1961",
    genre: "Hiciv & Klasik",
    description: "Doğu ile Batı arasında bocalayan Türk modernleşmesini hicveden benzersiz bir başyapıt."
  },
  {
    id: "book-10",
    name: "1984",
    pageCount: 352,
    authorName: "George Orwell",
    publishDate: "1949",
    genre: "Distopya",
    description: "Büyük Birader'in gözetimindeki totaliter rejimde gerçeği ve özgürlüğü arayan Winston Smith."
  }
];
