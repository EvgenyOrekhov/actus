import init from "./init.js";

// eslint-disable-next-line max-statements
test("supports plugins", () => {
  const subscriber1 = jest.fn();
  const subscriber2 = jest.fn();

  const actions = init([
    {
      state: {
        foo: "bar",
        baz: "qux",
        nested: {
          bar: "qux",
          qux: "bar",
          count: 123,
        },
      },
      actions: {
        inc: () => 0,
        nested: {
          count: {
            dec: (ignore, state) => state - 1,
          },
        },
      },
      subscribers: [subscriber1],
    },
    {
      state: {
        nested: {
          count: 0,
        },
      },
      actions: {
        inc: (ignore, state) => ({
          ...state,
          nested: {
            ...state.nested,
            count: state.nested.count + 1,
          },
        }),
        nested: {
          count: {
            triple: (ignore, state) => state * 3,
          },
        },
      },
      subscribers: [subscriber2],
    },
  ]);

  actions.inc();
  actions.inc();
  actions.nested.count.dec();
  actions.nested.count.triple();

  expect(subscriber1.mock.calls).toHaveLength(5);
  expect(subscriber1.mock.calls[4][0].state).toStrictEqual({
    foo: "bar",
    baz: "qux",
    nested: {
      bar: "qux",
      qux: "bar",
      count: 3,
    },
  });
  expect(subscriber2.mock.calls).toHaveLength(5);
  expect(subscriber2.mock.calls[4][0].state).toStrictEqual({
    foo: "bar",
    baz: "qux",
    nested: {
      bar: "qux",
      qux: "bar",
      count: 3,
    },
  });
});

test("doesn't throw when something is missing", () => {
  expect.assertions(0);

  init([
    {
      state: { foo: "bar" },
      actions: {
        testAction: (value, state) => state,
      },
    },
    {},
  ]);
});

test("ignores configs that are falsy values", () => {
  expect.assertions(0);

  init([
    {
      state: { foo: "bar" },
      actions: {
        testAction: (value, state) => state,
      },
      subscribers: [],
    },
    undefined,
  ]);

  init([
    {
      state: { foo: "bar" },
      actions: {
        testAction: (value, state) => state,
      },
      subscribers: [],
    },
    "",
  ]);
});

test("doesn't turn primitive states into objects", () => {
  const subscriber = jest.fn();

  init([
    {
      state: 1,
      subscribers: [subscriber],
    },
    {
      state: 0,
    },
  ]);

  expect(subscriber.mock.calls).toHaveLength(1);
  expect(subscriber.mock.calls[0][0].state).toStrictEqual(0);
});

test("doesn't merge empty objects", () => {
  const subscriber = jest.fn();

  init([
    {
      state: 1,
      subscribers: [subscriber],
    },
    {
      state: {},
    },
  ]);

  expect(subscriber.mock.calls).toHaveLength(1);
  expect(subscriber.mock.calls[0][0].state).toStrictEqual(1);
});

test("ignores undefined states", () => {
  const subscriber = jest.fn();

  init([
    {
      state: 0,
      subscribers: [subscriber],
    },
    {},
  ]);

  expect(subscriber.mock.calls).toHaveLength(1);
  expect(subscriber.mock.calls[0][0].state).toStrictEqual(0);
});
