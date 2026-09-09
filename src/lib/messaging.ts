import type { PlaceLocation, PlacePrediction } from "@/lib/types";
import { defineExtensionMessaging } from "@webext-core/messaging";

export enum MessageType {
  placeAutocomplete = "place-autocomplete",
  placeDetails = "place-details"
}

interface ProtocolMap {
  [MessageType.placeAutocomplete]: (data: {
    input: string;
    language: string;
    sessionToken: string;
  }) => PlacePrediction[];
  [MessageType.placeDetails]: (data: {
    placeId: string;
    language: string;
    sessionToken: string;
  }) => PlaceLocation | null;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
