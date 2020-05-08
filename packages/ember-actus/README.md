# ember-actus

Ember bindings for actus

[![npm version](https://img.shields.io/npm/v/ember-actus.svg?style=flat-square)](https://www.npmjs.com/package/ember-actus)

## Included and preconfigured plugins

- [actus-default-actions](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-default-actions)
- [actus-logger](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus-logger)

## Install

```sh
npm install ember-actus
```

## Examples

### Usage

```js
import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
import actusify from "ember-actus";

export default class ExampleService extends Service {
  @tracked state = {...};

  actions = {...};

  constructor(...args) {
    super(...args);

    actusify(this);
  }
}
```
