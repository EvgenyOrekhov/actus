"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeLogger;

var _deepObjectDiff = require("deep-object-diff");

/* eslint-disable no-console */
function makeLogger({
  name
} = {}) {
  // eslint-disable-next-line fp/no-let, init-declarations
  let previousState;
  return ({
    state,
    actionName,
    value
  }) => {
    if (name === undefined) {
      console.groupCollapsed(`%caction %c${actionName}`, "color: gray; font-weight: lighter;", "font-weight: bold;");
    } else {
      console.groupCollapsed(`%c${name} %caction %c${actionName}`, "font-weight: bold;", "color: gray; font-weight: lighter;", "font-weight: bold;");
    }

    console.log("%cprev state", "color: #9E9E9E; font-weight: bold;", previousState);
    console.log("%cvalue", "color: #03A9F4; font-weight: bold;", value);
    console.log("%cnext state", "color: #4CAF50; font-weight: bold;", state);
    console.log("%cdiff", "color: #E8A400; font-weight: bold;", (0, _deepObjectDiff.diff)(previousState, state));
    console.groupEnd(); // eslint-disable-next-line fp/no-mutation

    previousState = state;
  };
}