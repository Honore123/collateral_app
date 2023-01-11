import * as ActionTypes from "./actionTypes";

export const tenures = (
  state = {
    isLoading: true,
    errMess: null,
    tenures: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_TENURES:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        tenures: action.payload,
      };
    default:
      return state;
  }
};
