import { init } from "actus";
import logger from "actus-logger";
import defaultActions from "actus-default-actions";
import deepFreeze from "deep-freeze";
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
          target.state = deepFreeze(state);
        },
      ],
    },
  ]);
}
