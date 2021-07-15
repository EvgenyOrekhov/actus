/* eslint-disable fp/no-mutation, no-param-reassign */

// eslint-disable-next-line import/no-named-as-default -- recommended way to import produce
import produce from "immer";

import actus from "./actus.js";

test("uses Immer's produce() if provided", () => {
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

    produce,
  });

  testAction();

  expect(initialState).toStrictEqual({ foo: { bar: "old" } });
  expect(subscriber1.mock.calls[1][0].state).toStrictEqual({
    foo: { bar: "new" },
  });
});

test("desn't use Immer's produce() if not provided", () => {
  const subscriber1 = jest.fn();

  const { testAction } = actus([
    {
      state: { foo: { bar: "old" } },

      actions: {
        testAction({ state }) {
          state.foo.bar = "new";
        },
      },

      subscribers: [subscriber1],
    },
    { produce },
  ]);

  expect(testAction).toThrow(
    "Cannot assign to read only property 'bar' of object '#<Object>'"
  );
});
