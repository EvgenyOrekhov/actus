import makeDefaultActions from "./makeDefaultActions.js";

it("number", () => {
  const { set, increment, decrement } = makeDefaultActions(0);

  expect(set(1, 0)).toStrictEqual(1);
  expect(set("1", 0)).toStrictEqual(1);
  expect(increment(undefined, 0)).toStrictEqual(1);
  expect(increment(undefined, 15)).toStrictEqual(16);
  expect(decrement(undefined, 0)).toStrictEqual(-1);
  expect(decrement(undefined, 16)).toStrictEqual(15);
});

it("number - reset()", () => {
  const { reset } = makeDefaultActions(4);

  expect(reset(0)).toStrictEqual(4);
});

it("boolean", () => {
  const { on, off, toggle } = makeDefaultActions(false);

  expect(on(false)).toStrictEqual(true);
  expect(on(true)).toStrictEqual(true);
  expect(off(false)).toStrictEqual(false);
  expect(off(true)).toStrictEqual(false);
  expect(toggle(undefined, false)).toStrictEqual(true);
  expect(toggle(undefined, true)).toStrictEqual(false);
});

it("boolean - set()", () => {
  const { set } = makeDefaultActions(false);

  expect(set(true, false)).toStrictEqual(true);
  expect(set(true, true)).toStrictEqual(true);
  expect(set(false, false)).toStrictEqual(false);
  expect(set(false, true)).toStrictEqual(false);
  expect(set(undefined, true)).toStrictEqual(false);
});

it("boolean - reset() - false", () => {
  const { reset } = makeDefaultActions(false);

  expect(reset(false)).toStrictEqual(false);
  expect(reset(true)).toStrictEqual(false);
});

it("boolean - reset() - true", () => {
  const { reset } = makeDefaultActions(true);

  expect(reset(false)).toStrictEqual(true);
  expect(reset(true)).toStrictEqual(true);
});

it("string", () => {
  const { set, reset, clear, concat } = makeDefaultActions("foo");

  expect(set("bar", "baz")).toStrictEqual("bar");
  expect(set(123, "baz")).toStrictEqual("123");
  expect(reset("bar")).toStrictEqual("foo");
  expect(clear("bar")).toStrictEqual("");
  expect(concat("bar", "baz")).toStrictEqual("barbaz");
});

it("object", () => {
  const { set, reset, clear, merge, mergeDeep, remove } = makeDefaultActions({
    foo: "bar",
    baz: "qux",
  });

  expect(
    set({ abc: "def", uvw: "xyz" }, { foo: "bar", baz: "qux" })
  ).toStrictEqual({ abc: "def", uvw: "xyz" });
  expect(reset({ abc: "def", uvw: "xyz" })).toStrictEqual({
    foo: "bar",
    baz: "qux",
  });
  expect(clear({ foo: "bar", baz: "qux" })).toStrictEqual({});
  expect(
    merge({ abc: "def", uvw: "xyz", foo: "baz" }, { foo: "bar", baz: "qux" })
  ).toStrictEqual({ abc: "def", uvw: "xyz", foo: "baz", baz: "qux" });
  expect(
    mergeDeep(
      {
        abc: "def",
        uvw: "xyz",
        foo: "baz",
        nested: {
          abc: "def",
          uvw: "xyz",
          foo: "baz",
        },
      },
      {
        foo: "bar",
        baz: "qux",
        nested: {
          foo: "bar",
          baz: "qux",
        },
      }
    )
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
  expect(remove("foo", { foo: "bar", baz: "qux" })).toStrictEqual({
    baz: "qux",
  });
});

it("array", () => {
  const { set, reset, clear, append, prepend, concat } = makeDefaultActions([
    4,
    8,
    15,
    16,
  ]);

  expect(set([23, 42], [4, 8, 15, 16])).toStrictEqual([23, 42]);
  expect(reset([23, 42])).toStrictEqual([4, 8, 15, 16]);
  expect(clear([4, 8, 15, 16])).toStrictEqual([]);
  expect(append([23, 42], [4, 8, 15, 16])).toStrictEqual([
    4,
    8,
    15,
    16,
    [23, 42],
  ]);
  expect(prepend([23, 42], [4, 8, 15, 16])).toStrictEqual([
    [23, 42],
    4,
    8,
    15,
    16,
  ]);
  expect(concat([23, 42], [4, 8, 15, 16])).toStrictEqual([
    4,
    8,
    15,
    16,
    23,
    42,
  ]);
});

it("null", () => {
  expect(makeDefaultActions(null)).toStrictEqual({});
});

it("undefined", () => {
  expect(makeDefaultActions(undefined)).toStrictEqual({});
});

it("recurses", () => {
  const actions = makeDefaultActions({
    name: "",
    count: 0,
  });

  expect(typeof actions.name.concat).toStrictEqual("function");
  expect(typeof actions.count.increment).toStrictEqual("function");
});

it("tolerates null", () => {
  const actions = makeDefaultActions({ foo: { bar: null } });

  expect(actions.foo).not.toHaveProperty("bar");
});
