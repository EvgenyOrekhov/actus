import Joi from "@hapi/joi";

import makeStateValidator from "./makeStateValidator.js";

test("validates state", () => {
  const schema = Joi.string();
  const validateState = makeStateValidator(schema);

  expect(() => {
    validateState({ state: 123 });
  }).toThrow('"value" must be a string');
});

test("supports options", () => {
  const schema = Joi.object({ foo: Joi.number() });
  const validateState = makeStateValidator(schema, {
    /* eslint-disable @typescript-eslint/naming-convention */
    convert: false,
    allowUnknown: true,
    /* eslint-enable */
  });

  expect(() => {
    validateState({ state: { foo: "123" } });
  }).toThrow('"foo" must be a number');

  validateState({ state: { foo: 123, bar: 456 } });
});

test("normalizes state - convert", () => {
  const schema = Joi.number();
  const validateState = makeStateValidator(schema);
  const setStateFromStateValidator = jest.fn();

  validateState({ state: "123", actions: { setStateFromStateValidator } });

  expect(setStateFromStateValidator.mock.calls[0][0]).toBe(123);
});

test("normalizes state - defaults", () => {
  const schema = Joi.number().default(123);
  const validateState = makeStateValidator(schema);
  const setStateFromStateValidator = jest.fn();

  validateState({ state: undefined, actions: { setStateFromStateValidator } });

  expect(setStateFromStateValidator.mock.calls[0][0]).toBe(123);
});

test("doesn't call setStateFromStateValidator() if state is already normalized", () => {
  const schema = Joi.number();
  const validateState = makeStateValidator(schema);
  const setStateFromStateValidator = jest.fn();

  validateState({ state: 123, actions: { setStateFromStateValidator } });

  expect(setStateFromStateValidator.mock.calls).toHaveLength(0);
});
