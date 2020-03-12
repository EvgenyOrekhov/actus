import Joi from "@hapi/joi";

export default function makeStateValidator(schema, options = undefined) {
  return function validateState({ state }) {
    Joi.assert(state, schema, options);
  };
}
