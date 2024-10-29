import {mount, unmount} from "svelte";
import App from "./App.svelte";

async function getElementByMutationObserver(selector: string): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    new MutationObserver((_, observer) => {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    }).observe(document, {childList: true, subtree: true});
  })
}

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    const elementNameToInject = "google-maps-search-box";
    const selConatiner = "ytd-guide-section-renderer"
    const elGoogleMaps = document.querySelector(elementNameToInject);
    const elContainer = await getElementByMutationObserver(selConatiner);
    if (elGoogleMaps || !elContainer) {
      return;
    }

    const ui = await createShadowRootUi(ctx, {
      name: elementNameToInject,
      position: "inline",
      append: "first",
      anchor: elContainer,
      onMount: container => mount(App, {target: container}),
      onRemove: app => unmount(app!)
    });

    ui.mount();
  }
})
