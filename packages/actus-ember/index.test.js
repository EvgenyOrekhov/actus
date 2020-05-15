import logger from "actus-logger";

import actusify from "./index.js";

jest.mock("actus-logger");

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

test("deep freeze state", () => {
  const target = { state: { foo: "old" } };

  actusify(target);

  expect(() => {
    // eslint-disable-next-line fp/no-mutation
    target.state.foo = "new";
  }).toThrow("Cannot assign to read only property 'foo' of object '#<Object>'");

  expect(target.state.foo).toStrictEqual("old");
});

test("do not deep freeze state when not in development", () => {
  const target = { state: { foo: "old" } };

  actusify(target, { isDevelopment: false });

  // eslint-disable-next-line fp/no-mutation
  target.state.foo = "new";

  expect(target.state.foo).toStrictEqual("new");
});

test("supports plugins", () => {
  const target = {
    state: 0,
    actions: {
      inc: (ignore, state) => state + 1,
    },
  };

  const subscriber1 = jest.fn();
  const subscriber2 = jest.fn();

  actusify(target, {
    plugins: [
      {
        subscribers: [subscriber1],
      },
      {
        subscribers: [subscriber2],
      },
    ],
  });

  target.actions.inc();

  expect(subscriber1.mock.calls).toHaveLength(2);
  expect(subscriber1.mock.calls[1][0].state).toStrictEqual(1);
  expect(subscriber2.mock.calls).toHaveLength(2);
  expect(subscriber2.mock.calls[1][0].state).toStrictEqual(1);
});

test("supports overriding plugins' data", () => {
  const target = { state: 0 };

  actusify(target, { plugins: [{ state: 1 }] });

  expect(target.state).toStrictEqual(0);
});
