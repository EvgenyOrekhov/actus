"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultActions;

var _makeDefaultActions = _interopRequireDefault(require("./makeDefaultActions.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultActions(initialState) {
  return {
    actions: (0, _makeDefaultActions.default)(initialState)
  };
}