import * as ActionTypes from "./actionTypes";

export const foundations = (
  state = {
    isLoading: true,
    errMess: null,
    foundations: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_FOUNDATIONS:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        foundations: action.payload,
      };
    default:
      return state;
  }
};
