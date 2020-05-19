import deepFreeze from "deep-freeze";

export default function freeze() {
  return {
    subscribers: [
      function freezeState({ state }) {
        if (!Object.isFrozen(state)) {
          deepFreeze(state);
        }
      },
    ],
  };
}
