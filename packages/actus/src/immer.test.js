/* eslint-disable fp/no-mutation, no-param-reassign */

import actus from "./actus.js";

test("uses immer", () => {
  const initialState = { foo: { bar: "old" } };
  const subscriber1 = jest.fn();

  const { testAction } = actus({
    state: initialState,

    actions: {
      testAction({ state }) {
        state.foo.bar = "new";
      },
    },

    subscribers: [subscriber1],
  });

  testAction();

  expect(initialState).toStrictEqual({ foo: { bar: "old" } });
  expect(subscriber1.mock.calls[1][0].state).toStrictEqual({
    foo: { bar: "new" },
  });
});
