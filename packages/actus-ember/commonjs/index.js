"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = actusify;

var _actus = require("actus");

var _actusLogger = _interopRequireDefault(require("actus-logger"));

var _actusDefaultActions = _interopRequireDefault(require("actus-default-actions"));

var _deepFreeze = _interopRequireDefault(require("deep-freeze"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function actusify(target, {
  isDevelopment = true,
  plugins = []
} = {}) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  target.actions = (0, _actus.init)([isDevelopment && (0, _actusLogger.default)({
    name: target.constructor.name
  }), (0, _actusDefaultActions.default)(target.state), ...plugins, {
    state: target.state,
    actions: target.actions || {},
    subscribers: [({
      state
    }) => {
      // eslint-disable-next-line fp/no-mutation, no-param-reassign
      target.state = isDevelopment ? (0, _deepFreeze.default)(state) : state;
    }]
  }]);
}