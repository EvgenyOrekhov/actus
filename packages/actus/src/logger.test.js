/* eslint-disable fp/no-mutation */

import actus from "./actus.js";
import logger from "./plugins/logger/index.js";

jest.mock("./plugins/logger/index.js");

test("enables logger in development", () => {
  logger.mockClear();

  const originalNodeEnvironment = process.env.NODE_ENV;

  process.env.NODE_ENV = "development";

  actus({});

  process.env.NODE_ENV = originalNodeEnvironment;

  expect(logger.mock.calls).toHaveLength(1);
});

test("logger is disabled when not in development mode", () => {
  logger.mockClear();

  actus({});

  expect(logger.mock.calls).toHaveLength(0);
});

test("does not enable logger if already enabled", () => {
  logger.mockClear();

  logger.mockReturnValue({ name: "logger" });

  const originalNodeEnvironment = process.env.NODE_ENV;

  process.env.NODE_ENV = "development";

  actus([{}, logger()]);

  process.env.NODE_ENV = originalNodeEnvironment;

  expect(logger.mock.calls).toHaveLength(1);
});
