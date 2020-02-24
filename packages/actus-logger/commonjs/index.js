"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = logger;

var _makeLogger = _interopRequireDefault(require("./makeLogger.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function logger({
  name
} = {}) {
  return {
    subscribers: [(0, _makeLogger.default)({
      name
    })]
  };
}