/* eslint-disable @typescript-eslint/naming-convention */

import makeDefaultActions from "./makeDefaultActions.js";

function* iterator() {
  yield 23;
  yield 42;
}

test("number", () => {
  const { set, increment, decrement } = makeDefaultActions(0);

  expect(set({ state: 0, payload: 1 })).toStrictEqual(1);
  expect(set({ state: 0, payload: "1" })).toStrictEqual(1);
  expect(increment({ state: 0 })).toStrictEqual(1);
  expect(increment({ state: 15 })).toStrictEqual(16);
  expect(decrement({ state: 0 })).toStrictEqual(-1);
  expect(decrement({ state: 16 })).toStrictEqual(15);
});

test("number - reset()", () => {
  const { reset } = makeDefaultActions(4);

  expect(reset()).toStrictEqual(4);
});

test("boolean", () => {
  const { on, off, toggle } = makeDefaultActions(false);

  expect(on()).toStrictEqual(true);
  expect(off()).toStrictEqual(false);
  expect(toggle({ state: false })).toStrictEqual(true);
  expect(toggle({ state: true })).toStrictEqual(false);
});

test("boolean - set()", () => {
  const { set } = makeDefaultActions(false);

  expect(set({ state: false, payload: true })).toStrictEqual(true);
  expect(set({ state: true, payload: true })).toStrictEqual(true);
  expect(set({ state: false, payload: false })).toStrictEqual(false);
  expect(set({ state: true, payload: false })).toStrictEqual(false);
  expect(set({ state: true })).toStrictEqual(false);
});

test("boolean - reset() - false", () => {
  const { reset } = makeDefaultActions(false);

  expect(reset()).toStrictEqual(false);
});

test("boolean - reset() - true", () => {
  const { reset } = makeDefaultActions(true);

  expect(reset()).toStrictEqual(true);
});

test("string", () => {
  const { set, reset, clear, concat } = makeDefaultActions("foo");

  expect(set({ state: "baz", payload: "bar" })).toStrictEqual("bar");
  expect(set({ state: "baz", payload: 123 })).toStrictEqual("123");
  expect(reset()).toStrictEqual("foo");
  expect(clear()).toStrictEqual("");
  expect(concat({ state: "baz", payload: "bar" })).toStrictEqual("bazbar");
});

test("string - set() - undefined and null", () => {
  const { concat } = makeDefaultActions("foo");

  expect(concat({ state: "baz", payload: undefined })).toStrictEqual("baz");

  // eslint-disable-next-line unicorn/no-null
  expect(concat({ state: "baz", payload: null })).toStrictEqual("baz");

  expect(concat({ state: "baz", payload: false })).toStrictEqual("bazfalse");
});

test("string - concat() - undefined and null", () => {
  const { set } = makeDefaultActions("foo");

  expect(set({ state: "baz", payload: undefined })).toStrictEqual("");

  // eslint-disable-next-line unicorn/no-null
  expect(set({ state: "baz", payload: null })).toStrictEqual("");

  expect(set({ state: "baz", payload: false })).toStrictEqual("false");
});

test("object", () => {
  const { set, reset, clear, merge, mergeDeep, remove } = makeDefaultActions({
    foo: "bar",
    baz: "qux",
  });

  expect(
    set({
      state: { foo: "bar", baz: "qux" },
      payload: { abc: "def", uvw: "xyz" },
    })
  ).toStrictEqual({ abc: "def", uvw: "xyz" });
  expect(reset()).toStrictEqual({
    foo: "bar",
    baz: "qux",
  });
  expect(clear()).toStrictEqual({});
  expect(
    merge({
      state: { foo: "bar", baz: "qux" },
      payload: { abc: "def", uvw: "xyz", foo: "baz" },
    })
  ).toStrictEqual({ abc: "def", uvw: "xyz", foo: "baz", baz: "qux" });
  expect(
    mergeDeep({
      state: {
        foo: "bar",
        baz: "qux",

        nested: {
          foo: "bar",
          baz: "qux",
        },
      },

      payload: {
        abc: "def",
        uvw: "xyz",
        foo: "baz",

        nested: {
          abc: "def",
          uvw: "xyz",
          foo: "baz",
        },
      },
    })
  ).toStrictEqual({
    abc: "def",
    uvw: "xyz",
    foo: "baz",
    baz: "qux",

    nested: {
      abc: "def",
      uvw: "xyz",
      foo: "baz",
      baz: "qux",
    },
  });
  expect(
    remove({ state: { foo: "bar", baz: "qux" }, payload: "foo" })
  ).toStrictEqual({
    baz: "qux",
  });
});

