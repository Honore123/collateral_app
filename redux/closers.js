import * as ActionTypes from "./actionTypes";

export const closers = (
  state = {
    isLoading: true,
    errMess: null,
    closers: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_CLOSERS:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        closers: action.payload,
      };
    default:
      return state;
  }
};
