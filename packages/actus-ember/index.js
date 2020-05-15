import { init } from "actus";
import logger from "actus-logger";
import defaultActions from "actus-default-actions";
import deepFreeze from "deep-freeze";

export default function actusify(
  target,
  { isDevelopment = true, plugins = [] } = {}
) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  target.actions = init([
    isDevelopment && logger({ name: target.constructor.name }),
    defaultActions(target.state),
    {
      state: target.state,
      actions: target.actions || {},
      subscribers: [
        ({ state }) => {
          // eslint-disable-next-line fp/no-mutation, no-param-reassign
          target.state = isDevelopment ? deepFreeze(state) : state;
        },
      ],
    },
    ...plugins,
  ]);
}
