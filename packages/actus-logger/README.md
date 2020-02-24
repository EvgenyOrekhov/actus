# actus-logger

Logger for actus

[![npm version](https://img.shields.io/npm/v/actus-logger.svg?style=flat-square)](https://www.npmjs.com/package/actus-logger)

![actus-logger](/packages/actus-logger/screenshot.png)

## Install

```sh
npm install actus-logger
```

## Usage

```js
import { init } from "actus";
import logger from "actus-logger";

init([
  logger(),
  {
    state: {...},
    actions: {...},
    subscribers: [...]
  }
]);
```

## Acknowledgements

Sources of inspiration:

- https://github.com/LogRocket/redux-logger
