"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stateValidator;

var _makeStateValidator = _interopRequireDefault(require("./makeStateValidator.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stateValidator(schema, options = undefined) {
  return {
    actions: {
      setStateFromStateValidator: value => value
    },
    subscribers: [(0, _makeStateValidator.default)(schema, options)]
  };
}