import * as ActionTypes from "./actionTypes";

export const districts = (
  state = {
    isLoading: true,
    errMess: null,
    districts: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.DISTRICTS_LOADING:
      return {
        ...state,
        isLoading: true,
        errMess: null,
      };
    case ActionTypes.ADD_DISTRICTS:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        districts: action.payload,
      };
    default:
      return state;
  }
};
