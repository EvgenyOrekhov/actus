# logger

![logger](/packages/actus/src/plugins/logger/screenshot.png)

## Examples

### Usage

```js
import { actus, logger } from "actus";

actus([
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
import { actus, logger } from "actus";
import React from "react";
import ReactDOM from "react-dom";

actus([
  logger(),
  {
    state: 0,
    actions: {
      inc: ({ state }) => state + 1,
      dec: ({ state }) => state - 1,
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