test("array", () => {
  const { set, reset, clear, append, prepend, concat } = makeDefaultActions([
    4,
    8,
    15,
    16,
  ]);

  expect(set({ state: [4, 8, 15, 16], payload: [23, 42] })).toStrictEqual([
    23,
    42,
  ]);
  expect(reset()).toStrictEqual([4, 8, 15, 16]);
  expect(clear()).toStrictEqual([]);
  expect(append({ state: [4, 8, 15, 16], payload: [23, 42] })).toStrictEqual([
    4,
    8,
    15,
    16,
    [23, 42],
  ]);
  expect(prepend({ state: [4, 8, 15, 16], payload: [23, 42] })).toStrictEqual([
    [23, 42],
    4,
    8,
    15,
    16,
  ]);
  expect(concat({ state: [4, 8, 15, 16], payload: [23, 42] })).toStrictEqual([
    4,
    8,
    15,
    16,
    23,
    42,
  ]);
});

test("array - set() - falsy values", () => {
  const { set } = makeDefaultActions([4, 8, 15, 16]);

  expect(set({ state: [4, 8, 15, 16], payload: undefined })).toStrictEqual([]);

  // eslint-disable-next-line unicorn/no-null
  expect(set({ state: [4, 8, 15, 16], payload: null })).toStrictEqual([]);

  expect(set({ state: [4, 8, 15, 16], payload: false })).toStrictEqual([]);
  expect(set({ state: [4, 8, 15, 16], payload: 0 })).toStrictEqual([]);
  expect(set({ state: [4, 8, 15, 16], payload: Number.NaN })).toStrictEqual([]);
});

test("array - set() - array-like", () => {
  const { set } = makeDefaultActions([4, 8, 15, 16]);

  expect(set({ state: [4, 8, 15, 16], payload: iterator() })).toStrictEqual([
    23,
    42,
  ]);
});

test("array - concat() - falsy values", () => {
  const { concat } = makeDefaultActions([4, 8, 15, 16]);

  expect(concat({ state: [4, 8, 15, 16], payload: undefined })).toStrictEqual([
    4,
    8,
    15,
    16,
  ]);

  // eslint-disable-next-line unicorn/no-null
  expect(concat({ state: [4, 8, 15, 16], payload: null })).toStrictEqual([
    4,
    8,
    15,
    16,
  ]);

  expect(concat({ state: [4, 8, 15, 16], payload: false })).toStrictEqual([
    4,
    8,
    15,
    16,
  ]);
  expect(concat({ state: [4, 8, 15, 16], payload: 0 })).toStrictEqual([
    4,
    8,
    15,
    16,
  ]);
  expect(concat({ state: [4, 8, 15, 16], payload: Number.NaN })).toStrictEqual([
    4,
    8,
    15,
    16,
  ]);
});

test("array - concat() - array-like", () => {
  const { concat } = makeDefaultActions([4, 8, 15, 16]);

  expect(concat({ state: [4, 8, 15, 16], payload: iterator() })).toStrictEqual([
    4,
    8,
    15,
    16,
    23,
    42,
  ]);
});

test("null", () => {
  // eslint-disable-next-line unicorn/no-null
  expect(makeDefaultActions(null)).toStrictEqual({});
});

test("undefined", () => {
  expect(makeDefaultActions(undefined)).toStrictEqual({});
});

test("recurses", () => {
  const actions = makeDefaultActions({
    name: "",
    count: 0,
  });

  expect(typeof actions.name.concat).toStrictEqual("function");
  expect(typeof actions.count.increment).toStrictEqual("function");
});

test("tolerates null", () => {
  // eslint-disable-next-line unicorn/no-null
  const actions = makeDefaultActions({ foo: { bar: null } });

  expect(actions.foo).not.toHaveProperty("bar");
});
