import assocPath from "ramda/src/assocPath.js";
import mergeDeepRight from "ramda/src/mergeDeepRight.js";

const DEFAULT_ACTION_ARITY = 2;

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

function mergeConfigs(config) {
  const configs = Array.isArray(config) ? config : [config];

  return configs.filter(Boolean).reduce(
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

export default function init(config) {
  const { state, actions, subscribers } = mergeConfigs(config);

  // eslint-disable-next-line fp/no-let
  let currentState = state;
  // eslint-disable-next-line fp/no-let, init-declarations
  let shouldNotifySubscribers;
  // eslint-disable-next-line fp/no-let, init-declarations, prefer-const
  let boundActions;

  function notifySubscribers({ actionName, value } = {}) {
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
          value,
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
            function boundAction(value) {
              const currentSlice = getSlice(currentState, path);

              function getNewSlice() {
                if (action.length >= DEFAULT_ACTION_ARITY) {
                  return action(value, currentSlice, boundActions);
                }

                const partiallyAppliedActionOrNewSlice = action(value);

                return typeof partiallyAppliedActionOrNewSlice === "function"
                  ? // Turns out we have a curried action here:
                    partiallyAppliedActionOrNewSlice(currentSlice)
                  : partiallyAppliedActionOrNewSlice;
              }

              const newSlice = getNewSlice();

              if (typeof newSlice?.then === "function") {
                return;
              }

              const nextState = getNextState(currentSlice, newSlice);

              // eslint-disable-next-line fp/no-mutation
              currentState = setSlice(currentState, path, nextState);

              notifySubscribers({
                actionName:
                  path.length === 0 ? actionName : [...path, actionName],

                value,
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
