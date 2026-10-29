import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
} from 'graphql';
import { CONTINENTS, COUNTRIES, LANGUAGES, CountryData, ContinentData, LanguageData } from './data.ts';

// String operator input for filters like { eq: "TR" }
const StringQueryOperatorInput = new GraphQLInputObjectType({
  name: 'StringQueryOperatorInput',
  fields: {
    eq: { type: GraphQLString },
    ne: { type: GraphQLString },
    in: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
    nin: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
    regex: { type: GraphQLString },
  },
});

const CountryFilterInput = new GraphQLInputObjectType({
  name: 'CountryFilterInput',
  fields: {
    code: { type: StringQueryOperatorInput },
    continent: { type: StringQueryOperatorInput },
    currency: { type: StringQueryOperatorInput },
  },
});

const ContinentFilterInput = new GraphQLInputObjectType({
  name: 'ContinentFilterInput',
  fields: {
    code: { type: StringQueryOperatorInput },
  },
});

const LanguageFilterInput = new GraphQLInputObjectType({
  name: 'LanguageFilterInput',
  fields: {
    code: { type: StringQueryOperatorInput },
  },
});

// Helper for filter evaluation
function matchesFilter(value: string | undefined, op?: { eq?: string; ne?: string; in?: string[]; nin?: string[]; regex?: string } | null) {
  if (!op) return true;
  if (!value) return false;
  if (op.eq !== undefined && value.toLowerCase() !== op.eq.toLowerCase()) return false;
  if (op.ne !== undefined && value.toLowerCase() === op.ne.toLowerCase()) return false;
  if (op.in !== undefined && !op.in.map(v => v.toLowerCase()).includes(value.toLowerCase())) return false;
  if (op.nin !== undefined && op.nin.map(v => v.toLowerCase()).includes(value.toLowerCase())) return false;
  if (op.regex !== undefined) {
    try {
      const reg = new RegExp(op.regex, 'i');
      if (!reg.test(value)) return false;
    } catch {
      return false;
    }
  }
  return true;
}

// Language Type
export const LanguageType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Language',
  description: 'Represents a spoken or written human language',
  fields: () => ({
    code: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    native: { type: new GraphQLNonNull(GraphQLString) },
    rtl: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (lang: LanguageData) => Boolean(lang.rtl),
    },
    countries: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CountryType))),
      description: 'List of countries where this language is officially or widely spoken',
      resolve: (lang: LanguageData) => {
        return COUNTRIES.filter(c => c.languageCodes.includes(lang.code));
      },
    },
  }),
});

// Continent Type
export const ContinentType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Continent',
  description: 'Represents one of the Earth’s major landmasses',
  fields: () => ({
    code: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    countries: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CountryType))),
      description: 'List of countries situated in this continent',
      resolve: (continent: ContinentData) => {
        return COUNTRIES.filter(c => c.continentCode.toUpperCase() === continent.code.toUpperCase());
      },
    },
  }),
});

// Country Type
export const CountryType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Country',
  description: 'Represents a sovereign country or territory with relational continent and languages',
  fields: () => ({
    code: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    native: { type: new GraphQLNonNull(GraphQLString) },
    phone: { type: new GraphQLNonNull(GraphQLString) },
    capital: { type: GraphQLString },
    currency: { type: GraphQLString },
    emoji: { type: new GraphQLNonNull(GraphQLString) },
    emojiU: { type: new GraphQLNonNull(GraphQLString) },
    continent: {
      type: new GraphQLNonNull(ContinentType),
      description: 'The continent to which this country belongs',
      resolve: (country: CountryData) => {
        const found = CONTINENTS.find(c => c.code.toUpperCase() === country.continentCode.toUpperCase());
        return found || { code: country.continentCode, name: country.continentCode };
      },
    },
    languages: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(LanguageType))),
      description: 'List of languages spoken in this country',
      resolve: (country: CountryData) => {
        return country.languageCodes
          .map(lCode => LANGUAGES.find(l => l.code.toLowerCase() === lCode.toLowerCase()))
          .filter((l): l is LanguageData => Boolean(l));
      },
    },
  }),
});

