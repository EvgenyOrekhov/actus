/* eslint-disable @typescript-eslint/naming-convention */

import init from "./init.js";

test("can call actions from async actions", async () => {
  const subscriber = jest.fn();

  const { getUser } = init({
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

test("can call async actions from async actions", async () => {
  const subscriber = jest.fn();

  const { concatTwo } = init({
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

test("handles nested async actions", async () => {
  const subscriber = jest.fn();

  const { nested } = init({
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

test("handles errors", async () => {
  const subscriber = jest.fn();

  const error = new Error("Mock error");

  const { nested } = init({
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

  await nested.getUser("user2");

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
