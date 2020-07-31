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
      receiveUser: (user, state) => ({
        ...state,
        users: [...state.users, user],
      }),

      getUser: async (id, ignore, actions) => {
        await Promise.resolve();
        actions.receiveUser(id);
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
      setString: (string, state) => ({
        ...state,
        string,
      }),

      // eslint-disable-next-line @typescript-eslint/require-await
      concat: async (string, state, actions) => {
        actions.setString(state.string + string);
      },

      concatTwo: async ({ first, second }, state, actions) => {
        await actions.concat(first);
        await actions.concat(second);
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
      receiveUser: (user, state) => ({
        ...state,
        users: [...state.users, user],
      }),

      nested: {
        getUser: async (id, ignore, actions) => {
          await Promise.resolve();
          actions.receiveUser(id);
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
