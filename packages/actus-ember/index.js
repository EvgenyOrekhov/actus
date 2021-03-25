import { actus, logger, reduxDevTools } from "actus";
import isPlainObject from "is-plain-obj";

export default function actusify(config, { getNextState = undefined } = {}) {
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
              if (!target.isDestroyed) {
                target.set("state", state);
              }
            },
          ],

          getNextState,
        }
      : plugin
  );

  const { name } = target.constructor;

  // eslint-disable-next-line fp/no-mutation
  target.actions = actus([
    logger({ name }),
    reduxDevTools({ name }),
    ...normalizedPlugins,
  ]);
}
