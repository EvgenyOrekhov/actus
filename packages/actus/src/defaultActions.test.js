/* eslint-disable fp/no-let, fp/no-mutation */

import actus from "./actus.js";

test("default actions", () => {
  let state = 0;

  const { increment } = actus({
    state: 0,

    subscribers: [
      ({ state: nextState }) => {
        state = nextState;
      },
    ],
  });

  increment();

  expect(state).toBe(1);
});

test("default actions can be overridden", () => {
  let state = 0;

  const { increment } = actus({
    state: 0,

    actions: {
      increment: () => 123,
    },

    subscribers: [
      ({ state: nextState }) => {
        state = nextState;
      },
    ],
  });

  increment();

  expect(state).toBe(123);
});

test("does not enable default actions if already enabled", () => {
  const { increment } = actus([{ name: "defaultActions" }, { state: 0 }]);

  expect(increment).toBeUndefined();
});
