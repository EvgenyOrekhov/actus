import init from "./init.js";

test("can call actions from async actions", () => {
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

      // eslint-disable-next-line @typescript-eslint/require-await
      getUser: async (id, ignore, actions) => {
        actions.receiveUser(id);
      },
    },

    subscribers: [subscriber],
  });

  getUser("user2");

  expect(subscriber.mock.calls).toHaveLength(2);
  expect(subscriber.mock.calls[1][0].state).toStrictEqual({
    users: ["user1", "user2"],
    foo: "bar",
  });
});

test("can call async actions from async actions", async () => {
  const subscriber = jest.fn();

  const { concatTwo } = init({
    state: {
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

  expect(subscriber.mock.calls).toHaveLength(3);
  expect(subscriber.mock.calls[2][0].state).toStrictEqual({
    string: "abc",
    foo: "bar",
  });
});
