import type {Attachment} from "svelte/attachments";

// YouTube binds its hotkeys on the document and works out "is the user typing" from
// event.target - which, for anything inside our shadow root, retargets to the host element.
// Our field therefore never looks like a field to it, and every keystroke also seeks, mutes,
// or jumps into YouTube's own search box. Stopping propagation at the field is what keeps
// those bindings from ever seeing the key; the default action is deliberately left alone, so
// the character still lands in the input.
const SMOTHERED_KEY_EVENTS = ["keydown", "keyup", "keypress"] as const;

/** Svelte attachment for any text field rendered over a host page that binds its own hotkeys. */
export const keepKeysToSelf: Attachment<HTMLElement> = (elField) => {
  function smother(e: Event) {
    e.stopPropagation();
  }

  for (const eventName of SMOTHERED_KEY_EVENTS) {
    elField.addEventListener(eventName, smother);
  }

  return () => {
    for (const eventName of SMOTHERED_KEY_EVENTS) {
      elField.removeEventListener(eventName, smother);
    }
  };
};
