/* eslint-disable max-statements, sonarjs/cognitive-complexity */

import { actus } from "actus";
import { useEffect, useReducer, useRef } from "react";
import deep from "fast-deep-equal";

function defaultSelector(state) {
  return state;
}

function createStore(config) {
  const plugins = Array.isArray(config) ? config : [config];
  const enabledPlugins = plugins.filter(Boolean);
  const target = enabledPlugins.find(({ name }) => name === undefined);

  // eslint-disable-next-line fp/no-let, init-declarations
  let currentState;

  const subscribers = new Map();

  const normalizedPlugins = enabledPlugins.map((plugin) =>
    plugin === target
      ? {
          ...target,

          subscribers: [
            ({ state: newState }) => {
              // eslint-disable-next-line fp/no-mutation
              currentState = newState;

              subscribers.forEach(
                (
                  {
                    lastStateSlice,
                    selector,
                    isEqual,
                    rerender,
                    stateRef: stateReference,
                  },
                  reference
                ) => {
                  stateReference.current = currentState;

                  const newStateSlice = selector(currentState);

                  if (!isEqual(newStateSlice, lastStateSlice)) {
                    subscribers.set(reference, {
                      lastStateSlice: newStateSlice,
                      selector,
                      isEqual,
                      rerender,
                      stateRef: stateReference,
                    });

                    rerender();
                  }
                }
              );
            },
          ],
        }
      : plugin
  );

  const actions = actus(normalizedPlugins);

  return {
    actions,

    useSelector(
      selector = defaultSelector,
      isEqual = selector === defaultSelector ? deep : Object.is
    ) {
      const reference = useRef();
      const selectorReference = useRef(selector);
      const stateReference = useRef(currentState);
      const [, rerender] = useReducer((count) => count + 1, 0);

      useEffect(
        () => () => {
          subscribers.delete(reference);
        },
        []
      );

      if (
        selectorReference.current === selector &&
        stateReference.current === currentState &&
        subscribers.has(reference)
      ) {
        return subscribers.get(reference).lastStateSlice;
      }

      selectorReference.current = selector;
      stateReference.current = currentState;

      const lastStateSlice = selector(currentState);

      subscribers.set(reference, {
        lastStateSlice,
        selector,
        isEqual,
        rerender,
        stateRef: stateReference,
      });

      return lastStateSlice;
    },
  };
}

export { createStore, deep };
export { default as shallow } from "shallowequal";
