import { actus, logger, freeze, defaultActions } from "actus";
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
            function setState({ state }) {
              target.set("state", state);
            },
          ],
        }
      : plugin
  );

  // eslint-disable-next-line fp/no-mutation
  target.actions = actus([
    ...(isDevelopment
      ? [logger({ name: target.constructor.name }), freeze()]
      : []),
    defaultActions(target.state),
    ...normalizedPlugins,
  ]);
}
