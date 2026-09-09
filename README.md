# Google Maps Search Box

A web extension that puts a Google Places search box into YouTube's sidebar, powered by
[Places API (New)](https://developers.google.com/maps/documentation/places/web-service/op-overview)
and [WXT](https://github.com/wxt-dev/wxt)

## Browser support

| Browser             | Manifest | Build                 |
|---------------------|----------|-----------------------|
| Chrome, Edge, Opera | MV3      | `pnpm build`          |
| Firefox             | MV3      | `pnpm build:firefox`  |

Firefox included: the search box no longer loads the Maps JS SDK, which needed a
Chromium-only sandboxed page. It is plain Svelte, and the Places calls are REST requests made
from the background script - so nothing here is Chromium-specific

## How it works

1. The content script mounts the search box into YouTube's guide, in a shadow root
2. Typing is debounced for 300 ms, then sent to the background script
3. The background calls [Autocomplete (New)](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete)
   and returns the suggestions
4. Picking a suggestion resolves it through [Place Details (New)](https://developers.google.com/maps/documentation/places/web-service/place-details),
   under the same session token used while typing - so a whole search bills as one Places
   session instead of once per keystroke

The API key stays in the background script, and both endpoints answer with
`Access-Control-Allow-Origin`, so the extension asks for no host permissions

## Preparation

1. Create a Google Cloud Platform project
2. Enable [Places API (New)](https://console.cloud.google.com/apis/library/places.googleapis.com)
3. Enter [Credentials](https://console.cloud.google.com/apis/credentials)
4. Click "Create credentials" → API Key
5. Click the newly created key
6. Name the key "Google Maps Places API"
7. Under "API restrictions", select "Restrict key" and pick "Places API (New)"
8. Copy `.env.local.example` to `.env.local` and put the API key in it

The key ships inside the bundle, so it is public by nature - the API restriction above is what
protects it. On the Chromium builds you can narrow it further under "Application restrictions"
→ "Websites", with `chrome-extension://<extension id>/*`; Firefox gives every installation its
own `moz-extension://` UUID, so there is no fixed origin to allow-list there

## Development

```shell
pnpm install
pnpm dev           # Chrome
pnpm dev:firefox   # Firefox
pnpm check         # svelte-check
pnpm lint          # oxlint --fix -> eslint --fix -> oxlint (the gate)
```

Correctness and logic rules live in `.oxlintrc.json`; ESLint carries only what oxlint cannot -
formatting, Svelte template rules and the local rules in `eslint-rules/`
