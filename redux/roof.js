import * as ActionTypes from "./actionTypes";

export const roofs = (
  state = {
    isLoading: true,
    errMess: null,
    roofs: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_ROOFS:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        roofs: action.payload,
      };
    default:
      return state;
  }
};
