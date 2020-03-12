import Joi from "@hapi/joi";

import makeStateValidator from "./makeStateValidator.js";

it("validates state", () => {
  const schema = Joi.string();
  const validateState = makeStateValidator(schema);

  expect(() => validateState({ state: 123 })).toThrow(
    '"value" must be a string'
  );
});

it("supports options", () => {
  const schema = Joi.number();
  const validateState = makeStateValidator(schema, { convert: false });

  expect(() => validateState({ state: "123" })).toThrow(
    '"value" must be a number'
  );
});
