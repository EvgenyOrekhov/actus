import deepFreeze from "deep-freeze";

export default function freeze() {
  return {
    name: "freeze",

    subscribers: [
      function freezeState({ state }) {
        if (!Object.isFrozen(state)) {
          deepFreeze(state);
        }
      },
    ],
  };
}
