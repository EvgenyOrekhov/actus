import logger from "actus-logger";
// eslint-disable-next-line import/no-unresolved, node/no-missing-import
import { getOwner, mockResolveRegistration } from "@ember/application";

import actusify from "./index.js";

jest.mock("actus-logger");
jest.mock("@ember/application");

test("actusify()", () => {
  const target = {
    state: 0,
    actions: {
      inc: (ignore, state) => state + 1,
    },
  };

  actusify(target);

  target.actions.inc();

  expect(target.state).toStrictEqual(1);
});

test("default actions", () => {
  const target = {
    state: 0,
  };

  actusify(target);

  target.actions.increment();

  expect(target.state).toStrictEqual(1);
});

test("default actions can be overridden", () => {
  const target = {
    state: 0,
    actions: {
      increment: () => 123,
    },
  };

  actusify(target);

  target.actions.increment();

  expect(target.state).toStrictEqual(123);
});

test("logger", () => {
  logger.mockClear();

  const target = {
    state: 0,
    constructor: { name: "constructor name" },
  };

  actusify(target);

  expect(logger.mock.calls).toHaveLength(1);
  expect(logger.mock.calls[0][0]).toStrictEqual({ name: "constructor name" });
});

test("logger is disabled when not in development mode", () => {
  logger.mockClear();

  const target = { state: 0 };

  actusify(target, { isDevelopment: false });

  expect(logger.mock.calls).toHaveLength(0);
});

test("detects development mode", () => {
  getOwner.mockClear();
  mockResolveRegistration.mockClear();

  const target = { state: 0 };

  actusify(target);

  expect(getOwner.mock.calls).toHaveLength(1);
  expect(getOwner.mock.calls[0][0]).toStrictEqual(target);

  expect(mockResolveRegistration.mock.calls).toHaveLength(1);
  expect(mockResolveRegistration.mock.calls[0][0]).toStrictEqual(
    "config:environment"
  );
});

test("deep freeze", () => {
  const target = { state: { foo: "old" } };

  actusify(target);

  expect(() => {
    // eslint-disable-next-line fp/no-mutation
    target.state.foo = "new";
  }).toThrow("Cannot assign to read only property 'foo' of object '#<Object>'");

  expect(target.state.foo).toStrictEqual("old");
});
