import makeLogger from "./makeLogger.js";

export default function logger({ name } = {}) {
  return {
    name: "logger",
    subscribers: [makeLogger({ name })],
  };
}
