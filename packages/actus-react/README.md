# actus-react

React bindings for actus

[![npm version](https://img.shields.io/npm/v/actus-react.svg?style=flat-square)](https://www.npmjs.com/package/actus-react)

## Included and preconfigured plugins

- [defaultActions](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus/src/plugins/defaultActions)
- [logger](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus/src/plugins/logger)
- [freeze](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus/src/plugins/freeze)
- [reduxDevTools](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus/src/plugins/reduxDevTools)

## Install

```sh
npm install actus-react
```

## Examples

### Usage

#### First create a store

```js
// store.js

import { createStore } from "actus-react";

export const { actions, useSelector } = createStore({
  state: {
    number: 0,
  },

  actions: {
    number: {
      random: ({ state, payload }) => Math.random(),
    },
  },
});
```

#### Then use `actions` and `useSelector()` in your components, that's it!

```js
// App.js

import { actions, useSelector } from "./store.js";

export default function App() {
  const number = useSelector((state) => state.number);

  return (
    <>
      <input
        type="number"
        value={number}
        onChange={(event) => actions.number.set(event.target.value)}
      />
      <button onClick={actions.number.increment}>+</button>
      <button onClick={actions.number.decrement}>-</button>
      <button onClick={actions.number.random}>random</button>
      <button onClick={actions.number.reset}>reset</button>
    </>
  );
}
```

[Try it on CodeSandbox](https://codesandbox.io/s/actus-react-counter-app-example-3ixtu)
