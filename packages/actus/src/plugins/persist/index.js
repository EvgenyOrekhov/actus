/* global localStorage */

export default function persist({
  key = "state",
  selector = (state) => state,
  storage = localStorage,
} = {}) {
  function getStateFromStorage() {
    try {
      return JSON.parse(storage.getItem(key)) ?? undefined;
    } catch {
      return undefined;
    }
  }

  return {
    state: getStateFromStorage(),

    subscribers: [
      function saveStateToStorage({ state }) {
        storage.setItem(key, JSON.stringify(selector(state)));
      },
    ],
  };
}
