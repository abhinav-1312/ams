import {
  FETCH_DEPARTMENTS,
  ADD_DEPARTMENT,
  UPDATE_DEPARTMENT,
  ACTIVATE_DEPARTMENT,
  DEACTIVATE_DEPARTMENT, 
} from "../actions/departmentActions";
import { Department } from "../../pages/Department/DprtInterface";

export interface DepartmentState {
  departments: Department[];
}

const initialState: DepartmentState = {
  departments: [],
};

const departmentReducer = (
  state = initialState,
  action: any
): DepartmentState => {
  switch (action.type) {
    case FETCH_DEPARTMENTS:
      return {
        ...state,
        departments: action.payload,
      };
    case ADD_DEPARTMENT:
      return {
        ...state,
        departments: [...state.departments, action.payload],
      };
    case UPDATE_DEPARTMENT:
      return {
        ...state,
        departments: state.departments.map((department) =>
          department.departmentId === action.payload.departmentId
            ? action.payload
            : department
        ),
      };

    case ACTIVATE_DEPARTMENT:
      return {
        ...state,
        departments: state.departments.map((department) =>
          department.departmentId === action.payload
            ? { ...department, departmentStatus: true }
            : department
        ),
      };
    case DEACTIVATE_DEPARTMENT:
      return {
        ...state,
        departments: state.departments.map((department) =>
          department.departmentId === action.payload
            ? { ...department, departmentStatus: false }
            : department
        ),
      };
    default:
      return state;
  }
};

export default departmentReducer;
