export default function makeDefaultActions(initialState) {
  const defaultActions = {
    number: {
      set: (value, ignore) => value,
      reset: () => initialState,
      increment: state => state + 1,
      decrement: state => state - 1
    },
    boolean: {
      set: (value, ignore) => value,
      reset: () => initialState,
      on: () => true,
      off: () => false,
      toggle: state => !state
    },
    string: {
      set: (value, ignore) => value,
      reset: () => initialState,
      clear: () => "",
      concat: (value, state) => value + state
    },
    object: {
      set: (value, ignore) => value,
      reset: () => initialState,
      clear: () => ({}),
      merge: (value, state) => ({ ...state, ...value }),
      del: (propertyName, state) => {
        // eslint-disable-next-line fp/no-rest-parameters
        const { [propertyName]: ignore, ...rest } = state;

        return rest;
      }
    },
    array: {
      set: (value, ignore) => value,
      reset: () => initialState,
      clear: () => [],
      append: (value, state) => [...state, value],
      prepend: (value, state) => [value, ...state]
    }
  };

  const type = Array.isArray(initialState) ? "array" : typeof initialState;

  return defaultActions[type];
}
