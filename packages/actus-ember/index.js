/* eslint-disable fp/no-mutation, no-param-reassign */

import { init } from "actus";
import logger from "actus-logger";
import defaultActions from "actus-default-actions";

export default function actusify(target, { isDevelopment = true } = {}) {
  target.actions = init([
    isDevelopment && logger({ name: target.constructor.name }),
    defaultActions(target.state),
    {
      state: target.state,
      actions: target.actions || {},
      subscribers: [
        ({ state }) => {
          target.state = state;
        },
      ],
    },
  ]);
}
