/* eslint-disable @typescript-eslint/naming-convention */

import actus from "./actus.js";

test("can call actions from async actions without payload", async () => {
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

      getUser: async ({ actions }) => {
        await Promise.resolve();
        actions.receiveUser("user2");
      },
    },

    subscribers: [subscriber],
  });

  await getUser();

  expect(subscriber.mock.calls).toHaveLength(4);

  expect(subscriber.mock.calls[1][0].state).toStrictEqual({
    loading: {
      global: true,
      getUser: true,
    },

    users: ["user1"],
    foo: "bar",
  });

  expect(subscriber.mock.calls[2][0].state).toStrictEqual({
    loading: {
      global: true,
      getUser: true,
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

test("can call async actions from async actions without payload", async () => {
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

      concatTwo: async ({ actions }) => {
        await actions.concat("b");
        await actions.concat("c");
      },
    },

    subscribers: [subscriber],
  });

  await concatTwo();

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

test("handles nested async actions without payload", async () => {
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
        getUser: async ({ actions }) => {
          await Promise.resolve();
          actions.receiveUser("user2");
        },
      },
    },

    subscribers: [subscriber],
  });

  await nested.getUser();

  expect(subscriber.mock.calls).toHaveLength(4);

  expect(subscriber.mock.calls[1][0].state).toStrictEqual({
    loading: {
      global: true,
      nested: { getUser: true },
    },

    users: ["user1"],
    foo: "bar",
  });

  expect(subscriber.mock.calls[2][0].state).toStrictEqual({
    loading: {
      global: true,
      nested: { getUser: true },
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

test("handles errors from actions without payload", async () => {
  const subscriber = jest.fn();

  const error = new Error("Mock error");

  const { nested } = actus({
    state: {
      errors: {
        oldError: "old error",
        nested: { getUser: "old getUser error" },
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

  await nested.getUser();

  expect(subscriber.mock.calls).toHaveLength(4);

  expect(subscriber.mock.calls[1][0].state).toStrictEqual({
    loading: {
      global: true,
      nested: { getUser: true },
    },

    errors: {
      oldError: "old error",
      nested: { getUser: undefined },
    },

    users: ["user1"],
    foo: "bar",
  });

  expect(subscriber.mock.calls[2][0].state).toStrictEqual({
    loading: {
      global: true,
      nested: { getUser: true },
    },

    errors: {
      oldError: "old error",
      nested: { getUser: error },
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
      nested: { getUser: error },
    },

    users: ["user1"],
    foo: "bar",
  });
});
