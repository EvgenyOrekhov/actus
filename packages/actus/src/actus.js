/* eslint-disable promise/prefer-await-to-then */

import isPromise from "is-promise";
// eslint-disable-next-line no-shadow -- aggregate-error is needed for Node.js <15.0.0
import AggregateError from "aggregate-error";

import mergeConfigs from "./mergeConfigs.js";
import getSlice from "./getSlice.js";
import setSlice from "./setSlice.js";

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

    if (errors.length > 0) {
      if (errors.length === 1) {
        throw errors[0];
      }

      throw new AggregateError(
        errors,
        "Multiple errors were thrown during notifying subscribers."
      );
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  function bindActions(unboundActions, path = []) {
    return Object.fromEntries(
      Object.entries(unboundActions).map(function bindAction([
        actionName,
        actionWithNextStateGetterAndProduce,
      ]) {
        if (Array.isArray(actionWithNextStateGetterAndProduce)) {
          const [action, getNextState, produce] =
            actionWithNextStateGetterAndProduce;

          return [
            actionName,
            function boundAction(payload) {
              const currentSlice = getSlice(currentState, path);

              const newSlice = produce
                ? produce(currentSlice, (draft) =>
                    action({
                      state: draft,
                      payload,
                      actions: boundActions,
                    })
                  )
                : action({
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

              return undefined;
            },
          ];
        }

        return [
          actionName,
          bindActions(actionWithNextStateGetterAndProduce, [
            ...path,
            actionName,
          ]),
        ];
      })
    );
  }

  // eslint-disable-next-line fp/no-mutation
  boundActions = bindActions(actions);

  notifySubscribers();

  return boundActions;
}
