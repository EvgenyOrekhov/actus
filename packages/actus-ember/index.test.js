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
  logger.mockReset();

  const target = {
    state: 0,
    constructor: { name: "constructor name" },
  };

  actusify(target);

  target.actions.increment();

  expect(logger.mock.calls).toHaveLength(1);
  expect(logger.mock.calls[0][0]).toStrictEqual({ name: "constructor name" });
});

test("logger is disabled when not in development mode", () => {
  logger.mockReset();

  const target = {
    state: 0,
  };

  actusify(target, { isDevelopment: false });

  target.actions.increment();

  expect(logger.mock.calls).toHaveLength(0);
});
