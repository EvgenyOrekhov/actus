import actus from "./actus.js";

test("returns bound actions", () => {
  const subscriber1 = jest.fn();
  const subscriber2 = jest.fn();

  const { inc, dec } = actus({
    state: 0,

    actions: {
      inc: ({ state }) => state + 1,
      dec: ({ state }) => state - 1,
    },

    subscribers: [subscriber1, subscriber2],
  });

  inc();
  inc();
  dec();

  expect(subscriber1.mock.calls).toHaveLength(4);
  expect(subscriber1.mock.calls[3][0].state).toBe(1);
  expect(subscriber2.mock.calls).toHaveLength(4);
  expect(subscriber2.mock.calls[3][0].state).toBe(1);
});

test("passes payload to actions", () => {
  const subscriber = jest.fn();

  const { add, subtract } = actus({
    state: 0,

    actions: {
      add: ({ state, payload }) => state + payload,
      subtract: ({ state, payload }) => state - payload,
    },

    subscribers: [subscriber],
  });

  add(4);
  subtract(8);

  expect(subscriber.mock.calls[2][0].state).toStrictEqual(-4);
});

test("allows to pass undefined to actions", () => {
  const subscriber = jest.fn();

  const { testAction } = actus({
    state: 0,

    actions: {
      testAction: ({ state, payload }) => ({ state, payload }),
    },

    subscribers: [subscriber],
  });

  testAction(undefined);

  expect(subscriber.mock.calls[1][0].state).toStrictEqual({
    state: 0,
    payload: undefined,
  });
});
