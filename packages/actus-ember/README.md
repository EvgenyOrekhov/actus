# actus-ember

Ember bindings for actus

[![npm version](https://img.shields.io/npm/v/actus-ember.svg?style=flat-square)](https://www.npmjs.com/package/actus-ember)

## Included and preconfigured plugins

- [actus-default-actions](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-default-actions)
- [actus-logger](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-logger)
- [actus-freeze](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-freeze)

## Install

```sh
npm install actus-ember
```

## Examples

### Usage

```js
import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
import actusify from "actus-ember";

export default class ExampleService extends Service {
  @tracked state = {...};

  actions = {...};

  constructor(...args) {
    super(...args);

    actusify(this);
  }
}
```
