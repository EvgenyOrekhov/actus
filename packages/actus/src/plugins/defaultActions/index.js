import makeDefaultActions from "./makeDefaultActions.js";

export default function defaultActions(initialState) {
  return {
    name: "defaultActions",
    actions: makeDefaultActions(initialState),
  };
}
