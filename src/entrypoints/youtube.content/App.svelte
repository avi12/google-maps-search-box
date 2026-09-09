<script lang="ts">
  import {keepKeysToSelf} from "@/lib/dom.utils";
  import {MessageType, sendMessage} from "@/lib/messaging";
  import type {PlacePrediction} from "@/lib/types";
  import {onDestroy} from "svelte";

  const AUTOCOMPLETE_DEBOUNCE = 300;

  let query = $state("");
  let predictions = $state<PlacePrediction[]>([]);
  let address = $state("");
  let error = $state("");
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  // One Places session token spans every keystroke of a search plus the final details
  // lookup, so the whole search bills as a single session; picking a place ends it.
  let sessionToken: string | undefined;
  // A reply to an earlier keystroke can land after a later one's, so only the
  // predictions for the input still being typed are rendered.
  let latestInput = "";

  onDestroy(() => clearTimeout(debounceTimer));

  function ensureSessionToken() {
    sessionToken ??= crypto.randomUUID();
    return sessionToken;
  }

  function searchPlaces() {
    clearTimeout(debounceTimer);
    error = "";
    const input = query.trim();
    latestInput = input;
    if (!input) {
      predictions = [];
      return;
    }

    debounceTimer = setTimeout(() => void runAutocomplete(input), AUTOCOMPLETE_DEBOUNCE);
  }

  async function runAutocomplete(input: string) {
    const results = await sendMessage(MessageType.placeAutocomplete, {
      input,
      language: navigator.language,
      sessionToken: ensureSessionToken()
    });
    if (latestInput !== input) {
      return;
    }

    predictions = results;
  }

  async function selectPlace(prediction: PlacePrediction) {
    clearTimeout(debounceTimer);
    predictions = [];
    query = "";
    latestInput = "";
    const sessionTokenUsed = ensureSessionToken();
    sessionToken = undefined;

    const location = await sendMessage(MessageType.placeDetails, {
      placeId: prediction.placeId,
      language: navigator.language,
      sessionToken: sessionTokenUsed
    });
    if (!location) {
      error = "Couldn't resolve that place, try another";
      return;
    }

    address = location.address;
  }
</script>

<div class="search">
  <input {@attach keepKeysToSelf}
         bind:value={query}
         oninput={searchPlaces}
         placeholder="Enter your address"
         type="text"/>

  {#if predictions.length > 0}
    <ul class="results">
      {#each predictions as prediction (prediction.placeId)}
        <li>
          <button onclick={() => void selectPlace(prediction)} type="button">
            {#if prediction.mainText}
              <span class="main">{prediction.mainText}</span>
              {#if prediction.secondaryText}
                <span class="secondary">{prediction.secondaryText}</span>
              {/if}
            {:else}
              {prediction.description}
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <p class="address">Address: {address}</p>
</div>

<style>
  .search {
    padding: 8px 12px;
    color: var(--yt-spec-text-primary);
    font-size: 1.4rem;
  }

  input {
    box-sizing: border-box;
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--yt-spec-10-percent-layer);
    border-radius: 8px;
    background: var(--yt-spec-general-background-a);
    color: var(--yt-spec-text-primary);
    outline: none;
    font: inherit;
  }

  input:focus {
    border-color: var(--yt-spec-call-to-action);
  }

  .results {
    margin: 6px 0 0;
    padding: 0;
    border: 1px solid var(--yt-spec-10-percent-layer);
    border-radius: 8px;
    list-style: none;
    overflow: hidden;
  }

  .results button {
    display: block;
    width: 100%;
    padding: 8px 10px;
    border: none;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: pointer;
  }

  .results button:hover {
    background: var(--yt-spec-10-percent-layer);
  }

  .main {
    display: block;
  }

  .secondary {
    display: block;
    color: var(--yt-spec-text-secondary);
    font-size: 1.2rem;
  }

  .error {
    color: var(--yt-spec-brand-link-text);
  }

  .address {
    margin-bottom: 0;
  }
</style>
