import makeLogger from "./makeLogger.js";

export default function logger({ name } = {}) {
  return {
    subscribers: makeLogger({ name })
  };
}
