export interface CharacterOrigin {
  id?: string;
  name: string;
  dimension?: string;
  type?: string;
}

export interface CharacterLocation {
  id?: string;
  name: string;
  dimension?: string;
  type?: string;
}

export interface Episode {
  id: string;
  name: string;
  episode: string;
  air_date: string;
}

export interface Character {
  id: string;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown' | string;
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown' | string;
  image: string;
  origin: CharacterOrigin;
  location: CharacterLocation;
  episode: Episode[];
}

export interface PageInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

export interface CharactersResponse {
  info: PageInfo;
  results: Character[];
}

export interface LocationItem {
  id: string;
  name: string;
  type: string;
  dimension: string;
  residentsCount?: number;
}

export interface FilterState {
  name: string;
  status: string;
  species: string;
  gender: string;
  locationId: string;
  locationName: string;
}

export type ViewMode = 'grid' | 'table';
