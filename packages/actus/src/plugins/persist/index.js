/* global localStorage */

export default function persist({
  key = "state",
  selector = (state) => state,
  storage = localStorage,
} = {}) {
  function getStateFromStorage() {
    try {
      return JSON.parse(storage[key]);
    } catch {
      return undefined;
    }
  }

  return {
    state: getStateFromStorage(),

    subscribers: [
      function saveStateToStorage({ state }) {
        // eslint-disable-next-line fp/no-mutation, no-param-reassign
        storage[key] = JSON.stringify(selector(state));
      },
    ],
  };
}
