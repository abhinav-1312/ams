import {
  FETCH_EMPLOYEES,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  ACTIVATE_EMPLOYEE,
  DEACTIVATE_EMPLOYEE,
} from "../actions/employeeActions"; // Import the employee action types
import { Employee } from "../../pages/employeeModule/EmployeeInterface"; // Import your Employee interface

export interface EmployeeState {
  employees: Employee[];
}

const initialState: EmployeeState = {
  employees: [],
};

const employeeReducer = (
  state = initialState,
  action: any
): EmployeeState => {
  switch (action.type) {
    case FETCH_EMPLOYEES:
      return {
        ...state,
        employees: action.payload,
      };
    case ADD_EMPLOYEE:
      return {
        ...state,
        employees: [...state.employees, action.payload],
      };
    case UPDATE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.map((employee) =>
          employee.employeeId === action.payload.employeeId
            ? action.payload
            : employee
        ),
      };
    case ACTIVATE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.map((employee) =>
          employee.employeeId === action.payload
            ? { ...employee, employeeStatus: true }
            : employee
        ),
      };
    case DEACTIVATE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.map((employee) =>
          employee.employeeId === action.payload
            ? { ...employee, employeeStatus: false }
            : employee
        ),
      };
    default:
      return state;
  }
};

export default employeeReducer;
