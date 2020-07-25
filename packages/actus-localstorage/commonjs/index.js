"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = localStoragePlugin;

/* global localStorage */
function localStoragePlugin({
  key = "state",
  selector = state => state,
  storage = localStorage
} = {}) {
  function getState() {
    try {
      return JSON.parse(storage[key]);
    } catch {
      return undefined;
    }
  }

  return {
    state: getState(),
    subscribers: [({
      state
    }) => {
      // eslint-disable-next-line fp/no-mutation, no-param-reassign
      storage[key] = JSON.stringify(selector(state));
    }]
  };
}