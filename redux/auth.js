import * as ActionTypes from "./actionTypes";
import * as SecureStore from "expo-secure-store";

export const auth = (
  state = {
    isLoading: false,
    isAuthenticated: false,
    token: "",
    user: null,
    errMess: null,
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        isAuthenticated: false,
      };
    case ActionTypes.LOGIN_SUCCESS:
      return {
        isLoading: false,
        isAuthenticated: true,
        errMess: null,
        token: action.response.token,
        user: action.response.user,
      };
    case ActionTypes.LOGIN_FAILURE:
      return {
        isLoading: false,
        isAuthenticated: false,
        errMess: action.message,
      };
    case ActionTypes.LOGOUT_REQUEST:
      return { ...state, isLoading: true, isAuthenticated: true };
    case ActionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        token: "",
        user: null,
      };
    case ActionTypes.CHANGE_ACCOUNT:
      return { ...state, isLoading: false, user: action.payload };
    default:
      return state;
  }
};
