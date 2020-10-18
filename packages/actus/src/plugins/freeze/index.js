import deepFreeze from "deep-freeze";

export default function freeze({
  isEnabled = process.env.NODE_ENV !== "production",
} = {}) {
  if (isEnabled) {
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

  return { name: "freeze" };
}
