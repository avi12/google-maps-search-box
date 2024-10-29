<script lang="ts">
  import "@googlemaps/extended-component-library/place_picker.js";

  const searchParams = new URLSearchParams(location.search);
  const language = searchParams.get("languageCode")!.split("-")[0] || "en";
  let locationStringManual = $state(searchParams.get("locationStringManual") || "");
</script>

<!--suppress HtmlUnknownTag -->
<gmpx-api-loader key={import.meta.env.VITE_GOOGLE_MAPS_PLACES_API} {language} solution-channel=""></gmpx-api-loader>

<div>
  {#if locationStringManual}
    Current address: {locationStringManual}
  {:else}
    &nbsp;
  {/if}
</div>
<!--suppress HtmlUnknownTag -->
<gmpx-place-picker ongmpx-placechange={e => {
                     const target = e.target;
                     if (!target.value) {
                       return;
                     }

                     const address = target.value.formattedAddress;
                     top?.postMessage(
                       {
                         payload: address
                       },
                       "*"
                     );
                   }}
                   ongmpx-requesterror={e => {
                     console.error(e);
                   }}

                   placeholder="Enter your address"
></gmpx-place-picker>
