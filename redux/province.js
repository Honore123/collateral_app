import * as ActionTypes from "./actionTypes";

export const provinces = (
  state = {
    isLoading: true,
    errMess: null,
    provinces: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_PROVINCES:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        provinces: action.payload,
      };
    default:
      return state;
  }
};
