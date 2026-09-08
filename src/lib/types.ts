/** A place-autocomplete suggestion: the text to show plus the id that resolves it. */
export interface PlacePrediction {
  description: string;
  /** Bold primary line (the place itself) when the API splits the suggestion. */
  mainText?: string;
  /** Muted secondary line (city/region/country) when the API splits the suggestion. */
  secondaryText?: string;
  placeId: string;
}

/** A picked place, resolved to the address and point the page consumes. */
export interface PlaceLocation {
  address: string;
  latitude: number;
  longitude: number;
}
