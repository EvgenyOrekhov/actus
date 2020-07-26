"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = actusify;

var _actus = require("actus");

var _actusLogger = _interopRequireDefault(require("actus-logger"));

var _actusFreeze = _interopRequireDefault(require("actus-freeze"));

var _actusDefaultActions = _interopRequireDefault(require("actus-default-actions"));

var _isPlainObj = _interopRequireDefault(require("is-plain-obj"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function actusify(config, {
  isDevelopment = true
} = {}) {
  const plugins = Array.isArray(config) ? config : [config];
  const enabledPlugins = plugins.filter(Boolean);
  const target = enabledPlugins.find(plugin => !(0, _isPlainObj.default)(plugin));
  const normalizedPlugins = enabledPlugins.map(plugin => plugin === target ? {
    state: target.state,
    actions: target.actions,
    subscribers: [function setState({
      state
    }) {
      // eslint-disable-next-line fp/no-mutation
      target.state = state;
    }]
  } : plugin); // eslint-disable-next-line fp/no-mutation

  target.actions = (0, _actus.init)([...(isDevelopment ? [(0, _actusLogger.default)({
    name: target.constructor.name
  }), (0, _actusFreeze.default)()] : []), (0, _actusDefaultActions.default)(target.state), ...normalizedPlugins]);
}