import * as ActionTypes from "./actionTypes";

export const villages = (
  state = {
    isLoading: false,
    errMess: null,
    villages: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.VILLAGES_LOADING:
      return {
        ...state,
        isLoading: true,
        errMess: null,
      };
    case ActionTypes.ADD_VILLAGES:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        villages: action.payload,
      };
    default:
      return state;
  }
};
