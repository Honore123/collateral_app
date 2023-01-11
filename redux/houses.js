import * as ActionTypes from "./actionTypes";

export const houses = (
  state = {
    isLoading: true,
    errMess: null,
    houses: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.HOUSES_LOADING:
      return {
        ...state,
        isLoading: true,
        errMess: null,
      };
    case ActionTypes.ADD_HOUSES:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        houses: action.payload,
      };
    case ActionTypes.ADD_HOUSE:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        houses: state.houses.concat(action.payload),
      };
    default:
      return state;
  }
};
