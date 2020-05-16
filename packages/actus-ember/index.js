import { init } from "actus";
import logger from "actus-logger";
import defaultActions from "actus-default-actions";
import deepFreeze from "deep-freeze";
import isPlainObject from "is-plain-obj";

export default function actusify(config, { isDevelopment = true } = {}) {
  const plugins = Array.isArray(config) ? config : [config];
  const enabledPlugins = plugins.filter(Boolean);
  const target = enabledPlugins.find((plugin) => !isPlainObject(plugin));

  const normalizedPlugins = enabledPlugins.map((plugin) =>
    plugin === target
      ? {
          state: target.state,
          actions: target.actions,
          subscribers: [
            ({ state }) => {
              // eslint-disable-next-line fp/no-mutation
              target.state = isDevelopment ? deepFreeze(state) : state;
            },
          ],
        }
      : plugin
  );

  // eslint-disable-next-line fp/no-mutation
  target.actions = init([
    isDevelopment && logger({ name: target.constructor.name }),
    defaultActions(target.state),
    ...normalizedPlugins,
  ]);
}
