import {defineConfig, type UserManifest} from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-svelte"],
  manifest({browser, mode}) {
    let manifest: UserManifest = {
      name: "Google Maps Search Box"
    };
    if (browser !== "firefox") {
      manifest = {
        ...manifest,
        content_security_policy: {
          sandbox: "sandbox allow-scripts; script-src-elem 'self' https://maps.googleapis.com"
        },
        web_accessible_resources: [
          {
            resources: ["google-maps-search-box.html",],
            matches: ["https://www.youtube.com/*"]
          }
        ]
      }
      if (mode === "development") {
        manifest.content_security_policy.sandbox += " http://localhost:3000";
      }
    }
    return manifest;
  },
  outDirTemplate: "{{browser}}-mv{{manifestVersion}}-{{mode}}"
});
