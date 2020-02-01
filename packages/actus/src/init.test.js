import init from "./init.js";

it("initializes", () => {
  const subscriber1 = jest.fn();
  const subscriber2 = jest.fn();

  init({
    state: 0,
    actions: {
      inc: state => state + 1,
      dec: state => state - 1
    },
    subscribers: [subscriber1, subscriber2]
  });

  expect(subscriber1.mock.calls.length).toBe(1);
  expect(subscriber1.mock.calls[0][0].state).toBe(0);
  expect(subscriber2.mock.calls.length).toBe(1);
  expect(subscriber2.mock.calls[0][0].state).toBe(0);
});

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

  expect(subscriber.mock.calls[1][0].state).toEqual([undefined, 0]);
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

it("passes actions to subscribers", done => {
  const subscriber1 = jest.fn(({ actions }) => {
    setTimeout(actions.inc, 0);
    setTimeout(actions.inc, 0);
    setTimeout(actions.inc, 0);
  });
  const subscriber2 = jest.fn(({ actions }) => {
    setTimeout(actions.dec, 0);
    setTimeout(() => {
      expect(subscriber1.mock.calls.length).toBe(5);
      expect(subscriber1.mock.calls[4][0].state).toBe(2);
      expect(subscriber2.mock.calls.length).toBe(5);
      expect(subscriber2.mock.calls[4][0].state).toBe(2);
      done();
    }, 0);
  });

  init({
    state: 0,
    actions: {
      inc: state => state + 1,
      dec: state => state - 1
    },
    subscribers: [subscriber1, subscriber2]
  });
});

it("passes current action name and value to subscribers", () => {
  const subscriber1 = jest.fn();
  const subscriber2 = jest.fn();
  const subscribers = [subscriber1, subscriber2];

  const { add, subtract } = init({
    state: 0,
    actions: {
      add: (value, state) => state + value,
      subtract: (value, state) => state - value
    },
    subscribers
  });

  add(4);
  subtract(8);

  subscribers.forEach(subscriber => {
    expect(subscriber.mock.calls[1][0].actionName).toBe("add");
    expect(subscriber.mock.calls[1][0].value).toBe(4);
    expect(subscriber.mock.calls[2][0].actionName).toBe("subtract");
    expect(subscriber.mock.calls[2][0].value).toBe(8);
  });
});

it("cancels notifying subscribers if an action was called by one of them", () => {
  const subscriber1 = jest.fn(({ state, actions }) => {
    if (state === 0) {
      actions.inc();
    }
  });
  const subscriber2 = jest.fn();

  init({
    state: 0,
    actions: {
      inc: state => state + 1
    },
    subscribers: [subscriber1, subscriber2]
  });

  expect(subscriber1.mock.calls.length).toBe(2);
  expect(subscriber1.mock.calls[1][0].state).toBe(1);
  expect(subscriber2.mock.calls.length).toBe(1);
  expect(subscriber2.mock.calls[0][0].state).toBe(1);
});
