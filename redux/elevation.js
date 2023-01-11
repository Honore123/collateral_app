import * as ActionTypes from "./actionTypes";

export const elevations = (
  state = {
    isLoading: true,
    errMess: null,
    elevations: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_ELEVATIONS:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        elevations: action.payload,
      };
    default:
      return state;
  }
};
