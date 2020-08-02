# persist

Persisting state to a synchronous storage (`localStorage` by default)

## Examples

### Usage

```js
import { actus, persist } from "actus";

actus([
  {
    state: {...},
    actions: {...},
    subscribers: [...]
  },
  persist({
    // Optional name for storage key, "state" by default
    key: "myApp",

    // Optional selector, state => state by default
    selector: state => ({ foo: state.foo, bar: state.bar })
  })
]);
```

### React Counter App

```js
import { actus, persist } from "actus";
import React from "react";
import ReactDOM from "react-dom";

init([
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
  persist(),
]);
```

[Try it on CodeSandbox](https://codesandbox.io/s/actus-react-counter-app-example-with-actus-localstorage-3dk0n)
