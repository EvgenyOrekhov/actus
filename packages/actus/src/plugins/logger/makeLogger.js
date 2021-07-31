/* eslint-disable no-console */

import { diff } from "deep-object-diff";

export default function makeLogger({ name } = {}) {
  // eslint-disable-next-line fp/no-let, @typescript-eslint/init-declarations
  let previousState;

  return function logAction({ state, actionName, payload }) {
    const prettyActionName = Array.isArray(actionName)
      ? actionName.join(".")
      : actionName;

    if (name === undefined) {
      console.groupCollapsed(
        `%caction %c${prettyActionName}`,
        "color: gray; font-weight: lighter;",
        "font-weight: bold;"
      );
    } else {
      console.groupCollapsed(
        `%c${name} %caction %c${prettyActionName}`,
        "font-weight: bold;",
        "color: gray; font-weight: lighter;",
        "font-weight: bold;"
      );
    }

    console.log(
      "%cprev state",
      "color: #9E9E9E; font-weight: bold;",
      previousState
    );
    console.log("%cpayload", "color: #03A9F4; font-weight: bold;", payload);
    console.log("%cnext state", "color: #4CAF50; font-weight: bold;", state);
    console.log(
      "%cdiff",
      "color: #E8A400; font-weight: bold;",
      diff(previousState, state)
    );
    console.groupEnd();

    // eslint-disable-next-line fp/no-mutation
    previousState = state;
  };
}
