import init from "./init.js";

it("initializes", () => {
  const subscriber1 = jest.fn();
  const subscriber2 = jest.fn();

  init({
    state: 0,
    actions: {
      inc: (ignore, state) => state + 1,
      dec: (ignore, state) => state - 1,
    },
    subscribers: [subscriber1, subscriber2],
  });

  expect(subscriber1.mock.calls.length).toStrictEqual(1);
  expect(subscriber1.mock.calls[0][0].state).toStrictEqual(0);
  expect(subscriber2.mock.calls.length).toStrictEqual(1);
  expect(subscriber2.mock.calls[0][0].state).toStrictEqual(0);
});

it("passes actions to subscribers", (done) => {
  const subscriber1 = jest.fn(({ actions }) => {
    setTimeout(actions.inc, 0);
    setTimeout(actions.inc, 0);
    setTimeout(actions.inc, 0);
  });
  const subscriber2 = jest.fn(({ actions }) => {
    setTimeout(actions.dec, 0);
    setTimeout(() => {
      expect(subscriber1.mock.calls.length).toStrictEqual(5);
      expect(subscriber1.mock.calls[4][0].state).toStrictEqual(2);
      expect(subscriber2.mock.calls.length).toStrictEqual(5);
      expect(subscriber2.mock.calls[4][0].state).toStrictEqual(2);
      done();
    }, 0);
  });

  init({
    state: 0,
    actions: {
      inc: (ignore, state) => state + 1,
      dec: (ignore, state) => state - 1,
    },
    subscribers: [subscriber1, subscriber2],
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
      subtract: (value, state) => state - value,
    },
    subscribers,
  });

  add(4);
  subtract(8);

  subscribers.forEach((subscriber) => {
    expect(subscriber.mock.calls[1][0].actionName).toStrictEqual("add");
    expect(subscriber.mock.calls[1][0].value).toStrictEqual(4);
    expect(subscriber.mock.calls[2][0].actionName).toStrictEqual("subtract");
    expect(subscriber.mock.calls[2][0].value).toStrictEqual(8);
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
      inc: (ignore, state) => state + 1,
    },
    subscribers: [subscriber1, subscriber2],
  });

  expect(subscriber1.mock.calls.length).toStrictEqual(2);
  expect(subscriber1.mock.calls[1][0].state).toStrictEqual(1);
  expect(subscriber2.mock.calls.length).toStrictEqual(1);
  expect(subscriber2.mock.calls[0][0].state).toStrictEqual(1);
});

it("doesn't stop calling subsequent subscribers when one throws", () => {
  expect.assertions(3);

  const expectedError = new Error("Expected error");

  const subscriber1 = jest.fn(() => {
    throw expectedError;
  });
  const subscriber2 = jest.fn();

  try {
    init({
      state: 0,
      actions: {},
      subscribers: [subscriber1, subscriber2],
    });
  } catch (error) {
    expect(error).toStrictEqual(expectedError);
  }

  expect(subscriber1.mock.calls.length).toStrictEqual(1);
  expect(subscriber2.mock.calls.length).toStrictEqual(1);
});

it("reports multiple errors", () => {
  expect.assertions(3);

  const expectedError1 = new Error("Expected error 1");
  const expectedError2 = new Error("Expected error 2");

  const subscriber1 = jest.fn(() => {
    throw expectedError1;
  });
  const subscriber2 = jest.fn(() => {
    throw expectedError2;
  });

  try {
    init({
      state: 0,
      actions: {},
      subscribers: [subscriber1, subscriber2],
    });
  } catch (error) {
    expect(error.message).toStrictEqual(
      "Multiple subscribers threw errors. See `errors` property for details."
    );
    expect(error.errors[0]).toStrictEqual(expectedError1);
    expect(error.errors[1]).toStrictEqual(expectedError2);
  }
});
