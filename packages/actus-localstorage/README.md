# actus-localstorage

Persisting actus state to `localStorage`

[![npm version](https://img.shields.io/npm/v/actus-localstorage.svg?style=flat-square)](https://www.npmjs.com/package/actus-localstorage)

## Install

```sh
npm install actus-localstorage
```

## Examples

### Usage

```js
import { init } from "actus";
import localStoragePlugin from "actus-localstorage";

init([
  {
    state: {...},
    actions: {...},
    subscribers: [...]
  },
  localStoragePlugin({
    // Optional name for localStorage key, "state" by default
    key: "myApp",

    // Optional selector, state => state by default
    selector: state => ({ foo: state.foo, bar: state.bar })
  })
]);
```

### React Counter App

```js
import { init } from "actus";
import localStoragePlugin from "actus-localstorage";
import React from "react";
import ReactDOM from "react-dom";

init([
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
            <button onClick={actions.inc}>+</button>
            <button onClick={actions.dec}>-</button>
          </>,
          document.querySelector("#root")
        );
      },
    ],
  },
  localStoragePlugin(),
]);
```

[Try it on CodeSandbox](https://codesandbox.io/s/actus-react-counter-app-example-with-actus-localstorage-3dk0n)
