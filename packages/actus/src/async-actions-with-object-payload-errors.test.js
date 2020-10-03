/* eslint-disable @typescript-eslint/naming-convention */

import actus from "./actus.js";

test("handles errors from actions with payload", async () => {
  const subscriber = jest.fn();

  const error = new Error("Mock error");

  const { nested } = actus({
    state: {
      errors: {
        oldError: "old error",

        nested: {
          getUser: {
            user1: "old user1 error",
            [JSON.stringify({ name: "user2", id: 2 })]: "old user2 error",
          },
        },
      },

      users: ["user1"],
      foo: "bar",
    },

    actions: {
      receiveUser: ({ state, payload }) => ({
        ...state,
        users: [...state.users, payload],
      }),

      nested: {
        getUser: async () => {
          await Promise.resolve();

          throw error;
        },
      },
    },

    subscribers: [subscriber],
  });

  await nested.getUser({ name: "user2", id: 2 });

  expect(subscriber.mock.calls).toHaveLength(4);

  expect(subscriber.mock.calls[1][0].state).toStrictEqual({
    loading: {
      global: true,

      nested: {
        getUser: {
          [JSON.stringify({ name: "user2", id: 2 })]: true,
        },
      },
    },

    errors: {
      oldError: "old error",

      nested: {
        getUser: {
          user1: "old user1 error",
          [JSON.stringify({ name: "user2", id: 2 })]: undefined,
        },
      },
    },

    users: ["user1"],
    foo: "bar",
  });

  expect(subscriber.mock.calls[2][0].state).toStrictEqual({
    loading: {
      global: true,

      nested: {
        getUser: {
          [JSON.stringify({ name: "user2", id: 2 })]: true,
        },
      },
    },

    errors: {
      oldError: "old error",

      nested: {
        getUser: {
          user1: "old user1 error",
          [JSON.stringify({ name: "user2", id: 2 })]: error,
        },
      },
    },

    users: ["user1"],
    foo: "bar",
  });

  expect(subscriber.mock.calls[3][0].state).toStrictEqual({
    loading: {
      global: false,
      nested: { getUser: false },
    },

    errors: {
      oldError: "old error",

      nested: {
        getUser: {
          user1: "old user1 error",
          [JSON.stringify({ name: "user2", id: 2 })]: error,
        },
      },
    },

    users: ["user1"],
    foo: "bar",
  });
});
