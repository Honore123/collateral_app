import * as ActionTypes from "./actionTypes";

export const ceilings = (
  state = {
    isLoading: true,
    errMess: null,
    ceilings: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_CEILINGS:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        ceilings: action.payload,
      };
    default:
      return state;
  }
};
