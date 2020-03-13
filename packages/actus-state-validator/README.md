# actus-state-validator

State validator and normalizer for actus
(powered by [joi](https://github.com/hapijs/joi))

[![npm version](https://img.shields.io/npm/v/actus-state-validator.svg?style=flat-square)](https://www.npmjs.com/package/actus-state-validator)

## Install

```sh
npm install actus-state-validator @hapi/joi
```

## Examples

### Usage

```js
import { init } from "actus";
import stateValidator from "actus-state-validator";
import Joi from "@hapi/joi";

init([
  stateValidator(Joi.object({...}), { /* joi validation options */ }),
  {
    state: {...},
    actions: {...},
    subscribers: [...]
  }
]);
```

### React Counter App

```js
import { init } from "actus";
import stateValidator from "actus-state-validator";
import logger from "actus-logger";
import Joi from "@hapi/joi";
import React from "react";
import ReactDOM from "react-dom";

init([
  logger(),
  stateValidator(
    Joi.number()
      .required()
      .integer()
  ),
  {
    state: 0,
    actions: {
      inc: (value, state) => state + 1,
      dec: (value, state) => state - 1,
      tryConvertingToString: (value, state) => String(state),
      trySettingToUndefined: () => undefined
    },
    subscribers: [
      ({ state, actions }) => {
        ReactDOM.render(
          <>
            <h1>{state}</h1>
            <button onClick={() => actions.inc()}>+</button>
            <button onClick={() => actions.dec()}>-</button>
            <br />
            <button onClick={() => actions.tryConvertingToString()}>
              try converting to string (will be coerced to number)
            </button>
            <button onClick={() => actions.trySettingToUndefined()}>
              try setting to undefined (will throw error)
            </button>
          </>,
          document.querySelector("#root")
        );
      }
    ]
  }
]);
```

[Try it on CodeSandbox](https://codesandbox.io/s/actus-react-counter-app-example-with-actus-state-validator-onwgk)
