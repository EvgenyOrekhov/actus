import init from "./init.js";

// eslint-disable-next-line max-statements
it("supports plugins", () => {
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
          count: 123
        }
      },
      actions: {
        inc: () => 0,
        nested: {
          count: {
            dec: (ignore, state) => state - 1
          }
        }
      },
      subscribers: [subscriber1]
    },
    {
      state: {
        nested: {
          count: 0
        }
      },
      actions: {
        inc: (ignore, state) => ({
          ...state,
          nested: {
            ...state.nested,
            count: state.nested.count + 1
          }
        }),
        nested: {
          count: {
            triple: (ignore, state) => state * 3
          }
        }
      },
      subscribers: [subscriber2]
    }
  ]);

  actions.inc();
  actions.inc();
  actions.nested.count.dec();
  actions.nested.count.triple();

  expect(subscriber1.mock.calls.length).toStrictEqual(5);
  expect(subscriber1.mock.calls[4][0].state).toStrictEqual({
    foo: "bar",
    baz: "qux",
    nested: {
      bar: "qux",
      qux: "bar",
      count: 3
    }
  });
  expect(subscriber2.mock.calls.length).toStrictEqual(5);
  expect(subscriber2.mock.calls[4][0].state).toStrictEqual({
    foo: "bar",
    baz: "qux",
    nested: {
      bar: "qux",
      qux: "bar",
      count: 3
    }
  });
});
