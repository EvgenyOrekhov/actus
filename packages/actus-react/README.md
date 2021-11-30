# actus-react

React bindings for actus

[![npm version](https://img.shields.io/npm/v/actus-react.svg?style=flat-square)](https://www.npmjs.com/package/actus-react)

## Included and preconfigured plugins

- [defaultActions](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus/src/plugins/defaultActions)
- [logger](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus/src/plugins/logger)
- [freeze](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus/src/plugins/freeze)

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
      <h1>{number}</h1>
      <button onClick={actions.number.increment}>+</button>
      <button onClick={actions.number.decrement}>-</button>
    </>
  );
}
```
