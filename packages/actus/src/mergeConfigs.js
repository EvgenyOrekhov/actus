import mergeDeepRight from "ramda/src/mergeDeepRight.js";

import defaultConfig from "./defaultConfig.js";
import freeze from "./plugins/freeze/index.js";
import logger from "./plugins/logger/index.js";
import reduxDevTools from "./plugins/reduxDevTools/index.js";
import defaultActions from "./plugins/defaultActions/index.js";

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

export default function mergeConfigs(config) {
  const configs = Array.isArray(config) ? config : [config];

  const isLoggerEnabled = configs
    .filter(Boolean)
    .some(({ name }) => name === "logger");

  const isReduxDevToolsEnabled = configs
    .filter(Boolean)
    .some(({ name }) => name === "reduxDevTools");

  const isDefaultActionsEnabled = configs
    .filter(Boolean)
    .some(({ name }) => name === "defaultActions");

  const initialState = configs
    .filter(Boolean)
    .map(({ state }) => state)
    .reduce(mergeStates);

  const configsWithDefaultPlugins = [
    defaultConfig,
    !isLoggerEnabled && logger(),
    !isReduxDevToolsEnabled && reduxDevTools(),
    !isDefaultActionsEnabled && defaultActions(initialState),
    freeze(),
    ...configs,
  ];

  return configsWithDefaultPlugins.filter(Boolean).reduce(
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