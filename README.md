# Google Maps Search Box for Chrome extension

Powered by [@googlemaps/extended-component-library](https://github.com/googlemaps/extended-component-library) and [WXT](https://github.com/wxt-dev/wxt)

Note that so long as Firefox does not support sandboxes, this extension can only work on Chromium browsers

> **Firefox support lives on the [`google-maps-search-by-api`](https://github.com/avi12/google-maps-search-box/tree/google-maps-search-by-api) branch.**
> It drops the Maps JS SDK - and with it the sandboxed page - and calls
> [Places API (New)](https://developers.google.com/maps/documentation/places/web-service/op-overview)
> over REST from the background script instead, so it builds as MV3 for both Chromium and Firefox

Preparation:

1. Create a Google Cloud Platform project
2. Enable [Maps JavaScript API](https://console.cloud.google.com/apis/library/maps-backend.googleapis.com), [Places API](https://console.cloud.google.com/apis/library/places-backend.googleapis.com), [Places API (New)](https://console.cloud.google.com/apis/library/places.googleapis.com)
3. Enter [Credentials](https://console.cloud.google.com/apis/credentials)
4. Click "Create credentials" → API Key
5. Click the newly created key
6. Name the key "Google Maps Places API"
7. Under "API restrictions", select "Restrict key" and
   1. Maps JavaScript API
   2. Places API
   3. Places API (New)
8. Put the API key in `.env.local` 
