# actus

Minimalist state container

[![npm version](https://img.shields.io/npm/v/actus.svg?style=flat-square)](https://www.npmjs.com/package/actus)
[![Travis CI build status](https://img.shields.io/travis/EvgenyOrekhov/actus/master.svg?style=flat-square)](https://travis-ci.org/EvgenyOrekhov/actus)

- **Simple** - it takes 2 minutes to learn
- **Small** - [see for yourself](https://bundlephobia.com/result?p=actus)
- **Functional** - immutable data-last actions
- **Framework-agnostic**

## Examples

### React Counter App

```js
import { init } from "actus";
import React from "react";
import ReactDOM from "react-dom";

init({
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
});
```

[Try it on CodeSandbox](https://codesandbox.io/s/actusreact-counter-app-example-y4p8e)

## API

```js
import { init } from "actus";

// You don't have to use Ramda, but it plays very nicely with actus
import { evolve, dec, multiply } from "ramda";

// init() returns actions bound to the current state, if you need them outside
// of subscribers:
const actions = init({
  // The initial state:
  state: { number: 0 },

  // Actions accept an optional value and the current state, and must return
  // a new state:
  actions: {
    // Binary action that accepts a value and the current state:
    add: (value, state) => ({ ...state, number: state.number + value }),

    // Manually curried action that accepts a value and the current state
    // (in plain JS):
    subtract: (value) => (state) => ({
      ...state,
      number: state.number - value,
    }),

    // Curried action that accepts a value and the current state
    // (with Ramda functions):
    multiply: (value) => evolve({ number: multiply(value) }),

    // Nullary action that ignores the current state:
    reset: () => ({ number: 0 }),
  },

  // Subscribers will be called sequentially during initialization and then
  // after any action call:
  subscribers: [({ state, actions, actionName, value }) => {}],
});
```

## Plugins

- [actus-default-actions](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-default-actions) - basic actions for your state properties (`set()`, `reset()`, `toggle()`, etc.)
- [actus-localstorage](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-localstorage) - persists state to `localStorage`
- [actus-state-validator](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-state-validator) - state validator and normalizer powered by [joi](https://github.com/hapijs/joi)

## Plugins for development

- [actus-logger](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-logger) - logs actions and state changes to your console
- [actus-redux-devtools](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-redux-devtools) - Use [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension) with actus

## Acknowledgements

Sources of inspiration:

- https://github.com/reduxjs/redux
- https://github.com/jorgebucaran/hyperapp

## [Changelog](https://github.com/EvgenyOrekhov/actus/releases)

## License

[MIT](/LICENSE)
