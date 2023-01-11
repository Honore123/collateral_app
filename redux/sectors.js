import * as ActionTypes from "./actionTypes";

export const sectors = (
  state = {
    isLoading: false,
    errMess: null,
    sectors: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.SECTORS_LOADING:
      return {
        ...state,
        isLoading: true,
        errMess: null,
      };
    case ActionTypes.ADD_SECTORS:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        sectors: action.payload,
      };
    default:
      return state;
  }
};
