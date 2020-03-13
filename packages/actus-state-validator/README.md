# actus-state-validator

State validator and normalizer for actus
(powered by [joi](https://github.com/hapijs/joi))

[![npm version](https://img.shields.io/npm/v/actus-state-validator.svg?style=flat-square)](https://www.npmjs.com/package/actus-state-validator)

## Install

```sh
npm install actus-state-validator @hapi/joi
```

## Examples

### React Counter App

```js
import { init } from "actus";
import stateValidator from "actus-state-validator";
import Joi from "@hapi/joi";
import React from "react";
import ReactDOM from "react-dom";

init({
  state: 0,
  actions: {
    inc: (value, state) => state + 1,
    dec: (value, state) => state - 1,
    tryConvertingToString: String,
    trySettingToUndefined: () => undefined
  },
  subscribers: [
    stateValidator(
      Joi.number()
        .required()
        .integer()
    ),
    ({ state, actions }) => {
      ReactDOM.render(
        <>
          <h1>{state}</h1>
          <button onClick={actions.inc}>+</button>
          <button onClick={actions.dec}>-</button>
          <button onClick={actions.tryConvertingToString}>
            try converting to string (will be coerced to number)
          </button>
          <button onClick={actions.trySettingToUndefined}>
            try setting to undefined (will throw error)
          </button>
        </>,
        document.querySelector("#root")
      );
    }
  ]
});
```
