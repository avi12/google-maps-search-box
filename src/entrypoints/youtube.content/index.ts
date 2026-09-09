import App from "./App.svelte";
import { mount, unmount } from "svelte";

async function getElementByMutationObserver(selector: string): Promise<HTMLElement | null> {
  return new Promise(resolve => {
    new MutationObserver((_, observer) => {
      const elFound = document.querySelector<HTMLElement>(selector);
      if (elFound) {
        observer.disconnect();
        resolve(elFound);
      }
    }).observe(document, {
      childList: true,
      subtree: true
    });
  });
}

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    const elementNameToInject = "google-maps-search-box";
    const selConatiner = "ytd-guide-section-renderer";
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
      onMount: container => mount(App, { target: container }),
      onRemove: app => unmount(app!)
    });

    ui.mount();
  }
});
