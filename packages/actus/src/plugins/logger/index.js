import makeLogger from "./makeLogger.js";

export default function logger({
  name,
  isEnabled = process.env.NODE_ENV === "development",
} = {}) {
  if (isEnabled) {
    return {
      name: "logger",
      subscribers: [makeLogger({ name })],
    };
  }

  return { name: "logger" };
}
