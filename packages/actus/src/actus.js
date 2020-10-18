import mergeDeepRight from "ramda/src/mergeDeepRight.js";
import isPromise from "is-promise";
import AggregateError from "aggregate-error";

import defaultConfig from "./defaultConfig.js";
import getSlice from "./getSlice.js";
import setSlice from "./setSlice.js";
import freeze from "./plugins/freeze/index.js";
import logger from "./plugins/logger/index.js";
import reduxDevTools from "./plugins/reduxDevTools/index.js";

function isEmptyObject(value) {
  return typeof value === "object" && Object.keys(value).length === 0;
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

  const isLoggerEnabled = configs
    .filter(Boolean)
    .some(({ name }) => name === "logger");

  const isReduxDevToolsEnabled = configs
    .filter(Boolean)
    .some(({ name }) => name === "reduxDevTools");

  const configsWithDefaultConfig = [
    defaultConfig,
    process.env.NODE_ENV === "development" && !isLoggerEnabled && logger(),
    process.env.NODE_ENV === "development" &&
      !isReduxDevToolsEnabled &&
      reduxDevTools(),
    process.env.NODE_ENV !== "production" && freeze(),
    ...configs,
  ];

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

      throw new AggregateError(errors);
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

              if (isPromise(newSlice)) {
                const actionPath =
                  path.length === 0 ? [actionName] : [...path, actionName];

                boundActions.setLoading({ actionPath, actionPayload: payload });

                return newSlice
                  .catch((error) => {
                    boundActions.handleError({
                      error,
                      actionPath,
                      actionPayload: payload,
                    });
                  })
                  .finally(() => {
                    boundActions.unsetLoading({
                      actionPath,
                      actionPayload: payload,
                    });
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
