import * as ActionTypes from "./actionTypes";

export const pavements = (
  state = {
    isLoading: true,
    errMess: null,
    pavements: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_PAVEMENTS:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        pavements: action.payload,
      };
    default:
      return state;
  }
};
