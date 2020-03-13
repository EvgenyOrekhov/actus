"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeStateValidator;

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeStateValidator(schema, options = undefined) {
  return function validateState({
    state,
    actions
  }) {
    const normalizedState = _joi.default.attempt(state, schema, options);

    if (!(0, _fastDeepEqual.default)(state, normalizedState)) {
      actions.setStateFromStateValidator(normalizedState);
    }
  };
}