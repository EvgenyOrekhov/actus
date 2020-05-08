"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = actusify;

var _actus = require("actus");

var _actusLogger = _interopRequireDefault(require("actus-logger"));

var _actusDefaultActions = _interopRequireDefault(require("actus-default-actions"));

var _deepFreeze = _interopRequireDefault(require("deep-freeze"));

var _application = require("@ember/application");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line import/no-unresolved, node/no-missing-import
function getIsDevelopment(target) {
  return (0, _application.getOwner)(target).resolveRegistration("config:environment").environment === "development";
}

function actusify(target, {
  isDevelopment = getIsDevelopment(target)
} = {}) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  target.actions = (0, _actus.init)([isDevelopment && (0, _actusLogger.default)({
    name: target.constructor.name
  }), (0, _actusDefaultActions.default)(target.state), {
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