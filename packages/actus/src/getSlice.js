export default function getSlice(object, path) {
  return path.reduce(
    (accumulator, property) =>
      accumulator === undefined || accumulator === null
        ? undefined
        : accumulator[property],
    object
  );
}
