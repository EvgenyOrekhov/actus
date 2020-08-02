# freeze

Deep freezes your state to prevent mutations

## Examples

### Usage

```js
import { actus, freeze } from "actus";

actus([
  freeze(),
  {
    state: {...},
    actions: {...},
    subscribers: [...]
  }
]);
```
