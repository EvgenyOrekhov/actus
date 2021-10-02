/**
 * @jest-environment jsdom
 */

import persist from "./index.js";

test("loads state from storage", () => {
  expect.assertions(2);

  const { state } = persist({
    storage: {
      getItem(key) {
        expect(key).toBe("state");

        return JSON.stringify({ foo: "bar" });
      },
    },
  });

  expect(state).toStrictEqual({ foo: "bar" });
});

test("loads state from storage with custom key", () => {
  expect.assertions(2);

  const { state } = persist({
    key: "customKey",

    storage: {
      getItem(key) {
        expect(key).toBe("customKey");

        return JSON.stringify({ foo: "bar" });
      },
    },
  });

  expect(state).toStrictEqual({ foo: "bar" });
});

test("tolerates missing state", () => {
  const { state } = persist({
    storage: {
      // eslint-disable-next-line unicorn/no-null
      getItem: () => null,
    },
  });

  expect(state).toBeUndefined();
});

test("tolerates invalid state", () => {
  const { state } = persist({
    storage: {
      getItem: () => "invalid JSON",
    },
  });

  expect(state).toBeUndefined();
});

test("doesn't lose falsy values", () => {
  const { state } = persist({
    storage: {
      getItem: () => 0,
    },
  });

  expect(state).toBe(0);
});

test("saves state to storage", () => {
  expect.assertions(2);

  const storage = {
    setItem(key, value) {
      expect(key).toBe("state");
      expect(JSON.parse(value)).toStrictEqual({ foo: "bar" });
    },
  };

  const [saveStateToStorage] = persist({ storage }).subscribers;

  saveStateToStorage({ state: { foo: "bar" } });
});

test("saves state to storage with custom key", () => {
  expect.assertions(2);

  const storage = {
    setItem(key, value) {
      expect(key).toBe("customKey");
      expect(JSON.parse(value)).toStrictEqual({ foo: "bar" });
    },
  };

  const [saveStateToStorage] = persist({
    key: "customKey",
    storage,
  }).subscribers;

  saveStateToStorage({ state: { foo: "bar" } });
});

test("saves state to storage with custom selector", () => {
  expect.assertions(1);

  const storage = {
    setItem(key, value) {
      expect(JSON.parse(value)).toStrictEqual({ baz: "qux" });
    },
  };

  const [saveStateToStorage] = persist({
    selector: ({ baz }) => ({ baz }),
    storage,
  }).subscribers;

  saveStateToStorage({ state: { foo: "bar", baz: "qux" } });
});

test("doesn't throw when there are no options", () => {
  expect.assertions(0);

  persist();
});
