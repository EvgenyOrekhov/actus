import persist from "./index.js";

test("loads state from storage", () => {
  const { state } = persist({
    storage: { state: JSON.stringify({ foo: "bar" }) },
  });

  expect(state).toStrictEqual({ foo: "bar" });
});

test("loads state from storage with custom key", () => {
  const { state } = persist({
    key: "customKey",
    storage: { customKey: JSON.stringify({ foo: "bar" }) },
  });

  expect(state).toStrictEqual({ foo: "bar" });
});

test("tolerates missing/invalid state", () => {
  const { state } = persist({ storage: {} });

  expect(state).toBeUndefined();
});

test("saves state to storage", () => {
  const storage = {};
  const [saveStateToStorage] = persist({ storage }).subscribers;

  saveStateToStorage({ state: { foo: "bar" } });

  expect(JSON.parse(storage.state)).toStrictEqual({ foo: "bar" });
});

test("saves state to storage with custom key", () => {
  const storage = {};
  const [saveStateToStorage] = persist({
    key: "customKey",
    storage,
  }).subscribers;

  saveStateToStorage({ state: { foo: "bar" } });

  expect(JSON.parse(storage.customKey)).toStrictEqual({ foo: "bar" });
});

test("saves state to storage with custom selector", () => {
  const storage = {};
  const [saveStateToStorage] = persist({
    selector: ({ baz }) => ({ baz }),
    storage,
  }).subscribers;

  saveStateToStorage({ state: { foo: "bar", baz: "qux" } });

  expect(JSON.parse(storage.state)).toStrictEqual({ baz: "qux" });
});

test("doesn't throw when there are no options", () => {
  expect.assertions(0);

  persist();
});
