import makeStateValidator from "./makeStateValidator.js";

export default function stateValidator(schema, options = undefined) {
  return {
    actions: { setStateFromStateValidator: value => value },
    subscribers: [makeStateValidator(schema, options)]
  };
}
