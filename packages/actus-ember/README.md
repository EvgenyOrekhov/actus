# actus-ember

Ember bindings for actus

[![npm version](https://img.shields.io/npm/v/actus-ember.svg?style=flat-square)](https://www.npmjs.com/package/actus-ember)

## Included and preconfigured plugins

- [defaultActions](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus/src/plugins/defaultActions)
- [logger](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus/src/plugins/logger)
- [freeze](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus/src/plugins/freeze)

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

## Why choose actus-ember

- actus promotes and facilitates the usage of the Immutable Pattern recommended by [the official Glimmer docs](https://glimmerjs.com/guides/tracked-properties) for writing "maintainable, understandable components"
- actus promotes declaring actions (functions that change the `state` object) separately and beforehand instead of updating `this.state` ad-hoc and all over the place
- preconfigured [freeze](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus/src/plugins/freeze) plugin prevents violation of the Immutable Pattern (prevents mutation of `this.state`)
- preconfigured [defaultActions](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus/src/plugins/defaultActions) plugin eliminates the need of implementing simple actions like toggling booleans, setting values, resetting values, etc. while following the Immutable Pattern
- defaultActions plugin promotes the usage of non-null default empty values (`""` for strings, `[]` for arrays, etc.) because defaultActions doesn't work with `null`
- preconfigured [logger](https://github.com/EvgenyOrekhov/actus/tree/master/packages/actus/src/plugins/logger) plugin significantly improves developer experience by providing detailed info to the console on every state change

## actus-ember vs [ember-redux](https://github.com/ember-redux/ember-redux)

- no boilerplate
- smaller, simpler API
- built-in support for async actions with automatic loading states and error handling
