import Joi from "@hapi/joi";
import isDeepEqual from "fast-deep-equal";

export default function makeStateValidator(schema, options = undefined) {
  return function validateState({ state, actions }) {
    const normalizedState = Joi.attempt(state, schema, options);

    if (!isDeepEqual(state, normalizedState)) {
      actions.setStateFromStateValidator(normalizedState);
    }
  };
}
