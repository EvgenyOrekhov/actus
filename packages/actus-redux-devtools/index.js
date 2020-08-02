/* global window */

function getSlice(object, path) {
  return path.reduce(
    (accumulator, property) =>
      accumulator === undefined || accumulator === null
        ? undefined
        : accumulator[property],
    object
  );
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function reduxDevTools({ name = undefined } = {}) {
  if (
    typeof window === "undefined" ||
    window.__REDUX_DEVTOOLS_EXTENSION__ === undefined
  ) {
    return {};
  }

  return {
    actions: {
      setStateFromDevTools: ({ payload }) => payload,
    },

    subscribers: [
      (function makeReduxDevtoolsSubscriber() {
        /* eslint-disable fp/no-let, init-declarations */
        let initialState;
        let currentState;
        let devTools;
        /* eslint-enable fp/no-let, init-declarations */

        function parse(value) {
          try {
            return JSON.parse(value);
          } catch (error) {
            devTools.error(`Invalid JSON: ${value}`);

            throw error;
          }
        }

        return function send({ state, actionName, value, actions }) {
          // eslint-disable-next-line fp/no-mutation
          currentState = state;

          if (devTools === undefined) {
            // eslint-disable-next-line fp/no-mutation
            initialState = state;

            // eslint-disable-next-line fp/no-mutation
            devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
              name,
              actionCreators: actions,
              actionsBlacklist: ["setStateFromDevTools"],

              features: {
                /* eslint-disable @typescript-eslint/naming-convention */
                pause: true, // start/pause recording of dispatched actions
                lock: false, // lock/unlock dispatching actions and side effects
                persist: false, // persist states on page reloading
                export: false, // export history of actions in a file
                import: false, // import history of actions from a file
                jump: true, // jump back and forth (time travelling)
                skip: false, // skip (cancel) actions
                reorder: false, // drag and drop actions in the history list
                dispatch: true, // dispatch custom actions or action creators
                test: false, // generate tests for the selected actions
                /* eslint-enable */
              },
            });

            // eslint-disable-next-line max-statements, complexity
            devTools.subscribe(function handleMessage(message) {
              if (message.type === "ACTION") {
                const payload =
                  typeof message.payload === "string"
                    ? parse(message.payload)
                    : message.payload;

                if (payload.name === undefined) {
                  devTools.error(
                    `Invalid action: ${message.payload}.
                    Example: { "name": "foo.bar", "args": ["{ \\"baz\\": \\"qux\\" }"] }`
                  );

                  return;
                }

                const action = getSlice(actions, payload.name.split("."));

                if (typeof action === "function") {
                  action(
                    Array.isArray(payload.args) && payload.args.length === 0
                      ? undefined
                      : parse(payload.args[0])
                  );

                  return;
                }

                devTools.error(`Unknown action: ${payload.name}`);

                return;
              }

              if (message.type === "DISPATCH") {
                // eslint-disable-next-line default-case
                switch (message.payload.type) {
                  case "RESET":
                    actions.setStateFromDevTools(initialState);
                    devTools.init(initialState);

                    return;
                  case "COMMIT":
                    devTools.init(currentState);

                    return;
                  case "ROLLBACK": {
                    const commitedState = parse(message.state);

                    actions.setStateFromDevTools(commitedState);
                    devTools.init(commitedState);

                    return;
                  }
                  case "JUMP_TO_STATE":
                  case "JUMP_TO_ACTION":
                    actions.setStateFromDevTools(parse(message.state));
                }
              }
            });

            devTools.init(state);

            return;
          }

          const type = Array.isArray(actionName)
            ? actionName.join(".")
            : actionName;

          devTools.send({ type, payload: value }, state);
        };
      })(),
    ],
  };
}
