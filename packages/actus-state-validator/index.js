import makeStateValidator from "./makeStateValidator.js";

export default function stateValidator(schema, options = undefined) {
  return {
    actions: { setStateFromStateValidator: ({ payload }) => payload },
    subscribers: [makeStateValidator(schema, options)],
  };
}
