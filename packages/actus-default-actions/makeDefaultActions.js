import mergeDeepLeft from "ramda/src/mergeDeepLeft.js";

export default function makeDefaultActions(initialState) {
  const defaultActions = {
    number: {
      set: Number,
      reset: () => initialState,
      increment: (ignore, state) => state + 1,
      decrement: (ignore, state) => state - 1,
    },

    boolean: {
      set: Boolean,
      reset: () => initialState,
      on: () => true,
      off: () => false,
      toggle: (ignore, state) => !state,
    },

    string: {
      set: String,
      reset: () => initialState,
      clear: () => "",
      concat: (value, state) => value + state,
    },

    object: {
      set: (value) => value,
      reset: () => initialState,
      clear: () => ({}),
      merge: (value, state) => ({ ...state, ...value }),
      mergeDeep: mergeDeepLeft,
      remove: (propertyName, state) => {
        const { [propertyName]: ignore, ...rest } = state;

        return rest;
      },
    },

    array: {
      set: (value) => value,
      reset: () => initialState,
      clear: () => [],
      append: (value, state) => [...state, value],
      prepend: (value, state) => [value, ...state],
      concat: (value, state) => [...state, ...value],
    },
  };

  if (initialState === null) {
    return {};
  }

  const type = Array.isArray(initialState) ? "array" : typeof initialState;

  if (defaultActions[type] === undefined) {
    return {};
  }

  return type === "object"
    ? {
        ...defaultActions[type],
        ...Object.fromEntries(
          Object.entries(initialState)
            .map(([key, value]) => [key, makeDefaultActions(value)])
            .filter(([, value]) => Object.keys(value).length !== 0)
        ),
      }
    : defaultActions[type];
}
