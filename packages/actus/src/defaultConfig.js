import getSlice from "./getSlice.js";
import setSlice from "./setSlice.js";

function getGlobalLoading(loading) {
  return Object.values(loading).some((value) =>
    typeof value === "boolean" ? value : getGlobalLoading(value)
  );
}

function hasErrors(errors) {
  return !Object.values(errors).every((value) => value === undefined);
}

const defaultConfig = {
  actions: {
    setLoading: ({ state, payload }) => {
      const { actionPath, actionPayload } = payload;

      function getNewActionErrors() {
        const newActionErrors = {
          ...getSlice(state.errors, actionPath),
          [actionPayload]: undefined,
        };

        return hasErrors(newActionErrors) ? newActionErrors : undefined;
      }

      return {
        ...state,

        loading: setSlice(
          {
            ...state.loading,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            global: true,
          },
          actionPath,
          actionPayload === undefined
            ? true
            : { ...getSlice(state.loading, actionPath), [actionPayload]: true }
        ),

        ...(getSlice(state.errors, actionPath) === undefined
          ? {}
          : {
              errors: setSlice(
                state.errors,
                actionPath,
                actionPayload === undefined ? undefined : getNewActionErrors()
              ),
            }),
      };
    },

    unsetLoading: ({ state, payload }) => {
      const { actionPath, actionPayload } = payload;

      function getNewActionLoadingStates() {
        const newActionLoadingState = {
          ...getSlice(state.loading, actionPath),
          [actionPayload]: false,
        };

        return getGlobalLoading(newActionLoadingState) === false
          ? false
          : newActionLoadingState;
      }

      const loading = setSlice(
        {
          ...state.loading,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          global: false,
        },
        actionPath,
        actionPayload === undefined ? false : getNewActionLoadingStates()
      );

      return {
        ...state,

        loading: {
          ...loading,
          global: getGlobalLoading(loading),
        },
      };
    },

    handleError: ({ state, payload }) => {
      const { actionPath, actionPayload, error } = payload;

      return {
        ...state,

        errors: setSlice(
          state.errors,
          actionPath,
          actionPayload === undefined
            ? error
            : { ...getSlice(state.errors, actionPath), [actionPayload]: error }
        ),
      };
    },
  },
};

export default defaultConfig;
