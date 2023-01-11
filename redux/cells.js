import * as ActionTypes from "./actionTypes";

export const cells = (
  state = {
    isLoading: true,
    errMess: null,
    cells: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.CELLS_LOADING:
      return {
        ...state,
        isLoading: true,
        errMess: null,
      };
    case ActionTypes.ADD_CELLS:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        cells: action.payload,
      };
    default:
      return state;
  }
};
