import makeStateValidator from "./makeStateValidator.js";

export default function stateValidator(schema, options = undefined) {
  return {
    subscribers: [makeStateValidator(schema, options)]
  };
}
