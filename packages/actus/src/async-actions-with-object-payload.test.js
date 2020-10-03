/* eslint-disable @typescript-eslint/naming-convention */

import actus from "./actus.js";

test("can call actions from async actions with object payload", async () => {
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

  await getUser({ name: "user2", id: 2 });

  expect(subscriber.mock.calls).toHaveLength(4);

  expect(subscriber.mock.calls[1][0].state).toStrictEqual({
    loading: {
      global: true,

      getUser: {
        [JSON.stringify({ name: "user2", id: 2 })]: true,
      },
    },

    users: ["user1"],
    foo: "bar",
  });

  expect(subscriber.mock.calls[2][0].state).toStrictEqual({
    loading: {
      global: true,

      getUser: {
        [JSON.stringify({ name: "user2", id: 2 })]: true,
      },
    },

    users: ["user1", { name: "user2", id: 2 }],
    foo: "bar",
  });

  expect(subscriber.mock.calls[3][0].state).toStrictEqual({
    loading: {
      global: false,
      getUser: false,
    },

    users: ["user1", { name: "user2", id: 2 }],
    foo: "bar",
  });
});

test("handles nested async actions with object payload", async () => {
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

    users: ["user1", { name: "user2", id: 2 }],
    foo: "bar",
  });

  expect(subscriber.mock.calls[3][0].state).toStrictEqual({
    loading: {
      global: false,
      nested: { getUser: false },
    },

    users: ["user1", { name: "user2", id: 2 }],
    foo: "bar",
  });
});
