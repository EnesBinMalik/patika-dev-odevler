export interface QuerySample {
  id: string;
  name: string;
  category: 'Required' | 'Continents' | 'Countries' | 'Languages' | 'Advanced';
  description: string;
  query: string;
  variables?: string;
}

export const QUERY_SAMPLES: QuerySample[] = [
  {
    id: 'all-countries',
    name: 'All Countries (Gereksinim)',
    category: 'Required',
    description: 'Tüm ülkeleri, bayrak emojilerini, ait oldukları kıtayı ve konuşulan dilleri ilişkisel olarak getirir.',
    query: `query AllCountries {
  countries {
    name
    emoji
    continent {
      name
    }
    languages {
      name
      native
    }
  }
}`,
  },
  {
    id: 'single-country-tr',
    name: 'Single Country - Turkey (Gereksinim)',
    category: 'Required',
    description: 'ISO kodu "TR" olan Türkiye için isim, emoji, kıta ve dilleri ilişkisel olarak getirir.',
    query: `query Single {
  country(code: "TR") {
    name
    emoji
    continent {
      name
    }
    languages {
      name
      native
    }
  }
}`,
  },
  {
    id: 'all-continents',
    name: 'All Continents & Countries',
    category: 'Continents',
    description: 'Tüm kıtaları ve her kıtadaki ülkeleri listeleyen ilişkisel sorgu.',
    query: `query AllContinents {
  continents {
    code
    name
    countries {
      code
      name
      emoji
    }
  }
}`,
  },
  {
    id: 'single-continent-eu',
    name: 'Single Continent - Europe (EU)',
    category: 'Continents',
    description: 'Avrupa kıtasını ve bünyesindeki ülkeleri, başkentleri ve para birimleriyle çeker.',
    query: `query EuropeContinent {
  continent(code: "EU") {
    code
    name
    countries {
      code
      name
      emoji
      capital
      currency
    }
  }
}`,
  },
  {
    id: 'all-languages',
    name: 'All Languages & Spoken Countries',
    category: 'Languages',
    description: 'Tüm dilleri, orijinal yerel isimlerini ve bu dillerin konuşulduğu ülkeleri getirir.',
    query: `query AllLanguages {
  languages {
    code
    name
    native
    rtl
    countries {
      code
      name
      emoji
    }
  }
}`,
  },
  {
    id: 'single-language-tr',
    name: 'Single Language - Turkish (tr)',
    category: 'Languages',
    description: 'Türkçe dilini (kod, isim, RTL durumu) ve konuşulduğu ülkeleri ilişkisel olarak sorgular.',
    query: `query SingleLanguage {
  language(code: "tr") {
    code
    name
    native
    rtl
    countries {
      code
      name
      emoji
      capital
    }
  }
}`,
  },
  {
    id: 'filtered-countries-eu',
    name: 'Filtered Countries - Europe (EU)',
    category: 'Countries',
    description: 'Kıta filtresi kullanarak yalnızca Avrupa ülkelerini ve dillerini getirir.',
    query: `query FilteredEurope {
  countries(filter: { continent: { eq: "EU" } }) {
    code
    name
    emoji
    capital
    currency
    languages {
      name
      native
    }
  }
}`,
  },
  {
    id: 'deep-relational',
    name: 'Deep Bi-directional Relation',
    category: 'Advanced',
    description: 'Ülke -> Kıta -> Kıta Ülkeleri -> Diller arasında derin ilişkisel ağ zinciri.',
    query: `query DeepGraph {
  country(code: "DE") {
    name
    emoji
    capital
    continent {
      name
      countries {
        code
        name
        emoji
      }
    }
    languages {
      name
      native
    }
  }
}`,
  },
];
