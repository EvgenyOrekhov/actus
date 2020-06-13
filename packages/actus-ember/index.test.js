import logger from "actus-logger";

import actusify from "./index.js";

jest.mock("actus-logger");

// eslint-disable-next-line fp/no-class
class EmberObjectMock {
  constructor(properties) {
    // eslint-disable-next-line fp/no-this, fp/no-mutating-assign
    Object.assign(this, properties);
  }
}

test("actusify()", () => {
  const target = new EmberObjectMock({
    state: 0,

    actions: {
      inc: (ignore, state) => state + 1,
    },
  });

  actusify(target);

  target.actions.inc();

  expect(target.state).toStrictEqual(1);
});

test("default actions", () => {
  const target = new EmberObjectMock({
    state: 0,
  });

  actusify(target);

  target.actions.increment();

  expect(target.state).toStrictEqual(1);
});

test("default actions can be overridden", () => {
  const target = new EmberObjectMock({
    state: 0,

    actions: {
      increment: () => 123,
    },
  });

  actusify(target);

  target.actions.increment();

  expect(target.state).toStrictEqual(123);
});

test("logger", () => {
  logger.mockClear();

  const target = new EmberObjectMock({
    state: 0,
    constructor: { name: "constructor name" },
  });

  actusify(target);

  expect(logger.mock.calls).toHaveLength(1);
  expect(logger.mock.calls[0][0]).toStrictEqual({ name: "constructor name" });
});

test("logger is disabled when not in development mode", () => {
  logger.mockClear();

  const target = new EmberObjectMock({ state: 0 });

  actusify(target, { isDevelopment: false });

  expect(logger.mock.calls).toHaveLength(0);
});

test("deep freeze state", () => {
  const target = new EmberObjectMock({ state: { foo: "old" } });

  actusify(target);

  expect(() => {
    // eslint-disable-next-line fp/no-mutation
    target.state.foo = "new";
  }).toThrow("Cannot assign to read only property 'foo' of object '#<Object>'");

  expect(target.state.foo).toStrictEqual("old");
});

test("do not deep freeze state when not in development", () => {
  const target = new EmberObjectMock({ state: { foo: "old" } });

  actusify(target, { isDevelopment: false });

  // eslint-disable-next-line fp/no-mutation
  target.state.foo = "new";

  expect(target.state.foo).toStrictEqual("new");
});

test("supports plugins", () => {
  const target = new EmberObjectMock({
    state: 0,

    actions: {
      inc: (ignore, state) => state + 1,
    },
  });

  const subscriber1 = jest.fn();
  const subscriber2 = jest.fn();

  actusify([
    {
      state: 1,
      subscribers: [subscriber1],
    },
    target,
    {
      state: 2,
      subscribers: [subscriber2],
    },
  ]);

  target.actions.inc();

  expect(subscriber1.mock.calls).toHaveLength(2);
  expect(subscriber1.mock.calls[1][0].state).toStrictEqual(3);
  expect(subscriber2.mock.calls).toHaveLength(2);
  expect(subscriber2.mock.calls[1][0].state).toStrictEqual(3);
});

test("ignores disabled (falsy) plugins", () => {
  expect.assertions(0);

  const target = new EmberObjectMock({ state: 0 });

  actusify([
    undefined,
    // eslint-disable-next-line unicorn/no-null
    null,
    false,
    target,
  ]);
});
