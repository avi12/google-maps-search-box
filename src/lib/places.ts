import {fetchJson} from "@/lib/fetch.utils";
import type {PlaceLocation, PlacePrediction} from "@/lib/types";
import {z} from "zod";

// The key ships inside the bundle, so it is public by nature - the real protection is
// project-side: Places API (New) honours HTTP-referrer-restricted keys, so restrict the
// key to this extension's own origins (chrome-extension://<id>, moz-extension://<uuid>).
// Both endpoints answer with Access-Control-Allow-Origin, so the calls need no host
// permission - but they must run in the background, since a content script's fetch is
// held to the host page's CSP on Firefox, and youtube.com does not allow this origin.
const PLACES_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_PLACES_API;

// Only the fields the search box actually shows. A narrower mask keeps the
// Place Details call in the cheapest billing tier.
const PLACE_DETAILS_FIELD_MASK = "location,formattedAddress";

// Request body for Places Autocomplete (New), typed from the REST reference so a wrong
// field name or type is caught at the call site. Location-bias and origin inputs are
// omitted - this search box biases towards nothing.
// https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places/autocomplete
interface PlacesAutocompleteRequest {
  input: string;
  languageCode?: string;
  regionCode?: string;
  includedPrimaryTypes?: string[];
  includedRegionCodes?: string[];
  inputOffset?: number;
  includeQueryPredictions?: boolean;
  sessionToken?: string;
}

const placesAutocompleteResponseSchema = z.object({
  suggestions: z.array(
    z.object({
      placePrediction: z.object({
        placeId: z.string(),
        text: z.object({text: z.string()}),
        structuredFormat: z.object({
          mainText: z.object({text: z.string()}).optional(),
          secondaryText: z.object({text: z.string()}).optional()
        }).optional()
      }).optional()
    })
  ).optional()
});

const placeDetailsResponseSchema = z.object({
  location: z.object({
    latitude: z.number(),
    longitude: z.number()
  }).optional(),
  formattedAddress: z.string().optional()
});

export async function getPlacePredictions({input, language, sessionToken}: {
  input: string;
  language: string;
  sessionToken: string;
}) {
  const predictions: PlacePrediction[] = [];
  if (!input.trim()) {
    return predictions;
  }

  const {suggestions = []} = await fetchJson({
    input: "https://places.googleapis.com/v1/places:autocomplete",
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_API_KEY
      },
      body: JSON.stringify({
        input,
        languageCode: language,
        sessionToken
      } satisfies PlacesAutocompleteRequest)
    },
    schema: placesAutocompleteResponseSchema
  });

  for (const {placePrediction} of suggestions) {
    if (!placePrediction) {
      continue;
    }

    predictions.push({
      description: placePrediction.text.text,
      mainText: placePrediction.structuredFormat?.mainText?.text,
      secondaryText: placePrediction.structuredFormat?.secondaryText?.text,
      placeId: placePrediction.placeId
    });
  }

  return predictions;
}

// The place picker resolved a picked prediction with Place.fetchFields under the same
// session token it used while typing, so a whole search bills as one Places session
// instead of per keystroke. Reproduced here with Place Details (New).
export async function getPlaceDetails({placeId, language, sessionToken}: {
  placeId: string;
  language: string;
  sessionToken: string;
}) {
  const params = new URLSearchParams({
    languageCode: language,
    sessionToken
  });

  const {location, formattedAddress} = await fetchJson({
    input: `https://places.googleapis.com/v1/places/${placeId}?${params}`,
    init: {
      headers: {
        "X-Goog-Api-Key": PLACES_API_KEY,
        "X-Goog-FieldMask": PLACE_DETAILS_FIELD_MASK
      }
    },
    schema: placeDetailsResponseSchema
  });
  if (!location || !formattedAddress) {
    return null;
  }

  return {
    address: formattedAddress,
    latitude: location.latitude,
    longitude: location.longitude
  } satisfies PlaceLocation;
}
