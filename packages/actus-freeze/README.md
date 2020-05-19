# actus-freeze

Deep freezes your state to prevent mutations

[![npm version](https://img.shields.io/npm/v/actus-freeze.svg?style=flat-square)](https://www.npmjs.com/package/actus-freeze)

## Install

```sh
npm install actus-freeze
```

## Examples

### Usage

```js
import { init } from "actus";
import freeze from "actus-freeze";

init([
  freeze(),
  {
    state: {...},
    actions: {...},
    subscribers: [...]
  }
]);
```
