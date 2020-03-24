# actus-default-actions

Default actions for actus

[![npm version](https://img.shields.io/npm/v/actus-default-actions.svg?style=flat-square)](https://www.npmjs.com/package/actus-default-actions)

## Install

```sh
npm install actus-default-actions
```

## Examples

### React Counter App

```js
import { init } from "actus";
import defaultActions from "actus-default-actions";
import React from "react";
import ReactDOM from "react-dom";

const initialState = 0;

init([
  defaultActions(initialState),
  {
    state: initialState,
    subscribers: [
      ({ state, actions }) => {
        ReactDOM.render(
          <>
            <h1>{state}</h1>
            <button onClick={actions.increment}>+</button>
            <button onClick={actions.decrement}>-</button>
          </>,
          document.querySelector("#root")
        );
      },
    ],
  },
]);
```

[Try it on CodeSandbox](https://codesandbox.io/s/actus-react-counter-app-example-with-actus-default-actions-wwsb4)

## Acknowledgements

Sources of inspiration:

- https://github.com/microstates/microstates.js
- https://github.com/cowboyd/microstates-redux
