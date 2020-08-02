import deepFreeze from "deep-freeze";

import freeze from "./index.js";

jest.mock("deep-freeze");

test("deep freezes state", () => {
  deepFreeze.mockClear();

  const state = { foo: { bar: "old" } };

  const [freezeState] = freeze().subscribers;

  freezeState({ state });

  expect(deepFreeze.mock.calls).toHaveLength(1);
  expect(deepFreeze.mock.calls[0][0]).toStrictEqual(state);
});

test("doesn't freeze state if it's already frozen", () => {
  deepFreeze.mockClear();

  const state = Object.freeze({ foo: { bar: "old" } });

  const [freezeState] = freeze().subscribers;

  freezeState({ state });

  expect(deepFreeze.mock.calls).toHaveLength(0);
});
