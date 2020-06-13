import init from "./init.js";

test("returns bound actions", () => {
  const subscriber1 = jest.fn();
  const subscriber2 = jest.fn();

  const { inc, dec } = init({
    state: 0,

    actions: {
      inc: (ignore, state) => state + 1,
      dec: (ignore, state) => state - 1,
    },

    subscribers: [subscriber1, subscriber2],
  });

  inc();
  inc();
  dec();

  expect(subscriber1.mock.calls).toHaveLength(4);
  expect(subscriber1.mock.calls[3][0].state).toStrictEqual(1);
  expect(subscriber2.mock.calls).toHaveLength(4);
  expect(subscriber2.mock.calls[3][0].state).toStrictEqual(1);
});

test("passes value to actions", () => {
  const subscriber = jest.fn();

  const { add, subtract } = init({
    state: 0,

    actions: {
      add: (value, state) => state + value,
      subtract: (value, state) => state - value,
    },

    subscribers: [subscriber],
  });

  add(4);
  subtract(8);

  expect(subscriber.mock.calls[2][0].state).toStrictEqual(-4);
});

test("allows to pass undefined to actions", () => {
  const subscriber = jest.fn();

  const { testAction } = init({
    state: 0,

    actions: {
      testAction: (value, state) => [value, state],
    },

    subscribers: [subscriber],
  });

  testAction(undefined);

  expect(subscriber.mock.calls[1][0].state).toStrictEqual([undefined, 0]);
});

test("works with manually curried actions", () => {
  const subscriber = jest.fn();

  const { add, subtract } = init({
    state: 0,

    actions: {
      add: (value) => (state) => state + value,
      subtract: (value) => (state) => state - value,
    },

    subscribers: [subscriber],
  });

  add(4);
  subtract(8);

  expect(subscriber.mock.calls[2][0].state).toStrictEqual(-4);
});

test("doesn't pass value to actions that don't accept it", () => {
  const subscriber1 = jest.fn();

  const { inc } = init({
    state: 0,

    actions: {
      inc: (ignore, state) => state + 1,
    },

    subscribers: [subscriber1],
  });

  inc("foo");

  expect(subscriber1.mock.calls[1][0].state).toStrictEqual(1);
});

test("works with unnecessarily curried actions", () => {
  const subscriber1 = jest.fn();

  const { inc } = init({
    state: 0,

    actions: {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      inc: () => (state) => state + 1,
    },

    subscribers: [subscriber1],
  });

  inc();

  expect(subscriber1.mock.calls[1][0].state).toStrictEqual(1);
});

test("works with actions that ignore state", () => {
  const subscriber1 = jest.fn();

  const { testAction } = init({
    state: 0,

    actions: {
      testAction: (value) => value,
    },

    subscribers: [subscriber1],
  });

  testAction("test");

  expect(subscriber1.mock.calls[1][0].state).toStrictEqual("test");
});

test("works with actions that ignore everything", () => {
  const subscriber1 = jest.fn();

  const { testAction } = init({
    state: 0,

    actions: {
      testAction: () => "test",
    },

    subscribers: [subscriber1],
  });

  testAction();

  expect(subscriber1.mock.calls[1][0].state).toStrictEqual("test");
});
