import actus from "./actus.js";

// eslint-disable-next-line max-statements
test("supports plugins", () => {
  const subscriber1 = jest.fn();
  const subscriber2 = jest.fn();

  const actions = actus([
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
            dec: ({ state }) => state - 1,
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
        inc: ({ state }) => ({
          ...state,

          nested: {
            ...state.nested,
            count: state.nested.count + 1,
          },
        }),

        nested: {
          count: {
            triple: ({ state }) => state * 3,
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

  actus([
    {
      state: { foo: "bar" },

      actions: {
        testAction: ({ state }) => state,
      },
    },
    {},
  ]);
});

test("ignores configs that are falsy values", () => {
  expect.assertions(0);

  actus([
    {
      state: { foo: "bar" },

      actions: {
        testAction: ({ state }) => state,
      },

      subscribers: [],
    },
    undefined,
  ]);

  actus([
    {
      state: { foo: "bar" },

      actions: {
        testAction: ({ state }) => state,
      },

      subscribers: [],
    },
    "",
  ]);
});

test("doesn't turn primitive states into objects", () => {
  const subscriber = jest.fn();

  actus([
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

  actus([
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

  actus([
    {
      state: 0,
      subscribers: [subscriber],
    },
    {},
  ]);

  expect(subscriber.mock.calls).toHaveLength(1);
  expect(subscriber.mock.calls[0][0].state).toStrictEqual(0);
});

test("doesn't ignore empty object as state", () => {
  const subscriber = jest.fn();

  actus([
    {},
    {
      state: {},
      subscribers: [subscriber],
    },
  ]);

  expect(subscriber.mock.calls).toHaveLength(1);
  expect(subscriber.mock.calls[0][0].state).toStrictEqual({});
});
