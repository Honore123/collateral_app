import * as ActionTypes from "./actionTypes";

export const buildingtypes = (
  state = {
    isLoading: true,
    errMess: null,
    buildingtypes: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_BUILDINGTYPES:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        buildingtypes: action.payload,
      };
    default:
      return state;
  }
};
