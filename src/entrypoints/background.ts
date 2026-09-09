import { MessageType, onMessage } from "@/lib/messaging";
import { getPlaceDetails, getPlacePredictions } from "@/lib/places";

export default defineBackground(() => {
  onMessage(MessageType.placeAutocomplete, ({ data }) => getPlacePredictions(data));
  onMessage(MessageType.placeDetails, ({ data }) => getPlaceDetails(data));
});
