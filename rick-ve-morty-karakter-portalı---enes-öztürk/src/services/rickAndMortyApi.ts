import { Character, CharactersResponse, FilterState, LocationItem } from '../types/rickAndMorty';

const GRAPHQL_ENDPOINT = 'https://rickandmortyapi.com/graphql';

async function graphqlFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL Network error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();

  // The Rick and Morty GraphQL API returns an error when no results match a filter (e.g. "404: There is nothing here")
  if (json.errors && (!json.data || Object.values(json.data).every((v) => v === null))) {
    const isNotFound = json.errors.some((e: { message?: string }) =>
      e.message?.toLowerCase().includes('there is nothing here') ||
      e.message?.toLowerCase().includes('not found') ||
      e.message?.toLowerCase().includes('404')
    );
    if (isNotFound) {
      // return a safe empty representation
      return {
        characters: {
          info: { count: 0, pages: 0, next: null, prev: null },
          results: [],
        },
      } as unknown as T;
    }
    throw new Error(json.errors[0]?.message || 'GraphQL Query Error');
  }

  return json.data as T;
}

const CHARACTERS_QUERY = `
  query GetCharacters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        type
        gender
        image
        location {
          id
          name
          dimension
          type
        }
        origin {
          id
          name
          dimension
          type
        }
        episode {
          id
          name
          episode
          air_date
        }
      }
    }
  }
`;

const CHARACTER_BY_ID_QUERY = `
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      image
      location {
        id
        name
        dimension
        type
      }
      origin {
        id
        name
        dimension
        type
      }
      episode {
        id
        name
        episode
        air_date
      }
    }
  }
`;

const LOCATIONS_QUERY = `
  query GetLocations($page: Int, $name: String) {
    locations(page: $page, filter: { name: $name }) {
      info {
        count
        pages
      }
      results {
        id
        name
        type
        dimension
        residents {
          id
        }
      }
    }
  }
`;

const LOCATION_RESIDENTS_QUERY = `
  query GetLocationResidents($id: ID!) {
    location(id: $id) {
      id
      name
      type
      dimension
      residents {
        id
        name
        status
        species
        type
        gender
        image
        location {
          id
          name
          dimension
          type
        }
        origin {
          id
          name
          dimension
          type
        }
        episode {
          id
          name
          episode
          air_date
        }
      }
    }
  }
`;

export async function fetchCharacters(
  page = 1,
  filters: FilterState
): Promise<CharactersResponse> {
  // If locationId is selected, query location residents
  if (filters.locationId && filters.locationId !== 'all') {
    return fetchCharactersByLocation(filters.locationId, page, filters);
  }

  const filterParam: Record<string, string> = {};
  if (filters.name.trim()) filterParam.name = filters.name.trim();
  if (filters.status && filters.status !== 'all') filterParam.status = filters.status;
  if (filters.species && filters.species !== 'all') filterParam.species = filters.species;
  if (filters.gender && filters.gender !== 'all') filterParam.gender = filters.gender;

  const data = await graphqlFetch<{
    characters: CharactersResponse | null;
  }>(CHARACTERS_QUERY, {
    page,
    filter: Object.keys(filterParam).length > 0 ? filterParam : undefined,
  });

  if (!data?.characters) {
    return {
      info: { count: 0, pages: 0, next: null, prev: null },
      results: [],
    };
  }

  return data.characters;
}

async function fetchCharactersByLocation(
  locationId: string,
  page = 1,
  filters: FilterState
): Promise<CharactersResponse> {
  const data = await graphqlFetch<{
    location: {
      id: string;
      name: string;
      type: string;
      dimension: string;
      residents: Character[];
    } | null;
  }>(LOCATION_RESIDENTS_QUERY, { id: locationId });

  if (!data?.location || !data.location.residents) {
    return {
      info: { count: 0, pages: 0, next: null, prev: null },
      results: [],
    };
  }

  let residents = data.location.residents;

  // Apply other active filters
  if (filters.name.trim()) {
    const q = filters.name.trim().toLowerCase();
    residents = residents.filter((c) => c.name.toLowerCase().includes(q));
  }
  if (filters.status && filters.status !== 'all') {
    residents = residents.filter(
      (c) => c.status.toLowerCase() === filters.status.toLowerCase()
    );
  }
  if (filters.species && filters.species !== 'all') {
    residents = residents.filter(
      (c) => c.species.toLowerCase() === filters.species.toLowerCase()
    );
  }
  if (filters.gender && filters.gender !== 'all') {
    residents = residents.filter(
      (c) => c.gender.toLowerCase() === filters.gender.toLowerCase()
    );
  }

  const PAGE_SIZE = 20;
  const count = residents.length;
  const pages = Math.ceil(count / PAGE_SIZE) || 1;
  const currentPage = Math.max(1, Math.min(page, pages));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedResults = residents.slice(startIndex, startIndex + PAGE_SIZE);

  return {
    info: {
      count,
      pages,
      next: currentPage < pages ? currentPage + 1 : null,
      prev: currentPage > 1 ? currentPage - 1 : null,
    },
    results: pagedResults,
  };
}

export async function fetchCharacterById(id: string): Promise<Character | null> {
  const data = await graphqlFetch<{
    character: Character | null;
  }>(CHARACTER_BY_ID_QUERY, { id });

  return data?.character ?? null;
}

export async function fetchLocationsList(search = '', page = 1): Promise<{
  locations: LocationItem[];
  totalPages: number;
}> {
  try {
    const data = await graphqlFetch<{
      locations: {
        info: { pages: number };
        results: Array<{
          id: string;
          name: string;
          type: string;
          dimension: string;
          residents: Array<{ id: string }>;
        }>;
      } | null;
    }>(LOCATIONS_QUERY, {
      page,
      name: search.trim() ? search.trim() : undefined,
    });

    if (!data?.locations?.results) {
      return { locations: [], totalPages: 0 };
    }

    return {
      locations: data.locations.results.map((loc) => ({
        id: loc.id,
        name: loc.name,
        type: loc.type,
        dimension: loc.dimension,
        residentsCount: loc.residents?.length || 0,
      })),
      totalPages: data.locations.info.pages,
    };
  } catch (error) {
    console.error('Failed to load locations', error);
    return { locations: [], totalPages: 0 };
  }
}
