# actus-redux-devtools

Use [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension) with actus

[![npm version](https://img.shields.io/npm/v/actus-redux-devtools.svg?style=flat-square)](https://www.npmjs.com/package/actus-redux-devtools)

## Install

```sh
npm install actus-redux-devtools
```

## Examples

### Usage

```js
import { actus } from "actus";
import reduxDevTools from "actus-redux-devtools";

actus([
  reduxDevTools({ name: "Optional instance name" }),
  {
    state: {...},
    actions: {...},
    subscribers: [...]
  }
]);
```

### React Counter App

```js
import { actus } from "actus";
import reduxDevTools from "actus-redux-devtools";
import React from "react";
import ReactDOM from "react-dom";

actus([
  reduxDevTools(),
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
            <button onClick={actions.inc}>+</button>
            <button onClick={actions.dec}>-</button>
          </>,
          document.querySelector("#root")
        );
      },
    ],
  },
]);
```

[Try it on CodeSandbox](https://codesandbox.io/s/actus-react-counter-app-example-with-actus-redux-devtools-voei4)
