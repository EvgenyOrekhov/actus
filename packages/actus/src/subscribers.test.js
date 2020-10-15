import actus from "./actus.js";

test("initializes", () => {
  const subscriber1 = jest.fn();
  const subscriber2 = jest.fn();

  actus({
    state: 0,

    actions: {
      inc: ({ state }) => state + 1,
      dec: ({ state }) => state - 1,
    },

    subscribers: [subscriber1, subscriber2],
  });

  expect(subscriber1.mock.calls).toHaveLength(1);
  expect(subscriber1.mock.calls[0][0].state).toStrictEqual(0);
  expect(subscriber2.mock.calls).toHaveLength(1);
  expect(subscriber2.mock.calls[0][0].state).toStrictEqual(0);
});

/* eslint-disable @typescript-eslint/no-implied-eval */
test("passes actions to subscribers", async () => {
  // eslint-disable-next-line promise/avoid-new
  await new Promise((resolve) => {
    const subscriber1 = jest.fn(({ actions }) => {
      setTimeout(actions.inc, 0);
      setTimeout(actions.inc, 0);
      setTimeout(actions.inc, 0);
    });
    const subscriber2 = jest.fn(({ actions }) => {
      setTimeout(actions.dec, 0);
      setTimeout(() => {
        expect(subscriber1.mock.calls).toHaveLength(5);
        expect(subscriber1.mock.calls[4][0].state).toStrictEqual(2);
        expect(subscriber2.mock.calls).toHaveLength(5);
        expect(subscriber2.mock.calls[4][0].state).toStrictEqual(2);

        resolve();
      }, 0);
    });

    actus({
      state: 0,

      actions: {
        inc: ({ state }) => state + 1,
        dec: ({ state }) => state - 1,
      },

      subscribers: [subscriber1, subscriber2],
    });
  });
});
/* eslint-enable */

test("passes current action name and payload to subscribers", () => {
  const subscriber1 = jest.fn();
  const subscriber2 = jest.fn();
  const subscribers = [subscriber1, subscriber2];

  const { add, subtract } = actus({
    state: 0,

    actions: {
      add: ({ state, payload }) => state + payload,
      subtract: ({ state, payload }) => state - payload,
    },

    subscribers,
  });

  add(4);
  subtract(8);

  subscribers.forEach((subscriber) => {
    expect(subscriber.mock.calls[1][0].actionName).toStrictEqual("add");
    expect(subscriber.mock.calls[1][0].payload).toStrictEqual(4);
    expect(subscriber.mock.calls[2][0].actionName).toStrictEqual("subtract");
    expect(subscriber.mock.calls[2][0].payload).toStrictEqual(8);
  });
});

test("cancels notifying subscribers if an action was called by one of them", () => {
  const subscriber1 = jest.fn(({ state, actions }) => {
    if (state === 0) {
      actions.inc();
    }
  });
  const subscriber2 = jest.fn();

  actus({
    state: 0,

    actions: {
      inc: ({ state }) => state + 1,
    },

    subscribers: [subscriber1, subscriber2],
  });

  expect(subscriber1.mock.calls).toHaveLength(2);
  expect(subscriber1.mock.calls[1][0].state).toStrictEqual(1);
  expect(subscriber2.mock.calls).toHaveLength(1);
  expect(subscriber2.mock.calls[0][0].state).toStrictEqual(1);
});

test("doesn't stop calling subsequent subscribers when one throws", () => {
  expect.assertions(3);

  const expectedError = new Error("Expected error");

  const subscriber1 = jest.fn(() => {
    throw expectedError;
  });
  const subscriber2 = jest.fn();

  try {
    actus({
      state: 0,
      actions: {},
      subscribers: [subscriber1, subscriber2],
    });
  } catch (error) {
    expect(error).toStrictEqual(expectedError);
  }

  expect(subscriber1.mock.calls).toHaveLength(1);
  expect(subscriber2.mock.calls).toHaveLength(1);
});

// eslint-disable-next-line max-statements
test("reports multiple errors", () => {
  expect.assertions(4);

  const expectedError1 = new Error("Expected error 1");
  const expectedError2 = new Error("Expected error 2");

  const subscriber1 = jest.fn(() => {
    throw expectedError1;
  });
  const subscriber2 = jest.fn(() => {
    throw expectedError2;
  });

  try {
    actus({
      state: 0,
      actions: {},
      subscribers: [subscriber1, subscriber2],
    });
  } catch (error) {
    expect(error.message).toMatch("Expected error 1");
    expect(error.message).toMatch("Expected error 2");

    const [actualError1, actualError2] = error;

    expect(actualError1).toStrictEqual(expectedError1);
    expect(actualError2).toStrictEqual(expectedError2);
  }
});