// Root Query
export const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    // Countries
    countries: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(CountryType))),
      description: 'Retrieve all countries, optionally filtered by code, continent, or currency',
      args: {
        filter: { type: CountryFilterInput },
      },
      resolve: (_root, args) => {
        let results = [...COUNTRIES];
        if (args.filter) {
          if (args.filter.code) {
            results = results.filter(c => matchesFilter(c.code, args.filter.code));
          }
          if (args.filter.continent) {
            results = results.filter(c => matchesFilter(c.continentCode, args.filter.continent));
          }
          if (args.filter.currency) {
            results = results.filter(c => matchesFilter(c.currency, args.filter.currency));
          }
        }
        return results;
      },
    },
    country: {
      type: CountryType,
      description: 'Retrieve a single country by its 2-letter ISO code (e.g. "TR", "US", "DE")',
      args: {
        code: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_root, args: { code: string }) => {
        return COUNTRIES.find(c => c.code.toUpperCase() === args.code.trim().toUpperCase()) || null;
      },
    },

    // Continents
    continents: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ContinentType))),
      description: 'Retrieve all continents',
      args: {
        filter: { type: ContinentFilterInput },
      },
      resolve: (_root, args) => {
        let results = [...CONTINENTS];
        if (args.filter && args.filter.code) {
          results = results.filter(c => matchesFilter(c.code, args.filter.code));
        }
        return results;
      },
    },
    continent: {
      type: ContinentType,
      description: 'Retrieve a single continent by its code (e.g. "EU", "AS", "AF")',
      args: {
        code: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_root, args: { code: string }) => {
        return CONTINENTS.find(c => c.code.toUpperCase() === args.code.trim().toUpperCase()) || null;
      },
    },

    // Languages
    languages: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(LanguageType))),
      description: 'Retrieve all languages',
      args: {
        filter: { type: LanguageFilterInput },
      },
      resolve: (_root, args) => {
        let results = [...LANGUAGES];
        if (args.filter && args.filter.code) {
          results = results.filter(l => matchesFilter(l.code, args.filter.code));
        }
        return results;
      },
    },
    language: {
      type: LanguageType,
      description: 'Retrieve a single language by its ISO code (e.g. "tr", "en", "es")',
      args: {
        code: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_root, args: { code: string }) => {
        return LANGUAGES.find(l => l.code.toLowerCase() === args.code.trim().toLowerCase()) || null;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQueryType,
});

export const SCHEMA_SDL = `"""
Countries GraphQL API
Developed by Enes Öztürk
"""
type Continent {
  code: ID!
  name: String!
  countries: [Country!]!
}

type Country {
  code: ID!
  name: String!
  native: String!
  phone: String!
  continent: Continent!
  capital: String
  currency: String
  languages: [Language!]!
  emoji: String!
  emojiU: String!
}

type Language {
  code: ID!
  name: String!
  native: String!
  rtl: Boolean!
  countries: [Country!]!
}

input StringQueryOperatorInput {
  eq: String
  ne: String
  in: [String!]
  nin: [String!]
  regex: String
}

input CountryFilterInput {
  code: StringQueryOperatorInput
  continent: StringQueryOperatorInput
  currency: StringQueryOperatorInput
}

input ContinentFilterInput {
  code: StringQueryOperatorInput
}

input LanguageFilterInput {
  code: StringQueryOperatorInput
}

type Query {
  countries(filter: CountryFilterInput): [Country!]!
  country(code: ID!): Country
  continents(filter: ContinentFilterInput): [Continent!]!
  continent(code: ID!): Continent
  languages(filter: LanguageFilterInput): [Language!]!
  language(code: ID!): Language
}
`;
