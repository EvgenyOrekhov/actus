import init from "./init.js";

test("getNextState - default action arity", () => {
  const subscriber = jest.fn();

  const { testAction } = init({
    state: "state",

    actions: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      testAction: (value, state) => "action result",
    },

    getNextState: (state, actionResult) => ({ state, actionResult }),

    subscribers: [subscriber],
  });

  testAction();

  expect(subscriber.mock.calls[1][0].state).toStrictEqual({
    state: "state",
    actionResult: "action result",
  });
});

test("getNextState", () => {
  const subscriber = jest.fn();

  const { testAction } = init({
    state: "state",

    actions: {
      testAction: () => "action result",
    },

    getNextState: (state, actionResult) => ({ state, actionResult }),

    subscribers: [subscriber],
  });

  testAction();

  expect(subscriber.mock.calls[1][0].state).toStrictEqual({
    state: "state",
    actionResult: "action result",
  });
});

test("getNextState - multiple plugins", () => {
  const subscriber = jest.fn();

  const { testAction } = init([
    { state: "state" },
    {
      actions: {
        testAction: () => "action result",
      },

      getNextState: (state, actionResult) => ({ state, actionResult }),

      subscribers: [subscriber],
    },
  ]);

  testAction();

  expect(subscriber.mock.calls[1][0].state).toStrictEqual({
    state: "state",
    actionResult: "action result",
  });
});

test("getNextState should have effect only on current plugin", () => {
  const subscriber = jest.fn();

  const { regularAction } = init([
    {
      actions: {
        regularAction: () => "regular action result",
      },
    },
    {
      state: "state",

      actions: {
        specialAction: () => "special action result",
      },

      getNextState: (state, actionResult) => ({ state, actionResult }),

      subscribers: [subscriber],
    },
  ]);

  regularAction();

  expect(subscriber.mock.calls[1][0].state).toStrictEqual(
    "regular action result"
  );
});
