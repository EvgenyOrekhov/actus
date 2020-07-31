import init from "./init.js";

test("returns bound actions", () => {
  const subscriber = jest.fn();

  const { getUser } = init({
    state: {
      users: ["old user"],
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

  getUser("new user");

  expect(subscriber.mock.calls).toHaveLength(2);
  expect(subscriber.mock.calls[1][0].state).toStrictEqual({
    users: ["old user", "new user"],
    foo: "bar",
  });
});
