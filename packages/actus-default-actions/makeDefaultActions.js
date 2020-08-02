import mergeDeepLeft from "ramda/src/mergeDeepLeft.js";

export default function makeDefaultActions(initialState) {
  const defaultActions = {
    number: {
      set: ({ payload }) => Number(payload),
      reset: () => initialState,
      increment: ({ state }) => state + 1,
      decrement: ({ state }) => state - 1,
    },

    boolean: {
      set: ({ payload }) => Boolean(payload),
      reset: () => initialState,
      on: () => true,
      off: () => false,
      toggle: ({ state }) => !state,
    },

    string: {
      set: ({ payload }) => String(payload),
      reset: () => initialState,
      clear: () => "",
      concat: ({ state, payload }) => state + payload,
    },

    object: {
      set: ({ payload }) => payload,
      reset: () => initialState,
      clear: () => ({}),
      merge: ({ state, payload }) => ({ ...state, ...payload }),
      mergeDeep: ({ state, payload }) => mergeDeepLeft(payload, state),

      remove: ({ state, payload: propertyName }) => {
        const { [propertyName]: ignore, ...rest } = state;

        return rest;
      },
    },

    array: {
      set: ({ payload }) => payload,
      reset: () => initialState,
      clear: () => [],
      append: ({ state, payload }) => [...state, payload],
      prepend: ({ state, payload }) => [payload, ...state],
      concat: ({ state, payload }) => [...state, ...payload],
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
