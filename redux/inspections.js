import * as ActionTypes from "./actionTypes";

export const inspections = (
  state = {
    isLoading: true,
    errMess: null,
    inspections: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.REQUEST_INSPECTION:
      return {
        ...state,
        isLoading: true,
        errMess: null,
      };
    case ActionTypes.ADD_INSPECTIONS:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        inspections: action.payload,
      };
    case ActionTypes.ADD_INSPECTION:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        inspections: state.inspections.concat(action.payload),
      };
    case ActionTypes.INSPECTION_SUBMIT:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        inspections: state.inspections.map((inspection) =>
          inspection.id === action.payload.id
            ? { ...inspection, status: action.payload.status }
            : inspection
        ),
      };
    case ActionTypes.UPDATE_INSPECTIION:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        inspections: state.inspections.map((inspection) =>
          action.payload.id === inspection.id
            ? { inspection: action.payload }
            : inspection
        ),
      };
    default:
      return state;
  }
};
