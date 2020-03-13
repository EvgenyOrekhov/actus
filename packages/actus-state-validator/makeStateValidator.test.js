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
  const schema = Joi.object({ foo: Joi.number() });
  const validateState = makeStateValidator(schema, {
    convert: false,
    allowUnknown: true
  });

  expect(() => validateState({ state: { foo: "123" } })).toThrow(
    '"foo" must be a number'
  );

  validateState({ state: { foo: 123, bar: 456 } });
});

it("normalizes state - convert", () => {
  const schema = Joi.number();
  const validateState = makeStateValidator(schema);
  const setStateFromStateValidator = jest.fn();

  validateState({ state: "123", actions: { setStateFromStateValidator } });

  expect(setStateFromStateValidator.mock.calls[0][0]).toStrictEqual(123);
});

it("normalizes state - defaults", () => {
  const schema = Joi.number().default(123);
  const validateState = makeStateValidator(schema);
  const setStateFromStateValidator = jest.fn();

  validateState({ state: undefined, actions: { setStateFromStateValidator } });

  expect(setStateFromStateValidator.mock.calls[0][0]).toStrictEqual(123);
});

it("doesn't call setStateFromStateValidator() if state is already normalized", () => {
  const schema = Joi.number();
  const validateState = makeStateValidator(schema);
  const setStateFromStateValidator = jest.fn();

  validateState({ state: 123, actions: { setStateFromStateValidator } });

  expect(setStateFromStateValidator.mock.calls.length).toStrictEqual(0);
});
