<script lang="ts">
  const params = new URLSearchParams({
    languageCode: "en-US"
  });

  let addressManual = $state("");

  top?.addEventListener("message", e => {
    addressManual = e.data.payload;
    console.log(addressManual);
  });
</script>

<iframe src="{browser.runtime.getURL(`/google-maps-search-box.html`)}?{params}" title="Google Maps Search Box"></iframe>
<p>
  Address: {addressManual}
</p>
<style>
  :global {
    p {
      color: white !important;
    }
  }
</style>
