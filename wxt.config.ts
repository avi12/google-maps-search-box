import {defineConfig} from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-svelte"],
  manifest: {
    name: "Google Maps Search Box"
  },
  outDirTemplate: "{{browser}}-mv{{manifestVersion}}-{{mode}}"
});
