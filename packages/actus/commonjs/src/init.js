"use strict";

require("core-js/modules/es.object.from-entries");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _assocPath = _interopRequireDefault(require("ramda/src/assocPath.js"));

var _mergeDeepRight = _interopRequireDefault(require("ramda/src/mergeDeepRight.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_ACTION_ARITY = 2;

function getSlice(object, path) {
  return path.reduce((acc, property) => acc === undefined || acc === null ? undefined : acc[property], object);
}

function setSlice(object, path, slice) {
  return (0, _assocPath.default)(path, slice, object);
}

function mergeConfigs(config) {
  const configs = Array.isArray(config) ? config : [config];
  return configs.reduce((acc, currentConfig) => {
    const state = currentConfig.state === undefined ? acc.state : currentConfig.state;
    return {
      state: typeof acc.state === "object" && typeof currentConfig.state === "object" ? (0, _mergeDeepRight.default)(acc.state, currentConfig.state) : state,
      actions: (0, _mergeDeepRight.default)(acc.actions, currentConfig.actions),
      subscribers: [...(acc.subscribers || []), ...(currentConfig.subscribers || [])]
    };
  });
}

function init(config) {
  const {
    state,
    actions,
    subscribers
  } = mergeConfigs(config); // eslint-disable-next-line fp/no-let

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
  } // eslint-disable-next-line sonarjs/cognitive-complexity


  function bindActions(unboundActions, path = []) {
    return Object.fromEntries(Object.entries(unboundActions).map(([actionName, action]) => typeof action === "function" ? [actionName, function boundAction(value) {
      function getNewState() {
        const currentSlice = getSlice(currentState, path);

        if (action.length === DEFAULT_ACTION_ARITY) {
          const newSlice = action(value, currentSlice);
          return setSlice(currentState, path, newSlice);
        }

        const partiallyAppliedActionOrNewSlice = action(value);
        const newSlice = typeof partiallyAppliedActionOrNewSlice === "function" ? // Turns out we have a curried action here:
        partiallyAppliedActionOrNewSlice(currentSlice) : partiallyAppliedActionOrNewSlice;
        return setSlice(currentState, path, newSlice);
      } // eslint-disable-next-line fp/no-mutation


      currentState = getNewState();
      notifySubscribers({
        actionName: path.length === 0 ? actionName : [...path, actionName],
        value
      });
    }] : [actionName, bindActions(action, [...path, actionName])]));
  } // eslint-disable-next-line fp/no-mutation


  boundActions = bindActions(actions);
  notifySubscribers();
  return boundActions;
}