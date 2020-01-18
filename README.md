# actus

Minimalist state container

[![npm version](https://img.shields.io/npm/v/actus.svg?style=flat-square)](https://www.npmjs.com/package/actus)
[![Travis CI build status](https://img.shields.io/travis/EvgenyOrekhov/actus/master.svg?style=flat-square)](https://travis-ci.org/EvgenyOrekhov/actus)

- **Simple** - it takes 2 minutes to learn
- **Small** - [no dependencies](https://bundlephobia.com/result?p=actus)
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
    inc: state => state + 1,
    dec: state => state - 1
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
    }
  ]
});
```

[Try it on CodeSandbox](https://codesandbox.io/s/actusreact-counter-app-example-y4p8e)

## Acknowledgements

Sources of inspiration:

- https://github.com/reduxjs/redux
- https://github.com/jorgebucaran/hyperapp

## [Changelog](https://github.com/EvgenyOrekhov/actus/releases)

## License

[MIT](LICENSE)
