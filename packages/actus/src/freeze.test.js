/* eslint-disable fp/no-mutation */

import actus from "./actus.js";

test("deep freeze state", () => {
  const state = { foo: { bar: "old" } };

  actus({ state });

  expect(() => {
    state.foo.bar = "new";
  }).toThrow("Cannot assign to read only property 'bar' of object '#<Object>'");

  expect(state.foo.bar).toStrictEqual("old");
});

test("do not deep freeze state when not in development", () => {
  const state = { foo: { bar: "old" } };

  const originalNodeEnvironment = process.env.NODE_ENV;

  process.env.NODE_ENV = "production";

  actus({ state });

  process.env.NODE_ENV = originalNodeEnvironment;

  state.foo.bar = "new";

  expect(state.foo.bar).toStrictEqual("new");
});
