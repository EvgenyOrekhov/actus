/* eslint-disable @typescript-eslint/naming-convention */

import actus from "./actus.js";

test("can call actions from async actions with payload", async () => {
  const subscriber = jest.fn();

  const { getUser } = actus({
    state: {
      users: ["user1"],
      foo: "bar",
    },

    actions: {
      receiveUser: ({ state, payload }) => ({
        ...state,
        users: [...state.users, payload],
      }),

      getUser: async ({ payload, actions }) => {
        await Promise.resolve();
        actions.receiveUser(payload);
      },
    },

    subscribers: [subscriber],
  });

  await getUser("user2");

  expect(subscriber.mock.calls).toHaveLength(4);

  expect(subscriber.mock.calls[1][0].state).toStrictEqual({
    loading: {
      global: true,

      getUser: {
        user2: true,
      },
    },

    users: ["user1"],
    foo: "bar",
  });

  expect(subscriber.mock.calls[2][0].state).toStrictEqual({
    loading: {
      global: true,

      getUser: {
        user2: true,
      },
    },

    users: ["user1", "user2"],
    foo: "bar",
  });

  expect(subscriber.mock.calls[3][0].state).toStrictEqual({
    loading: {
      global: false,
      getUser: false,
    },

    users: ["user1", "user2"],
    foo: "bar",
  });
});

test("can call async actions from async actions with payload", async () => {
  const subscriber = jest.fn();

  const { concatTwo } = actus({
    state: {
      loading: { alwaysLoading: true },
      string: "a",
      foo: "bar",
    },

    actions: {
      setString: ({ state, payload }) => ({
        ...state,
        string: payload,
      }),

      // eslint-disable-next-line @typescript-eslint/require-await
      concat: async ({ state, payload, actions }) => {
        actions.setString(state.string + payload);
      },

      concatTwo: async ({ payload, actions }) => {
        await actions.concat(payload.first);
        await actions.concat(payload.second);
      },
    },

    subscribers: [subscriber],
  });

  await concatTwo({ first: "b", second: "c" });

  expect(
    subscriber.mock.calls[subscriber.mock.calls.length - 1][0].state
  ).toStrictEqual({
    loading: {
      global: true,
      alwaysLoading: true,
      concat: false,
      concatTwo: false,
    },

    string: "abc",
    foo: "bar",
  });
});

test("handles nested async actions with payload", async () => {
  const subscriber = jest.fn();

  const { nested } = actus({
    state: {
      users: ["user1"],
      foo: "bar",
    },

    actions: {
      receiveUser: ({ state, payload }) => ({
        ...state,
        users: [...state.users, payload],
      }),

      nested: {
        getUser: async ({ payload, actions }) => {
          await Promise.resolve();
          actions.receiveUser(payload);
        },
      },
    },

    subscribers: [subscriber],
  });

  await nested.getUser("user2");

  expect(subscriber.mock.calls).toHaveLength(4);

  expect(subscriber.mock.calls[1][0].state).toStrictEqual({
    loading: {
      global: true,

      nested: {
        getUser: {
          user2: true,
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
          user2: true,
        },
      },
    },

    users: ["user1", "user2"],
    foo: "bar",
  });

  expect(subscriber.mock.calls[3][0].state).toStrictEqual({
    loading: {
      global: false,
      nested: { getUser: false },
    },

    users: ["user1", "user2"],
    foo: "bar",
  });
});

test("preserves existing loading states", async () => {
  const subscriber = jest.fn();

  const { nested } = actus({
    state: {
      users: ["user1"],
      foo: "bar",

      loading: {
        global: true,

        nested: {
          getUser: {
            user1: true,
          },
        },
      },
    },

    actions: {
      receiveUser: ({ state, payload }) => ({
        ...state,
        users: [...state.users, payload],
      }),

      nested: {
        getUser: async ({ payload, actions }) => {
          await Promise.resolve();
          actions.receiveUser(payload);
        },
      },
    },

    subscribers: [subscriber],
  });

  await nested.getUser("user2");

  expect(subscriber.mock.calls).toHaveLength(4);

  expect(subscriber.mock.calls[1][0].state).toStrictEqual({
    loading: {
      global: true,

      nested: {
        getUser: {
          user1: true,
          user2: true,
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
          user1: true,
          user2: true,
        },
      },
    },

    users: ["user1", "user2"],
    foo: "bar",
  });

  expect(subscriber.mock.calls[3][0].state).toStrictEqual({
    loading: {
      global: true,

      nested: {
        getUser: {
          user1: true,
          user2: false,
        },
      },
    },

    users: ["user1", "user2"],
    foo: "bar",
  });
});
