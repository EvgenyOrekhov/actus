import init from "./init.js";

it("returns bound actions", () => {
  const subscriber1 = jest.fn();
  const subscriber2 = jest.fn();

  const { inc, dec } = init({
    state: 0,
    actions: {
      inc: state => state + 1,
      dec: state => state - 1
    },
    subscribers: [subscriber1, subscriber2]
  });

  inc();
  inc();
  dec();

  expect(subscriber1.mock.calls.length).toBe(4);
  expect(subscriber1.mock.calls[3][0].state).toBe(1);
  expect(subscriber2.mock.calls.length).toBe(4);
  expect(subscriber2.mock.calls[3][0].state).toBe(1);
});

it("passes value to actions", () => {
  const subscriber = jest.fn();

  const { add, subtract } = init({
    state: 0,
    actions: {
      add: (value, state) => state + value,
      subtract: (value, state) => state - value
    },
    subscribers: [subscriber]
  });

  add(4);
  subtract(8);

  expect(subscriber.mock.calls[2][0].state).toBe(-4);
});

it("allows to pass undefined to actions", () => {
  const subscriber = jest.fn();

  const { testAction } = init({
    state: 0,
    actions: {
      testAction: (value, state) => [value, state]
    },
    subscribers: [subscriber]
  });

  testAction(undefined);

  expect(subscriber.mock.calls[1][0].state).toStrictEqual([undefined, 0]);
});

it("works with manually curried actions", () => {
  const subscriber = jest.fn();

  const { add, subtract } = init({
    state: 0,
    actions: {
      add: value => state => state + value,
      subtract: value => state => state - value
    },
    subscribers: [subscriber]
  });

  add(4);
  subtract(8);

  expect(subscriber.mock.calls[2][0].state).toBe(-4);
});

it("doesn't pass value to actions that don't accept it", () => {
  const subscriber1 = jest.fn();

  const { inc } = init({
    state: 0,
    actions: {
      inc: state => state + 1
    },
    subscribers: [subscriber1]
  });

  inc("foo");

  expect(subscriber1.mock.calls[1][0].state).toBe(1);
});

it("works with unnecessarily curried actions", () => {
  const subscriber1 = jest.fn();

  const { inc } = init({
    state: 0,
    actions: {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      inc: () => state => state + 1
    },
    subscribers: [subscriber1]
  });

  inc();

  expect(subscriber1.mock.calls[1][0].state).toBe(1);
});
