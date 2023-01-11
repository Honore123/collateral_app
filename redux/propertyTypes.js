import * as ActionTypes from "./actionTypes";

export const propertytypes = (
  state = {
    isLoading: true,
    errMess: null,
    propertytypes: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_PROPERTYTYPE:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        propertytypes: action.payload,
      };
    default:
      return state;
  }
};
