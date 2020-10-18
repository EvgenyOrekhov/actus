import logger from "./index.js";

test("disabled when not in development", () => {
  const plugin = logger();

  expect(plugin).toStrictEqual({ name: "logger" });
});
