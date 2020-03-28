import localStoragePlugin from "./index.js";

test("loads state from localStorage", () => {
  const { state } = localStoragePlugin({
    storage: { state: JSON.stringify({ foo: "bar" }) },
  });

  expect(state).toStrictEqual({ foo: "bar" });
});

test("loads state from localStorage with custom key", () => {
  const { state } = localStoragePlugin({
    key: "customKey",
    storage: { customKey: JSON.stringify({ foo: "bar" }) },
  });

  expect(state).toStrictEqual({ foo: "bar" });
});

test("tolerates missing/invalid state", () => {
  const { state } = localStoragePlugin({ storage: {} });

  expect(state).toBeUndefined();
});

test("saves state to localStorage", () => {
  const storage = {};
  const [saveStateToLocalStorage] = localStoragePlugin({ storage }).subscribers;

  saveStateToLocalStorage({ state: { foo: "bar" } });

  expect(JSON.parse(storage.state)).toStrictEqual({ foo: "bar" });
});

test("saves state to localStorage with custom key", () => {
  const storage = {};
  const [saveStateToLocalStorage] = localStoragePlugin({
    key: "customKey",
    storage,
  }).subscribers;

  saveStateToLocalStorage({ state: { foo: "bar" } });

  expect(JSON.parse(storage.customKey)).toStrictEqual({ foo: "bar" });
});

test("saves state to localStorage with custom selector", () => {
  const storage = {};
  const [saveStateToLocalStorage] = localStoragePlugin({
    selector: ({ baz }) => ({ baz }),
    storage,
  }).subscribers;

  saveStateToLocalStorage({ state: { foo: "bar", baz: "qux" } });

  expect(JSON.parse(storage.state)).toStrictEqual({ baz: "qux" });
});

test("doesn't throw when there are no options", () => {
  expect.assertions(0);

  localStoragePlugin();
});
