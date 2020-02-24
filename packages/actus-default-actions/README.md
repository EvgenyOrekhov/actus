# actus-default-actions

Default actions for actus

[![npm version](https://img.shields.io/npm/v/actus-default-actions.svg?style=flat-square)](https://www.npmjs.com/package/actus-default-actions)

## Install

```sh
npm install actus-default-actions
```

## Usage

```js
import { init } from "actus";
import defaultActions from "actus-default-actions";

const initialState = { counter: 0 };

const actions = init([
  defaultActions(initialState),
  {
    state: initialState,
    subscribers: [console.log]
  }
]);

actions.counter.increment();
actions.counter.decrement();
```

## Acknowledgements

Sources of inspiration:

- https://github.com/microstates/microstates.js
- https://github.com/cowboyd/microstates-redux
