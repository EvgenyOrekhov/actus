import makeDefaultActions from "./makeDefaultActions.js";

export default function defaultActions(initialState) {
  return {
    actions: makeDefaultActions(initialState),
  };
}
