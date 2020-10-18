/* eslint-disable fp/no-mutation */

import actus from "./actus.js";
import reduxDevTools from "./plugins/reduxDevTools/index.js";

jest.mock("./plugins/logger/index.js");
jest.mock("./plugins/reduxDevTools/index.js");

test("enables reduxDevTools in development", () => {
  reduxDevTools.mockClear();

  const originalNodeEnvironment = process.env.NODE_ENV;

  process.env.NODE_ENV = "development";

  actus({});

  process.env.NODE_ENV = originalNodeEnvironment;

  expect(reduxDevTools.mock.calls).toHaveLength(1);
});

test("reduxDevTools is disabled when not in development mode", () => {
  reduxDevTools.mockClear();

  actus({});

  expect(reduxDevTools.mock.calls).toHaveLength(0);
});

test("does not enable reduxDevTools if already enabled", () => {
  reduxDevTools.mockClear();

  reduxDevTools.mockReturnValue({ name: "reduxDevTools" });

  const originalNodeEnvironment = process.env.NODE_ENV;

  process.env.NODE_ENV = "development";

  actus([{}, reduxDevTools()]);

  process.env.NODE_ENV = originalNodeEnvironment;

  expect(reduxDevTools.mock.calls).toHaveLength(1);
});
