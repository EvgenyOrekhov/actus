# actus-logger

Logger for actus

[![npm version](https://img.shields.io/npm/v/actus-logger.svg?style=flat-square)](https://www.npmjs.com/package/actus-logger)

![actus-logger](/packages/actus-logger/screenshot.png)

## Install

```sh
npm install actus-logger
```

## Examples

### Usage

```js
import { init } from "actus";
import logger from "actus-logger";

init([
  logger({ name: "Optional name" }),
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
import logger from "actus-logger";
import React from "react";
import ReactDOM from "react-dom";

init([
  logger(),
  {
    state: 0,
    actions: {
      inc: (value, state) => state + 1,
      dec: (value, state) => state - 1,
    },
    subscribers: [
      ({ state, actions }) => {
        ReactDOM.render(
          <>
            <h1>{state}</h1>
            <button onClick={() => actions.inc()}>+</button>
            <button onClick={() => actions.dec()}>-</button>
          </>,
          document.querySelector("#root")
        );
      },
    ],
  },
]);
```

[Try it on CodeSandbox](https://codesandbox.io/s/actus-react-counter-app-example-with-actus-logger-mgc9f)

## Acknowledgements

Sources of inspiration:

- https://github.com/LogRocket/redux-logger
