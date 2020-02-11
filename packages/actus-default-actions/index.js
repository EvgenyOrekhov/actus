export default function makeDefaultActions(initialState) {
  const defaultActions = {
    number: {
      set: value => value,
      reset: () => initialState,
      increment: (ignore, state) => state + 1,
      decrement: (ignore, state) => state - 1
    },
    boolean: {
      set: value => value,
      reset: () => initialState,
      on: () => true,
      off: () => false,
      toggle: (ignore, state) => !state
    },
    string: {
      set: value => value,
      reset: () => initialState,
      clear: () => "",
      concat: (value, state) => value + state
    },
    object: {
      set: value => value,
      reset: () => initialState,
      clear: () => ({}),
      merge: (value, state) => ({ ...state, ...value }),
      remove: (propertyName, state) => {
        // eslint-disable-next-line fp/no-rest-parameters
        const { [propertyName]: ignore, ...rest } = state;

        return rest;
      }
    },
    array: {
      set: value => value,
      reset: () => initialState,
      clear: () => [],
      append: (value, state) => [...state, value],
      prepend: (value, state) => [value, ...state]
    }
  };

  const type = Array.isArray(initialState) ? "array" : typeof initialState;

  return defaultActions[type];
}
