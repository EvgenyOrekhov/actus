# actus

Minimalist, boilerplate-free, framework-agnostic state container

[![npm version](https://img.shields.io/npm/v/actus.svg?style=flat-square)](https://www.npmjs.com/package/actus)

- **Simple** - it takes 2 minutes to learn
- **Boilerplate-free**
  - comes with built-in default actions (`set()`, `reset()`, `toggle()`,
    `merge()`, etc.)
  - handles loading and error states for async actions for you
- **Framework-agnostic**

## Examples

### React Counter App

```js
import { actus } from "actus";
import React from "react";
import ReactDOM from "react-dom";

actus({
  state: 0,
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
});
```

[Try it on CodeSandbox](https://codesandbox.io/s/actusreact-counter-app-example-y4p8e)

## API

```js
import { actus } from "actus";

// actus() returns actions bound to the current state, in case if you need them
// outside of subscribers:
const actions = actus({
  // The initial state:
  state: { number: 0 },

  // Actions accept an optional payload and the current state, and must return
  // a new state:
  actions: {
    number: {
      add: ({ state, payload }) => state + payload,
    },
  },

  // Subscribers will be called sequentially during initialization and then
  // after any action call:
  subscribers: [({ state, actions, actionName, payload }) => {}],
});

// The first argument is the payload:
actions.number.add(1);
```

## Plugins

The following plugins are enabled automatically (but can be redefined manually
if needed):

- [defaultActions](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus/src/plugins/defaultActions) - basic actions for your state properties (`set()`, `reset()`, `toggle()`, `merge()`, etc.)
- [logger](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus/src/plugins/logger) - logs actions and state changes to your console
- [freeze](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus/src/plugins/freeze) - deep freezes your state to prevent mutations
- [actus-redux-devtools](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-redux-devtools) - use [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension) with actus

Other plugins that can be enabled manually:

- [persist](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus/src/plugins/persist) - persists state to a synchronous storage (`localStorage` by default)
- [actus-state-validator](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-state-validator) - state validator and normalizer powered by [joi](https://github.com/hapijs/joi)

## Frameworks

- [actus-ember](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-ember)

## Acknowledgements

Sources of inspiration:

- https://github.com/reduxjs/redux
- https://github.com/jorgebucaran/hyperapp

## [Changelog](https://github.com/EvgenyOrekhov/actus/releases)

## License

[MIT](/LICENSE)
