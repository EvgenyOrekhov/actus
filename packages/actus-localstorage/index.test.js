import localStoragePlugin from "./index.js";

it("loads state from localStorage", () => {
  const { state } = localStoragePlugin({
    storage: { state: JSON.stringify({ foo: "bar" }) },
  });

  expect(state).toStrictEqual({ foo: "bar" });
});

it("loads state from localStorage with custom key", () => {
  const { state } = localStoragePlugin({
    key: "customKey",
    storage: { customKey: JSON.stringify({ foo: "bar" }) },
  });

  expect(state).toStrictEqual({ foo: "bar" });
});

it("tolerates missing/invalid state", () => {
  const { state } = localStoragePlugin({ storage: {} });

  expect(state).toStrictEqual(undefined);
});

it("saves state to localStorage", () => {
  const storage = {};
  const [saveStateToLocalStorage] = localStoragePlugin({ storage }).subscribers;

  saveStateToLocalStorage({ state: { foo: "bar" } });

  expect(JSON.parse(storage.state)).toStrictEqual({ foo: "bar" });
});

it("saves state to localStorage with custom key", () => {
  const storage = {};
  const [saveStateToLocalStorage] = localStoragePlugin({
    key: "customKey",
    storage,
  }).subscribers;

  saveStateToLocalStorage({ state: { foo: "bar" } });

  expect(JSON.parse(storage.customKey)).toStrictEqual({ foo: "bar" });
});

it("saves state to localStorage with custom selector", () => {
  const storage = {};
  const [saveStateToLocalStorage] = localStoragePlugin({
    selector: ({ baz }) => ({ baz }),
    storage,
  }).subscribers;

  saveStateToLocalStorage({ state: { foo: "bar", baz: "qux" } });

  expect(JSON.parse(storage.state)).toStrictEqual({ baz: "qux" });
});

it("doesn't throw when there are no options", () => {
  localStoragePlugin();
});
