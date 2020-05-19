"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = freeze;

var _deepFreeze = _interopRequireDefault(require("deep-freeze"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function freeze() {
  return {
    subscribers: [function freezeState({
      state
    }) {
      if (!Object.isFrozen(state)) {
        (0, _deepFreeze.default)(state);
      }
    }]
  };
}