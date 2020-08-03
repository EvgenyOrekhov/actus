import assocPath from "ramda/src/assocPath.js";
import mergeDeepRight from "ramda/src/mergeDeepRight.js";

function isEmptyObject(value) {
  return typeof value === "object" && Object.keys(value).length === 0;
}

function getSlice(object, path) {
  return path.reduce(
    (accumulator, property) =>
      accumulator === undefined || accumulator === null
        ? undefined
        : accumulator[property],
    object
  );
}

function setSlice(object, path, slice) {
  return assocPath(path, slice, object);
}

function mergeStates(left, right) {
  if (typeof left === "object" && typeof right === "object") {
    return mergeDeepRight(left, right);
  }

  return left !== undefined && (right === undefined || isEmptyObject(right))
    ? left
    : right;
}

function getActionsWithNextStateGetter(
  actions = {},
  getNextState = (previousState, actionResult) => actionResult
) {
  return Object.fromEntries(
    Object.entries(actions).map(([actionName, action]) => [
      actionName,
      typeof action === "function"
        ? [action, getNextState]
        : getActionsWithNextStateGetter(action, getNextState),
    ])
  );
}

function getGlobalLoading(loading) {
  return Object.values(loading).some((value) =>
    typeof value === "boolean" ? value : getGlobalLoading(value)
  );
}

const defaultConfig = {
  actions: {
    setLoading: ({ state, payload: actionPath }) => ({
      ...state,

      loading: setSlice(
        {
          ...state.loading,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          global: true,
        },
        actionPath,
        true
      ),

      ...(getSlice(state.errors, actionPath) === undefined
        ? {}
        : { errors: setSlice(state.errors, actionPath, undefined) }),
    }),

    unsetLoading: ({ state, payload: actionPath }) => {
      const loading = setSlice(
        {
          ...state.loading,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          global: false,
        },
        actionPath,
        false
      );

      return {
        ...state,

        loading: {
          ...loading,
          global: getGlobalLoading(loading),
        },
      };
    },

    handleError: ({ state, payload }) => ({
      ...state,
      errors: setSlice(state.errors, payload.actionPath, payload.error),
    }),
  },
};

function mergeConfigs(config) {
  const configs = Array.isArray(config) ? config : [config];
  const configsWithDefaultConfig = [defaultConfig, ...configs];

  return configsWithDefaultConfig.filter(Boolean).reduce(
    function mergeConfig(accumulator, currentConfig) {
      return {
        state: mergeStates(accumulator.state, currentConfig.state),

        actions: mergeDeepRight(
          accumulator.actions,
          getActionsWithNextStateGetter(
            currentConfig.actions,
            currentConfig.getNextState
          ) || {}
        ),

        subscribers: [
          ...(accumulator.subscribers || []),
          ...(currentConfig.subscribers || []),
        ],
      };
    },
    { state: {}, actions: {}, subscribers: [] }
  );
}

export default function actus(config) {
  const { state, actions, subscribers } = mergeConfigs(config);

  // eslint-disable-next-line fp/no-let
  let currentState = state;
  // eslint-disable-next-line fp/no-let, init-declarations
  let shouldNotifySubscribers;
  // eslint-disable-next-line fp/no-let, init-declarations, prefer-const
  let boundActions;

  function notifySubscribers({ actionName, payload } = {}) {
    // eslint-disable-next-line fp/no-mutation
    shouldNotifySubscribers = true;

    // eslint-disable-next-line fp/no-let
    let errors = [];

    subscribers.every(function notifySubscriber(subscriber) {
      try {
        subscriber({
          state: currentState,
          actions: boundActions,
          actionName,
          payload,
        });
      } catch (error) {
        // eslint-disable-next-line fp/no-mutation
        errors = [...errors, error];
      }

      return shouldNotifySubscribers;
    });

    // eslint-disable-next-line fp/no-mutation
    shouldNotifySubscribers = false;

    if (errors.length !== 0) {
      if (errors.length === 1) {
        throw errors[0];
      }

      const error = new Error(
        "Multiple subscribers threw errors. See `errors` property for details."
      );

      // eslint-disable-next-line fp/no-mutation
      error.errors = errors;

      throw error;
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  function bindActions(unboundActions, path = []) {
    return Object.fromEntries(
      Object.entries(unboundActions).map(function bindAction([
        actionName,
        actionWithNextStateGetter,
      ]) {
        if (Array.isArray(actionWithNextStateGetter)) {
          const [action, getNextState] = actionWithNextStateGetter;

          return [
            actionName,
            function boundAction(payload) {
              const currentSlice = getSlice(currentState, path);

              const newSlice = action({
                state: currentSlice,
                payload,
                actions: boundActions,
              });

              if (newSlice && typeof newSlice.then === "function") {
                const actionPath =
                  path.length === 0 ? [actionName] : [...path, actionName];

                boundActions.setLoading(actionPath);

                return newSlice
                  .catch((error) => {
                    boundActions.handleError({ error, actionPath });
                  })
                  .finally(() => {
                    boundActions.unsetLoading(actionPath);
                  });
              }

              const nextState = getNextState(currentSlice, newSlice);

              // eslint-disable-next-line fp/no-mutation
              currentState = setSlice(currentState, path, nextState);

              notifySubscribers({
                actionName:
                  path.length === 0 ? actionName : [...path, actionName],

                payload,
              });
            },
          ];
        }

        return [
          actionName,
          bindActions(actionWithNextStateGetter, [...path, actionName]),
        ];
      })
    );
  }

  // eslint-disable-next-line fp/no-mutation
  boundActions = bindActions(actions);

  notifySubscribers();

  return boundActions;
}
