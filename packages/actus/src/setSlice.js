import assocPath from "ramda/src/assocPath.js";

export default function setSlice(object, path, slice) {
  return assocPath(path, slice, object);
}
