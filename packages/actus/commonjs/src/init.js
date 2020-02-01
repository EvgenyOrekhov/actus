"use strict";

require("core-js/modules/es.object.from-entries");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;
const ACTION_ARITY = 2;

function init({
  state,
  actions,
  subscribers
}) {
  // eslint-disable-next-line fp/no-let
  let currentState = state; // eslint-disable-next-line fp/no-let, init-declarations

  let shouldNotifySubscribers; // eslint-disable-next-line fp/no-let, init-declarations, prefer-const

  let boundActions;

  function notifySubscribers({
    actionName,
    value
  } = {}) {
    // eslint-disable-next-line fp/no-mutation
    shouldNotifySubscribers = true;
    subscribers.every(subscriber => {
      subscriber({
        state: currentState,
        actions: boundActions,
        actionName,
        value
      });
      return shouldNotifySubscribers;
    }); // eslint-disable-next-line fp/no-mutation

    shouldNotifySubscribers = false;
  } // eslint-disable-next-line fp/no-mutation


  boundActions = Object.fromEntries(Object.entries(actions).map(([actionName, action]) => [actionName, function boundAction(value) {
    function getNewState() {
      if (action.length === ACTION_ARITY) {
        return action(value, currentState);
      }

      const partiallyAppliedActionOrNewState = action(currentState);
      return typeof partiallyAppliedActionOrNewState === "function" ? // Turns out we have a curried action here.
      // Reapplying arguments in the correct order:
      action(value)(currentState) : partiallyAppliedActionOrNewState;
    } // eslint-disable-next-line fp/no-mutation


    currentState = getNewState();
    notifySubscribers({
      actionName,
      value
    });
  }]));
  notifySubscribers();
  return boundActions;
}