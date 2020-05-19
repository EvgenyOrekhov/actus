import { init } from "actus";
import logger from "actus-logger";
import freeze from "actus-freeze";
import defaultActions from "actus-default-actions";
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
              target.state = state;
            },
          ],
        }
      : plugin
  );

  // eslint-disable-next-line fp/no-mutation
  target.actions = init([
    ...(isDevelopment
      ? [logger({ name: target.constructor.name }), freeze()]
      : []),
    defaultActions(target.state),
    ...normalizedPlugins,
  ]);
}
