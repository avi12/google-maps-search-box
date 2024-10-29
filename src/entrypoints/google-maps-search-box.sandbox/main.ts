import {mount} from "svelte";
import GoogleMapsSearch from "@/entrypoints/google-maps-search-box.sandbox/GoogleMapsSearch.svelte";

mount(GoogleMapsSearch, {
  target: document.getElementById("app")!
});
