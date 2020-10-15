/* global localStorage */

export default function persist({
  key = "state",
  selector = (state) => state,
  storage = localStorage,
} = {}) {
  function getStateFromStorage() {
    try {
      const state = JSON.parse(storage.getItem(key));

      return state === null ? undefined : state;
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
