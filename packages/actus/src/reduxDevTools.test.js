import actus from "./actus.js";
import reduxDevTools from "./plugins/reduxDevTools/index.js";

jest.mock("./plugins/logger/index.js");
jest.mock("./plugins/reduxDevTools/index.js");

test("enables reduxDevTools", () => {
  reduxDevTools.mockClear();

  actus({});

  expect(reduxDevTools.mock.calls).toHaveLength(1);
});

test("does not enable reduxDevTools if already enabled", () => {
  reduxDevTools.mockClear();
  reduxDevTools.mockReturnValue({ name: "reduxDevTools" });

  actus([{}, reduxDevTools()]);

  expect(reduxDevTools.mock.calls).toHaveLength(1);
});
