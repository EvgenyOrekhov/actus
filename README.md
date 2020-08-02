# actus

Minimalist state container

[![npm version](https://img.shields.io/npm/v/actus.svg?style=flat-square)](https://www.npmjs.com/package/actus)

- **Simple** - it takes 2 minutes to learn
- **Small** - [see for yourself](https://bundlephobia.com/result?p=actus)
- **Functional** - data are never mutated
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
});
```

[Try it on CodeSandbox](https://codesandbox.io/s/actusreact-counter-app-example-y4p8e)

## API

```js
import { init } from "actus";

// init() returns actions bound to the current state, in case if you need them
// outside of subscribers:
const actions = init({
  // The initial state:
  state: { number: 0 },

  // Actions accept an optional payload and the current state, and must return
  // a new state:
  actions: {
    add: ({ state, payload }) => ({ ...state, number: state.number + payload }),
    reset: () => ({ number: 0 }),
  },

  // Subscribers will be called sequentially during initialization and then
  // after any action call:
  subscribers: [({ state, actions, actionName, value }) => {}],
});

// The first argument is the payload:
actions.add(1);
```

## Plugins

- [actus-default-actions](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-default-actions) - basic actions for your state properties (`set()`, `reset()`, `toggle()`, etc.)
- [actus-localstorage](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-localstorage) - persists state to `localStorage`
- [actus-state-validator](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-state-validator) - state validator and normalizer powered by [joi](https://github.com/hapijs/joi)

## Plugins for development

- [actus-logger](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-logger) - logs actions and state changes to your console
- [actus-redux-devtools](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-redux-devtools) - Use [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension) with actus
- [actus-freeze](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-freeze) - deep freezes your state to prevent mutations

## Frameworks

- [actus-ember](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-ember)

## Acknowledgements

Sources of inspiration:

- https://github.com/reduxjs/redux
- https://github.com/jorgebucaran/hyperapp

## [Changelog](https://github.com/EvgenyOrekhov/actus/releases)

## License

[MIT](/LICENSE)
