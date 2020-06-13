import init from "./init.js";

test("supports slice actions", () => {
  const subscriber = jest.fn();

  const { slice1, slice2 } = init({
    state: { slice1: 0, slice2: 0 },

    actions: {
      slice1: {
        inc: (ignore, state) => state + 1,
      },

      slice2: {
        add: (value, state) => state + value,
        subtract: (value) => (state) => state - value,
      },
    },

    subscribers: [subscriber],
  });

  slice1.inc();
  slice2.add(4);
  slice2.subtract(8);

  expect(subscriber.mock.calls).toHaveLength(4);
  expect(subscriber.mock.calls[1][0].state).toStrictEqual({
    slice1: 1,
    slice2: 0,
  });
  expect(subscriber.mock.calls[2][0].state).toStrictEqual({
    slice1: 1,
    slice2: 4,
  });
  expect(subscriber.mock.calls[3][0].state).toStrictEqual({
    slice1: 1,
    slice2: -4,
  });
});

test("supports recursive slice actions", () => {
  const subscriber = jest.fn();

  const { slice } = init({
    state: {
      slice: {
        subslice1: 0,
        subslice2: 0,
      },
    },

    actions: {
      slice: {
        subslice1: {
          inc: (ignore, state) => state + 1,
        },

        subslice2: {
          add: (value, state) => state + value,
          subtract: (value) => (state) => state - value,
        },
      },
    },

    subscribers: [subscriber],
  });

  slice.subslice1.inc();
  slice.subslice2.add(4);
  slice.subslice2.subtract(8);

  expect(subscriber.mock.calls).toHaveLength(4);
  expect(subscriber.mock.calls[1][0].state).toStrictEqual({
    slice: {
      subslice1: 1,
      subslice2: 0,
    },
  });
  expect(subscriber.mock.calls[2][0].state).toStrictEqual({
    slice: {
      subslice1: 1,
      subslice2: 4,
    },
  });
  expect(subscriber.mock.calls[3][0].state).toStrictEqual({
    slice: {
      subslice1: 1,
      subslice2: -4,
    },
  });
});

test("doesn't fail when data slices are missing", () => {
  const subscriber = jest.fn();

  const { slice } = init({
    state: 0,

    actions: {
      slice: {
        testUndefined: (ignore, state) => state,
      },
    },

    subscribers: [subscriber],
  });

  slice.testUndefined();

  expect(subscriber.mock.calls).toHaveLength(2);
  expect(subscriber.mock.calls[1][0].state).toStrictEqual({ slice: undefined });
});

test("doesn't fail with null", () => {
  const subscriber = jest.fn();

  const { slice } = init({
    // eslint-disable-next-line unicorn/no-null
    state: null,

    actions: {
      slice: {
        testUndefined: (ignore, state) => state,
      },
    },

    subscribers: [subscriber],
  });

  slice.testUndefined();

  expect(subscriber.mock.calls).toHaveLength(2);
  expect(subscriber.mock.calls[1][0].state).toStrictEqual({ slice: undefined });
});

test("passes current slice action name to subscribers", () => {
  const subscriber = jest.fn();

  const { slice } = init({
    state: {},

    actions: {
      slice: {
        subslice: {
          testAction: (ignore, state) => state,
        },
      },
    },

    subscribers: [subscriber],
  });

  slice.subslice.testAction();

  expect(subscriber.mock.calls[1][0].actionName).toStrictEqual([
    "slice",
    "subslice",
    "testAction",
  ]);
});
