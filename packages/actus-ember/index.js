/* eslint-disable fp/no-mutation, no-param-reassign */

import { init } from "actus";
import logger from "actus-logger";
import defaultActions from "actus-default-actions";
// eslint-disable-next-line import/no-unresolved, node/no-missing-import
import { getOwner } from "@ember/application";

function getIsDevelopment(target) {
  return (
    getOwner(target).resolveRegistration("config:environment").environment ===
    "development"
  );
}

export default function actusify(
  target,
  { isDevelopment = getIsDevelopment(target) } = {}
) {
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
