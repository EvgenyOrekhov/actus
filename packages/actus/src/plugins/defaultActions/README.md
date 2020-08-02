# defaultActions

Default actions for actus

## Examples

### React Counter App

```js
import { actus, defaultActions } from "actus";
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
